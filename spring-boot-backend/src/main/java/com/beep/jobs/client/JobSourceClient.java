package com.beep.jobs.client;

import com.beep.jobs.dto.RawJob;
import java.util.List;

public interface JobSourceClient {
    String name();
    List<RawJob> fetch();
}
