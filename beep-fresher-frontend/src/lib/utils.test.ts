import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatAbsoluteDate } from './utils';

describe('formatRelativeTime', () => {
  it('returns null for null input', () => {
    expect(formatRelativeTime(null)).toBeNull();
  });

  it('returns null for invalid date', () => {
    expect(formatRelativeTime('not-a-date')).toBeNull();
  });

  it('returns relative time for minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = formatRelativeTime(date);
    expect(result).toContain('5 min ago');
  });

  it('returns relative time for hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(date);
    expect(result).toContain('3 hr ago');
  });

  it('returns relative time for days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(date);
    expect(result).toMatch(/2 day/);
  });

  it('returns absolute date for older dates', () => {
    const result = formatRelativeTime('2020-01-15T10:00:00Z');
    expect(result).toContain('2020');
  });
});

describe('formatAbsoluteDate', () => {
  it('returns null for null input', () => {
    expect(formatAbsoluteDate(null)).toBeNull();
  });

  it('returns formatted date string', () => {
    const result = formatAbsoluteDate('2026-01-15T10:00:00Z');
    expect(result).toContain('15');
    expect(result).toContain('Jan');
    expect(result).toContain('2026');
  });
});
