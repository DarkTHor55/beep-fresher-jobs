package com.beep.jobs.service;

import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.regex.Pattern;

@Component
public class JobTagger {

    private static final Pattern SPACE = Pattern.compile("\\s+");

    public String role(String title) {
        String value = normalize(title);
        if (value.isBlank()) return "Other";

        if (has(value, "data scientist", "machine learning", "ml engineer", "ai engineer")) return "Data Scientist";
        if (has(value, "data analyst", "business intelligence", "bi analyst", "analytics analyst")) return "Data Analyst";
        if (has(value, "data engineer", "analytics engineer")) return "Data Engineer";
        if (has(value, "devops", "site reliability", "sre", "cloud engineer", "platform engineer")) return "DevOps Engineer";
        if (has(value, "quality assurance", "qa engineer", "test engineer", "software tester", "automation tester")) return "QA Engineer";
        if (has(value, "product manager", "project manager")) return "Product Manager";
        if (has(value, "ux designer", "user experience designer")) return "UX Designer";
        if (has(value, "ui designer", "visual designer", "user interface designer")) return "UI Designer";
        if (has(value, "full stack", "fullstack", "full-stack")) return "Full Stack Developer";
        if (has(value, "frontend", "front-end", "front end")) return "Frontend Developer";
        if (has(value, "backend", "back-end", "back end")) return "Backend Developer";
        if (has(value, "web developer", "web engineer")) return "Web Developer";
        if (has(value, "mobile developer", "mobile engineer", "android developer", "ios developer", "ios engineer")) return "Mobile Developer";
        if (has(value, "software engineer", "software developer", "sde", "application developer", "developer")) return "Software Developer";
        return "Other";
    }

    public String city(String location) {
        String value = normalize(location);
        if (value.isBlank()) return null;

        if (has(value, "remote", "work from home", "anywhere in india")) return "Remote";
        if (has(value, "delhi", "new delhi", "gurgaon", "gurugram", "noida", "faridabad", "ghaziabad", "ncr")) return "Delhi NCR";
        if (has(value, "bengaluru", "bangalore")) return "Bengaluru";
        if (has(value, "mumbai", "bombay")) return "Mumbai";
        if (has(value, "hyderabad", "secunderabad")) return "Hyderabad";
        if (has(value, "pune")) return "Pune";
        if (has(value, "chennai", "madras")) return "Chennai";
        if (has(value, "kolkata", "calcutta")) return "Kolkata";
        if (has(value, "ahmedabad")) return "Ahmedabad";
        if (has(value, "jaipur")) return "Jaipur";
        if (has(value, "chandigarh", "mohali", "panchkula")) return "Chandigarh";
        if (has(value, "indore")) return "Indore";
        if (has(value, "kochi", "cochin")) return "Kochi";
        if (has(value, "coimbatore")) return "Coimbatore";
        if (has(value, "lucknow")) return "Lucknow";
        return null;
    }

    public double confidence(String title, String location) {
        double roleConfidence = "Other".equals(role(title)) ? 0.55 : 0.9;
        double cityConfidence = city(location) == null ? 0.55 : 0.9;
        return Math.min(roleConfidence, cityConfidence);
    }

    private static String normalize(String input) {
        if (input == null) return "";
        return SPACE.matcher(input.toLowerCase(Locale.ROOT).replaceAll("[^\\p{L}\\p{N}]+", " "))
                .replaceAll(" ").trim();
    }

    private static boolean has(String value, String... terms) {
        for (String term : terms) {
            String normalizedTerm = normalize(term);
            if (value.contains(normalizedTerm)) return true;
        }
        return false;
    }
}
