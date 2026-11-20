package com.beep.jobs.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public record JobRequest(
        @NotBlank String source,
        @NotBlank String sourceJobId,
        @NotBlank String title,
        @NotBlank String company,
        String locationRaw,
        String description,
        String applyUrl,
        LocalDateTime postedAt
) {
}
