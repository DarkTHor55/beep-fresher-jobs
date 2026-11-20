package com.beep.jobs.util;

import com.beep.jobs.dto.RawJob;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public enum Decision { ACCEPT, REJECT, UNSURE }
