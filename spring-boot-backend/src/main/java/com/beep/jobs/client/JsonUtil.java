package com.beep.jobs.client;

import com.fasterxml.jackson.databind.JsonNode;

public class JsonUtil {

    public static String text(JsonNode n, String f) {
        return n != null && n.hasNonNull(f) ? n.get(f).asText() : null;
    }
}
