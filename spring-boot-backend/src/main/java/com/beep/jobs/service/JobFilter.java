package com.beep.jobs.service;

import com.beep.jobs.dto.RawJob;
import com.beep.jobs.entity.JobFilterDecision;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JobFilter {

    private static final List<String> INDIA = List.of(
            "india",
            // cities
            "bengaluru", "bangalore", "mumbai", "delhi", "gurgaon", "gurugram", "noida",
            "hyderabad", "pune", "chennai", "kolkata", "ahmedabad", "jaipur", "chandigarh",
            "indore", "kochi", "coimbatore", "lucknow",
            // states
            "karnataka", "maharashtra", "tamil nadu", "telangana", "uttar pradesh", "haryana",
            "gujarat", "rajasthan", "west bengal", "kerala", "madhya pradesh", "odisha",
            "bihar", "andhra pradesh", "assam", "jharkhand", "uttarakhand", "chhattisgarh",
            "goa", "himachal pradesh"
    );

    private static final Pattern FRESHER_TITLE = Pattern.compile(
            "\\b(fresher|freshers|intern|interns|internship|trainee|apprentice|graduate|entry[- ]level)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern FRESHER_STRONG = Pattern.compile(
            "\\b(fresher|freshers|entry[- ]level|no experience)\\b"
                    + "|\\b0\\s*(?:-|to)\\s*[12]\\s*(?:years?|yrs?)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern SENIOR = Pattern.compile(
            "\\b(senior|sr\\.?|lead|principal|staff|head|director|architect)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern MANAGER = Pattern.compile("\\bmanager\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern PRODUCT_OR_PROJECT_MANAGER = Pattern.compile(
            "\\b(product|project)\\s+manager\\b", Pattern.CASE_INSENSITIVE);

    private static final Pattern YEARS_THEN_EXP = Pattern.compile(
            "(\\d{1,2})\\s*\\+?\\s*(?:-\\s*\\d{1,2}\\s*)?(?:years?|yrs?)\\b[^.\\n]{0,30}?\\b(?:experience|exp)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern EXP_THEN_YEARS = Pattern.compile(
            "\\b(?:experience|exp)\\b[^.\\n]{0,30}?(\\d{1,2})\\s*\\+?\\s*(?:-\\s*\\d{1,2}\\s*)?(?:years?|yrs?)\\b",
            Pattern.CASE_INSENSITIVE);

    public JobFilterDecision evaluate(RawJob r) {
        String loc = r.location() == null ? "" : r.location().toLowerCase();
        if (!loc.isBlank() && !loc.contains("remote") && INDIA.stream().noneMatch(loc::contains)) {
            return JobFilterDecision.REJECT;
        }

        String title = r.title() == null ? "" : r.title();
        boolean fresherTitle = FRESHER_TITLE.matcher(title).find();

        if (SENIOR.matcher(title).find()) {
            return JobFilterDecision.REJECT;
        }
        if (MANAGER.matcher(title).find()
                && !PRODUCT_OR_PROJECT_MANAGER.matcher(title).find()
                && !fresherTitle) {
            return JobFilterDecision.REJECT;
        }

        String desc = r.description() == null ? "" : r.description();
        String text = title + " " + desc.substring(0, Math.min(1500, desc.length()));

        if (requiredYears(text) >= 2) {
            return JobFilterDecision.REJECT;
        }
        if (fresherTitle) return JobFilterDecision.ACCEPT;

        return FRESHER_STRONG.matcher(text).find()
                ? JobFilterDecision.ACCEPT
                : JobFilterDecision.UNSURE;
    }

    private static int requiredYears(String text) {
        int max = 0;
        for (Pattern p : List.of(YEARS_THEN_EXP, EXP_THEN_YEARS)) {
            Matcher m = p.matcher(text);
            while (m.find()) {
                max = Math.max(max, Integer.parseInt(m.group(1)));
            }
        }
        return max;
    }
}
