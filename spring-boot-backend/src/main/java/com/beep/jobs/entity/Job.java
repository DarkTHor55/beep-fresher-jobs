package com.beep.jobs.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String sourceJobId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(name = "location_raw")
    private String locationRaw;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "apply_url")
    private String applyUrl;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;

    @Column(name = "url_hash", unique = true)
    private String urlHash;

    @Column(name = "dedupe_key", unique = true)
    private String dedupeKey;

    @Column(name = "is_fresher_or_intern")
    private Boolean fresherStatus;

    @Column(name = "role_tag")
    private String roleTag;

    @Column(name = "city_tag")
    private String cityTag;

    @Column(name = "tag_confidence")
    private Double tagConfidence;

    @Column(name = "llm_input_tokens")
    private Integer llmInputTokens;

    @Column(name = "llm_output_tokens")
    private Integer llmOutputTokens;

    @Column(nullable = false)
    private String status = "active";
}
