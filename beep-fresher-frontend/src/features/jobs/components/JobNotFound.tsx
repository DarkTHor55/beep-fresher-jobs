import { Link } from 'react-router-dom';

export function JobNotFound(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-rose-50 dark:bg-rose-900/30 mb-6">
        <svg className="h-10 w-10 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-text">Job not found</h2>
      <p className="text-sm text-text-muted dark:text-text-muted mt-2 max-w-md">
        The job listing you're looking for is no longer available or doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/30"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Browse all jobs
      </Link>
    </div>
  );
}
