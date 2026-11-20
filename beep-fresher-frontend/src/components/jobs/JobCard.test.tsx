import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from './JobCard';

const baseJob = {
  id: 1,
  source: 'test',
  sourceJobId: 'src_1',
  title: 'Software Engineer Intern',
  company: 'TestCorp',
  locationRaw: 'Bengaluru, Karnataka',
  description: 'Internship for freshers.',
  applyUrl: 'https://example.com/apply/1',
  postedAt: '2026-01-15T10:00:00Z',
  roleTag: 'SWE',
  cityTag: 'Bengaluru',
  tagConfidence: 0.95,
  fresherOrIntern: true,
};

function renderJobCard(overrides: Partial<typeof baseJob> = {}) {
  const job = { ...baseJob, ...overrides };
  const onSelect = vi.fn();
  render(<JobCard job={job} onSelect={onSelect} />);
  return { onSelect, job };
}

describe('JobCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job title, company, and location', () => {
    renderJobCard();
    expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument();
    expect(screen.getByText('TestCorp')).toBeInTheDocument();
    expect(screen.getByText('Bengaluru')).toBeInTheDocument();
  });

  it('renders role chip when roleTag is present', () => {
    renderJobCard();
    expect(screen.getByText('SWE')).toBeInTheDocument();
  });

  it('does not render role chip when roleTag is null', () => {
    renderJobCard({ roleTag: null });
    expect(screen.queryByText('SWE')).not.toBeInTheDocument();
  });

  it('does not render city chip when cityTag is null', () => {
    renderJobCard({ cityTag: null });
    expect(screen.queryByText('Bengaluru')).not.toBeInTheDocument();
  });

  it('renders fresher badge when fresherOrIntern is true', () => {
    renderJobCard();
    expect(screen.getByText('Fresher / Intern')).toBeInTheDocument();
  });

  it('does not render fresher badge when fresherOrIntern is false', () => {
    renderJobCard({ fresherOrIntern: false });
    expect(screen.queryByText('Fresher / Intern')).not.toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const { onSelect } = renderJobCard();
    fireEvent.click(screen.getByText('Software Engineer Intern'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('calls onSelect when Enter is pressed', () => {
    const { onSelect } = renderJobCard();
    const card = screen.getByRole('button', {
      name: /View job: Software Engineer Intern at TestCorp/,
    });
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('does not render description (shown in detail view only)', () => {
    renderJobCard({ description: '<script>alert("xss")</script>' });
    // Description is not rendered in JobCard - only in JobDetailDrawer
    expect(screen.queryByText('<script>alert("xss")</script>')).not.toBeInTheDocument();
  });

  it('does not crash when description is null', () => {
    renderJobCard({ description: null });
    expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument();
  });
});
