import { Briefcase, RefreshCw, Search } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-surface px-5 py-14 text-center dark:border-slate-800">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-800">
        {hasFilters ? (
          <Search className="h-6 w-6" />
        ) : (
          <Briefcase className="h-6 w-6" />
        )}
      </div>
      <h2 className="font-display text-lg font-semibold text-text">
        {hasFilters ? 'No matches this time' : 'New opportunities are on the way'}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {hasFilters
          ? 'Try another role or location and see what turns up.'
          : 'Check back soon for fresher and internship roles.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" /> Clear all filters
        </button>
      )}
    </div>
  );
}
