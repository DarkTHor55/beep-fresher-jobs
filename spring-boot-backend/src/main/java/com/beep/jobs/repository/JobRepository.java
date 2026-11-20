package com.beep.jobs.repository;

import com.beep.jobs.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    boolean existsByUrlHash(String urlHash);

    boolean existsByDedupeKey(String dedupeKey);
    @Query("select max(j.fetchedAt) from Job j")
    LocalDateTime findLatestFetchedAt();

    Optional<Job> findBySourceAndSourceJobId(String source, String sourceJobId);
}
