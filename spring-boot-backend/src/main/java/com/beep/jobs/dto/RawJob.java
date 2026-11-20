package com.beep.jobs.dto;

import java.time.LocalDateTime;

public record RawJob(
        String source,
        String sourceJobId,
        String title,
        String company,
        String location,
        String description,
        String applyUrl,
        LocalDateTime postedAt
) {
}
