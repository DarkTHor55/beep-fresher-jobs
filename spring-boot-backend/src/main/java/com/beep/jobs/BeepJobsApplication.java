package com.beep.jobs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeepJobsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeepJobsApplication.class, args);
    }
}
