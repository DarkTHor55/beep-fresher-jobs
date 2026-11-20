package com.beep.jobs.controller;

import com.beep.jobs.dto.JobRequest;
import com.beep.jobs.dto.JobResponse;
import com.beep.jobs.dto.PageResponse;
import com.beep.jobs.service.JobIngestionService;
import com.beep.jobs.service.JobService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.*;
import com.beep.jobs.service.JobService;
import com.beep.jobs.service.JobIngestionService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class JobController {

    private final JobService jobService;
    private final JobIngestionService ingestion;

    public JobController(JobService jobService, JobIngestionService ingestion) {
        this.jobService = jobService;
        this.ingestion = ingestion;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/jobs")
    public PageResponse<JobResponse> getJobs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "25") @Min(1) @Max(50) int pageSize) {

        ingestion.refreshIfStale();
        return jobService.searchJobs(q, role, city, page, pageSize);
    }

    @GetMapping("/jobs/{id}")
    public JobResponse getJob(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of("message", "Use /jobs to see paginated results");
    }

    @PostMapping("/jobs")
    public JobResponse createJob(@Valid @RequestBody JobRequest jobRequest) {
        return jobService.saveJob(jobRequest);
    }
}
