package com.beep.jobs.service;

import com.beep.jobs.dto.JobRequest;
import com.beep.jobs.dto.JobResponse;
import com.beep.jobs.dto.PageResponse;
import com.beep.jobs.entity.Job;
import com.beep.jobs.exception.JobNotFoundException;
import com.beep.jobs.repository.JobRepository;
import com.beep.jobs.util.JobKeys;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobTagger tagger;
    private volatile boolean tagsBackfilled;

    public JobService(JobRepository jobRepository, JobTagger tagger) {
        this.jobRepository = jobRepository;
        this.tagger = tagger;
    }

    @Transactional
    public PageResponse<JobResponse> searchJobs(
            String q, String role, String city, int page, int pageSize) {

        backfillTagsIfNeeded();

        page = Math.max(page, 1);
        pageSize = Math.min(Math.max(pageSize, 1), 50);

        Specification<Job> spec = (root, query, cb) -> cb.equal(root.get("status"), "active");

        if (StringUtils.hasText(q)) {
            String like = "%" + q.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("company")), like),
                    cb.like(cb.lower(root.get("description")), like)));
        }
        if (StringUtils.hasText(role)) {
            String canonicalRole = tagger.role(role);
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("roleTag")), canonicalRole.toLowerCase()));
        }
        if (StringUtils.hasText(city)) {
            String canonicalCity = tagger.city(city);
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("cityTag")),
                            (canonicalCity == null ? city.trim() : canonicalCity).toLowerCase()));
        }

        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "postedAt"));
        Page<Job> result = jobRepository.findAll(spec, pageable);

        List<JobResponse> jobs = result.getContent().stream().map(this::toResponse).toList();

        return new PageResponse<>(jobs, page, pageSize,
                result.getTotalElements(), result.getTotalPages());
    }

    private void backfillTagsIfNeeded() {
        if (tagsBackfilled) return;
        synchronized (this) {
            if (tagsBackfilled) return;
            List<Job> jobsMissingTags = jobRepository.findAll((root, query, cb) -> cb.or(
                    cb.isNull(root.get("roleTag")),
                    cb.isNull(root.get("cityTag"))));
            for (Job job : jobsMissingTags) {
                if (job.getRoleTag() == null) job.setRoleTag(tagger.role(job.getTitle()));
                if (job.getCityTag() == null) job.setCityTag(tagger.city(job.getLocationRaw()));
                if (job.getTagConfidence() == null) {
                    job.setTagConfidence(tagger.confidence(job.getTitle(), job.getLocationRaw()));
                }
            }
            jobRepository.saveAll(jobsMissingTags);
            tagsBackfilled = true;
        }
    }

    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new JobNotFoundException("Job not found with id: " + id));
        return toResponse(job);
    }

    @Transactional
    public JobResponse saveJob(JobRequest req) {
        String urlHash = req.applyUrl() == null ? null : JobKeys.urlHash(req.applyUrl());
        if (urlHash != null && jobRepository.existsByUrlHash(urlHash)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Job already exists");
        }

        Job job = new Job();
        job.setSource(req.source());
        job.setSourceJobId(req.sourceJobId());
        job.setTitle(req.title());
        job.setCompany(req.company());
        job.setLocationRaw(req.locationRaw());
        job.setDescription(req.description());
        job.setApplyUrl(req.applyUrl());
        job.setPostedAt(req.postedAt());
        job.setUrlHash(urlHash);
        job.setDedupeKey(JobKeys.dedupeKey(req.company(), req.title(), req.locationRaw()));
        job.setFetchedAt(LocalDateTime.now());
        job.setStatus("active");
        job.setRoleTag(tagger.role(req.title()));
        job.setCityTag(tagger.city(req.locationRaw()));
        job.setTagConfidence(tagger.confidence(req.title(), req.locationRaw()));

        return toResponse(jobRepository.save(job));
    }

    private JobResponse toResponse(Job job) {
        JobResponse r = new JobResponse();
        r.setId(job.getId());
        r.setSource(job.getSource());
        r.setTitle(job.getTitle());
        r.setCompany(job.getCompany());
        r.setLocationRaw(job.getLocationRaw());
        r.setDescription(job.getDescription());
        r.setApplyUrl(job.getApplyUrl());
        r.setPostedAt(job.getPostedAt());
        r.setRoleTag(job.getRoleTag());
        r.setCityTag(job.getCityTag());
        r.setTagConfidence(job.getTagConfidence());
        r.setFresherOrIntern(Boolean.TRUE.equals(job.getFresherStatus()));
        return r;
    }
}
