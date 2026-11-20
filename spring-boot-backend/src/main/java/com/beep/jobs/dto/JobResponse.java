package com.beep.jobs.dto;

import com.beep.jobs.entity.Job;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@RequiredArgsConstructor
public class JobResponse{
        Long id;
        String source;
        String title;
        String company;
        String locationRaw;
        String description;
        String applyUrl;
        LocalDateTime postedAt;
        Boolean fresherOrIntern;
        String roleTag;
        String cityTag;
        Double tagConfidence;


}
