import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders "No jobs match your filters" when hasFilters is true', () => {
    render(<EmptyState hasFilters={true} onClearFilters={vi.fn()} />);
    expect(screen.getByText('No jobs match your filters')).toBeInTheDocument();
  });

  it('renders "No jobs available yet" when hasFilters is false', () => {
    render(<EmptyState hasFilters={false} onClearFilters={vi.fn()} />);
    expect(screen.getByText('No jobs available yet')).toBeInTheDocument();
  });

  it('calls onClearFilters when Clear all filters button is clicked', () => {
    const onClearFilters = vi.fn();
    render(<EmptyState hasFilters={true} onClearFilters={onClearFilters} />);
    fireEvent.click(screen.getByText(/Clear all filters/));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
