package com.beep.jobs.client;

import com.beep.jobs.dto.RawJob;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class JobsPipeClient implements JobSourceClient {

    private static final Logger log = LoggerFactory.getLogger(JobsPipeClient.class);

    private final RestClient http;
    private final int limit;
    private final int maxPages;
    private final boolean configured;

    public JobsPipeClient(
            @Value("${jobs.jobspipe.base-url}") String baseUrl,
            @Value("${jobs.jobspipe.api-key:}") String apiKey,
            @Value("${jobs.jobspipe.limit:25}") int limit,
            @Value("${jobs.jobspipe.max-pages:10}") int maxPages
    ) {
        this.configured = apiKey != null && !apiKey.isBlank();
        RestClient.Builder builder = RestClient.builder().baseUrl(baseUrl);
        if (configured) builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey.trim());
        this.http = builder.build();
        this.limit = Math.max(1, Math.min(limit, 25));
        this.maxPages = Math.max(1, Math.min(maxPages, 10));
    }

    @Override
    public String name() {
        return "jobspipe";
    }

    @Override
    public List<RawJob> fetch() {
        if (!configured) {
            log.warn("JobsPipe skipped: set JOBSPIPE_API_KEY to enable this source");
            return List.of();
        }
        List<RawJob> out = new ArrayList<>();
        String cursor = null;

        for (int page = 0; page < maxPages; page++) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("job_country_code_or", List.of("IN"));
            body.put("job_seniority_or", List.of("entry", "internship"));
            body.put("include_unlabeled_seniority", true);
            body.put("posted_at_max_age_days", 30);
            body.put("limit", limit);
            if (cursor != null) body.put("cursor", cursor);

            JsonNode root = http.post()
                    .uri("/v1/jobs/search")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            if (root == null) break;
            JsonNode jobs = root.path("data");
            if (!jobs.isArray() || jobs.isEmpty()) break;

            for (JsonNode job : jobs) out.add(toRawJob(job));

            String nextCursor = JsonUtil.text(root.path("metadata"), "next_cursor");
            if (nextCursor == null || nextCursor.isBlank() || nextCursor.equals(cursor)) break;
            cursor = nextCursor;
        }

        log.info("JobsPipe returned {} postings across up to {} pages", out.size(), maxPages);
        return out;
    }

    private RawJob toRawJob(JsonNode job) {
        String url = Optional.ofNullable(JsonUtil.text(job, "final_url"))
                .filter(value -> !value.isBlank())
                .orElse(JsonUtil.text(job, "url"));
        String posted = JsonUtil.text(job, "date_posted");
        LocalDateTime postedAt = null;
        if (posted != null) {
            try {
                postedAt = java.time.OffsetDateTime.parse(posted)
                        .withOffsetSameInstant(ZoneOffset.UTC)
                        .toLocalDateTime();
            } catch (Exception ignored) {
            }
        }
        return new RawJob(
                "jobspipe",
                JsonUtil.text(job, "id"),
                JsonUtil.text(job, "job_title"),
                JsonUtil.text(job, "company"),
                JsonUtil.text(job, "location"),
                JsonUtil.text(job, "description"),
                url,
                postedAt
        );
    }
}
