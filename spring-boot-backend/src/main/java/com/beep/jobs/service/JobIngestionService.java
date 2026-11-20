package com.beep.jobs.service;

import com.beep.jobs.client.JobSourceClient;
import com.beep.jobs.dto.RawJob;
import com.beep.jobs.entity.Job;
import com.beep.jobs.entity.JobFilterDecision;
import com.beep.jobs.repository.JobRepository;
import com.beep.jobs.util.JobKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.HttpStatusCodeException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobIngestionService {

    private static final Logger log = LoggerFactory.getLogger(JobIngestionService.class);
    private static final Duration STALE_AFTER = Duration.ofHours(24);
    private static final Duration MIN_RETRY_GAP = Duration.ofHours(1);

    private final List<JobSourceClient> clients;
    private final JobFilter filter;
    private final JobTagger tagger;
    private final GeminiJobTagger geminiTagger;
    private final JobRepository repo;
    private volatile Instant lastAttempt = Instant.EPOCH;

    public JobIngestionService(List<JobSourceClient> clients, JobFilter filter, JobTagger tagger, GeminiJobTagger geminiTagger, JobRepository repo) {
        this.clients = clients;
        this.filter = filter;
        this.tagger = tagger;
        this.geminiTagger = geminiTagger;
        this.repo = repo;
    }

    public void refreshIfStale() {
        if (!needsRefresh()) return;
        synchronized (this) {
            if (!needsRefresh()) return;
            lastAttempt = Instant.now();
            try {
                refresh();
            } catch (Exception e) {
                log.error("refresh failed", e);
            }
        }
    }

    private boolean needsRefresh() {
        if (Duration.between(lastAttempt, Instant.now()).compareTo(MIN_RETRY_GAP) < 0) return false;
        LocalDateTime last = repo.findLatestFetchedAt();
        return last == null || last.isBefore(LocalDateTime.now().minus(STALE_AFTER));
    }

    @Scheduled(
            cron = "${jobs.refresh.cron:0 0 5 * * *}",
            zone = "${jobs.refresh.zone:Asia/Kolkata}"
    )
    public void refreshDaily() {
        synchronized (this) {
            lastAttempt = Instant.now();
            log.info("daily scheduled job refresh started");
            try {
                refresh();
            } catch (Exception e) {
                log.error("daily scheduled job refresh failed", e);
            }
        }
    }
    public Map<String, Integer> refresh() {
        int fetched = 0, rejected = 0, dups = 0, saved = 0, failed = 0;

        for (JobSourceClient client : clients) {
            List<RawJob> raws;
            try {
                raws = client.fetch();
            } catch (HttpStatusCodeException e) {
                logHttpError(client.name(), e);
                continue;
            } catch (Exception e) {
                log.error("source {} failed", client.name(), e);
                continue;
            }

            Map<Integer, GeminiJobTagger.AiTag> aiTags = geminiTagger.tag(raws);
            for (int rawIndex = 0; rawIndex < raws.size(); rawIndex++) {
                RawJob r = raws.get(rawIndex);
                GeminiJobTagger.AiTag aiTag = aiTags.get(rawIndex);
                fetched++;
                try {
                    if (r.title() == null || r.title().isBlank()
                            || r.company() == null || r.company().isBlank()
                            || r.applyUrl() == null || r.applyUrl().isBlank()) continue;

                    JobFilterDecision d = filter.evaluate(r);
                    if (d == JobFilterDecision.REJECT) { rejected++; continue; }

                    String urlHash = JobKeys.urlHash(r.applyUrl());
                    String key = JobKeys.dedupeKey(r.company(), r.title(), r.location());
                    if (repo.existsByUrlHash(urlHash) || repo.existsByDedupeKey(key)) { dups++; continue; }

                    Job job = new Job();
                    job.setSource(r.source());
                    job.setSourceJobId(r.sourceJobId() == null || r.sourceJobId().isBlank()
                            ? urlHash : r.sourceJobId());
                    job.setTitle(cut(r.title(), 500));
                    job.setCompany(cut(r.company(), 255));
                    job.setLocationRaw(cut(r.location(), 255));
                    job.setDescription(cut(r.description(), 2000));
                    job.setApplyUrl(cut(r.applyUrl(), 2000));
                    job.setPostedAt(r.postedAt());
                    job.setUrlHash(urlHash);
                    job.setDedupeKey(key);
                    job.setFetchedAt(LocalDateTime.now());
                    job.setStatus("active");
                    job.setFresherStatus(d == JobFilterDecision.ACCEPT ? Boolean.TRUE : null);
                    job.setRoleTag(aiTag != null ? aiTag.role() : tagger.role(r.title()));
                    job.setCityTag(aiTag != null && aiTag.city() != null
                            ? aiTag.city() : tagger.city(r.location()));
                    job.setTagConfidence(tagger.confidence(r.title(), r.location()));
                    if (aiTag != null) {
                        job.setLlmInputTokens(aiTag.inputTokens());
                        job.setLlmOutputTokens(aiTag.outputTokens());
                    }
                    repo.save(job);
                    saved++;
                } catch (DataIntegrityViolationException e) {
                    dups++;
                } catch (Exception e) {
                    failed++;
                    log.warn("skipping job '{}' from {}: {}", r.title(), client.name(), e.getMessage());
                }
            }
        }

        log.info("refresh fetched={} rejected={} dups={} saved={} failed={}",
                fetched, rejected, dups, saved, failed);
        return Map.of("fetched", fetched, "rejected", rejected,
                "duplicates", dups, "saved", saved, "failed", failed);
    }

    private void logHttpError(String source, HttpStatusCodeException e) {
        Map<String, String> limits = new LinkedHashMap<>();
        HttpHeaders h = e.getResponseHeaders();
        if (h != null) {
            h.forEach((k, v) -> {
                String lk = k.toLowerCase();
                if (lk.contains("ratelimit") || lk.contains("retry-after")) {
                    limits.put(k, String.join(",", v));
                }
            });
        }
        log.error("source {} failed: HTTP {} body={} limits={}",
                source, e.getStatusCode().value(), e.getResponseBodyAsString(), limits);
    }

    private static String cut(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }
}



