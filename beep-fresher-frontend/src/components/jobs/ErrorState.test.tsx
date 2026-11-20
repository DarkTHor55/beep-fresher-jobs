import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error message', () => {
    render(<ErrorState message="Something went wrong" onRetry={vi.fn()} />);
    expect(screen.getByText('Unable to load jobs')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onRetry when Try again button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    fireEvent.click(screen.getByText(/Try again/));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
