package com.beep.jobs.client;

import com.beep.jobs.dto.RawJob;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class JoobleClient implements JobSourceClient {

    private static final Logger log = LoggerFactory.getLogger(JoobleClient.class);
    private static final List<String> SEARCH_QUERIES = List.of(
            "fresher software jobs",
            "entry level jobs",
            "internship jobs",
            "graduate trainee jobs",
            "no experience jobs"
    );

    private final RestClient http;
    private final String apiKey;
    private final int pagesPerQuery;
    private final int resultsPerPage;
    private final boolean configured;

    public JoobleClient(
            @Value("${jobs.jooble.base-url:https://in.jooble.org}") String baseUrl,
            @Value("${jobs.jooble.api-key:}") String apiKey,
            @Value("${jobs.jooble.pages-per-query:4}") int pagesPerQuery,
            @Value("${jobs.jooble.results-per-page:25}") int resultsPerPage
    ) {
        this.http = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.configured = !this.apiKey.isBlank();
        this.pagesPerQuery = Math.max(1, Math.min(pagesPerQuery, 10));
        this.resultsPerPage = Math.max(1, Math.min(resultsPerPage, 50));
    }

    @Override
    public String name() {
        return "jooble";
    }

    @Override
    public List<RawJob> fetch() {
        if (!configured) {
            log.warn("Jooble skipped: set JOOBLE_API_KEY to enable this source");
            return List.of();
        }

        List<RawJob> out = new ArrayList<>();
        for (String query : SEARCH_QUERIES) {
            for (int page = 1; page <= pagesPerQuery; page++) {
                Map<String, Object> body = new LinkedHashMap<>();
                body.put("keywords", query);
                body.put("location", "India");
                body.put("page", page);
                body.put("ResultOnPage", resultsPerPage);
                body.put("companysearch", false);

                JsonNode root;
                try {
                    root = http.post()
                            .uri(uri -> uri.path("/api/{apiKey}").build(apiKey))
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(body)
                            .retrieve()
                            .body(JsonNode.class);
                } catch (RuntimeException error) {
                    // Jooble puts its key in the URL path; never log the exception/URL or response body.
                    if (error instanceof HttpStatusCodeException httpError) {
                        int status = httpError.getStatusCode().value();
                        log.warn("Jooble rejected query '{}' page {} with HTTP {}", query, page, status);
                        return out;
                    }
                    log.warn("Jooble request failed for query '{}' page ({})", query,
                            error.getClass().getSimpleName());
                    break;
                }

                JsonNode jobs = root == null ? null : root.path("jobs");
                if (jobs == null || !jobs.isArray() || jobs.isEmpty()) break;
                for (JsonNode job : jobs) out.add(toRawJob(job));
                if (jobs.size() < resultsPerPage) break;
            }
        }

        log.info("Jooble returned {} postings across {} queries (up to {} pages each)",
                out.size(), SEARCH_QUERIES.size(), pagesPerQuery);
        return out;
    }

    private RawJob toRawJob(JsonNode job) {
        LocalDateTime postedAt = null;
        String updated = JsonUtil.text(job, "updated");
        if (updated != null && !updated.isBlank()) {
            try {
                postedAt = OffsetDateTime.parse(updated).withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime();
            } catch (Exception ignored) {
                try {
                    postedAt = LocalDateTime.parse(updated);
                } catch (Exception ignoredAgain) {
                }
            }
        }
        return new RawJob(
                "jooble",
                JsonUtil.text(job, "id"),
                JsonUtil.text(job, "title"),
                JsonUtil.text(job, "company"),
                JsonUtil.text(job, "location"),
                JsonUtil.text(job, "snippet"),
                JsonUtil.text(job, "link"),
                postedAt
        );
    }
}

