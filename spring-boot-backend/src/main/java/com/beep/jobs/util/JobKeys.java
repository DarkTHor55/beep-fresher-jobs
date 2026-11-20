package com.beep.jobs.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

public final class JobKeys {
    private JobKeys() {}

    public static String urlHash(String url) { return sha256(canonical(url)); }

    public static String dedupeKey(String company, String title, String location) {
        return sha256(norm(company) + "|" + norm(title) + "|" + norm(location));
    }

    private static String norm(String s) {
        return s == null ? "" : s.toLowerCase().replaceAll("[^a-z0-9 ]", "").trim();
    }

    private static String canonical(String url) {
        return url.replaceAll("[?&]utm_[^&]*", "").replaceAll("#.*$", "").toLowerCase();
    }

    private static String sha256(String s) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
