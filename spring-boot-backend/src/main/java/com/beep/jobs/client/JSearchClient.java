package com.beep.jobs.client;

import com.beep.jobs.dto.RawJob;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Component
public class JSearchClient implements JobSourceClient {

    private static final Logger log = LoggerFactory.getLogger(JSearchClient.class);
    private static final List<String> SEARCH_QUERIES = List.of(
            "fresher jobs in India",
            "entry level jobs in India",
            "internship jobs in India",
            "graduate trainee jobs in India",
            "no experience jobs in India"
    );

    private final RestClient http;
    private final int pagesPerQuery;
    private final boolean configured;

    public JSearchClient(
            @Value("${jobs.jsearch.base-url}") String baseUrl,
            @Value("${jobs.jsearch.api-key:}") String apiKey,
            @Value("${jobs.jsearch.host}") String host,
            @Value("${jobs.jsearch.pages-per-query:4}") int pagesPerQuery
    ) {
        this.configured = apiKey != null && !apiKey.isBlank();
        RestClient.Builder builder = RestClient.builder().baseUrl(baseUrl)
                .defaultHeader("X-RapidAPI-Host", host);
        if (configured) builder.defaultHeader("X-RapidAPI-Key", apiKey.trim());
        this.http = builder.build();
        this.pagesPerQuery = Math.max(1, Math.min(pagesPerQuery, 20));
    }

    @Override
    public String name() {
        return "jsearch";
    }

    @Override
    public List<RawJob> fetch() {
        if (!configured) {
            log.warn("JSearch skipped: set JSEARCH_API_KEY to enable this source");
            return List.of();
        }
        List<RawJob> out = new ArrayList<>();
        for (String query : SEARCH_QUERIES) {
            JsonNode root;
            try {
                root = http.get()
                        .uri(uri -> uri.path("/search-v2")
                                .queryParam("query", query)
                                .queryParam("num_pages", pagesPerQuery)
                                .queryParam("country", "in")
                                .queryParam("date_posted", "month")
                                .build())
                        .retrieve()
                        .body(JsonNode.class);
            } catch (RuntimeException error) {
                if (error instanceof HttpStatusCodeException httpError) {
                    int status = httpError.getStatusCode().value();
                    log.warn("JSearch query failed ({}) with HTTP {}", query, status);
                    if (status == 403 || status == 429) {
                        log.warn("JSearch stopping remaining queries after HTTP {}", status);
                        break;
                    }
                } else {
                    log.warn("JSearch query failed ({}): {}", query, error.getClass().getSimpleName());
                }
                continue;
            }

            if (root == null) continue;
            JsonNode data = root.path("data");
            JsonNode jobs = data.isArray() ? data : data.path("jobs");
            if (!jobs.isArray()) continue;

            for (JsonNode job : jobs) out.add(toRawJob(job));
        }

        log.info("JSearch returned {} postings from {} queries (up to {} pages each)",
                out.size(), SEARCH_QUERIES.size(), pagesPerQuery);
        return out;
    }

    private RawJob toRawJob(JsonNode job) {
        String posted = firstText(job, "job_posted_at_datetime_utc", "job_posted_at");
        LocalDateTime postedAt = null;
        if (posted != null) {
            try {
                postedAt = LocalDateTime.ofInstant(Instant.parse(posted), ZoneOffset.UTC);
            } catch (Exception ignored) {
            }
        }

        String location = firstText(job, "job_location", "location");
        if (location == null || location.isBlank()) {
            String city = JsonUtil.text(job, "job_city");
            String state = JsonUtil.text(job, "job_state");
            location = String.join(", ", Stream.of(city, state)
                    .filter(value -> value != null && !value.isBlank()).toList());
        }

        return new RawJob(
                "jsearch",
                JsonUtil.text(job, "job_id"),
                JsonUtil.text(job, "job_title"),
                JsonUtil.text(job, "employer_name"),
                location,
                JsonUtil.text(job, "job_description"),
                firstText(job, "job_apply_link", "job_google_link"),
                postedAt
        );
    }

    private static String firstText(JsonNode node, String... fields) {
        for (String field : fields) {
            String value = JsonUtil.text(node, field);
            if (value != null && !value.isBlank()) return value;
        }
        return null;
    }
}
