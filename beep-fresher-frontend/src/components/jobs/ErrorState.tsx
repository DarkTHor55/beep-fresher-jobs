import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-surface px-5 py-14 text-center dark:border-slate-800">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="font-display text-lg font-semibold text-text">Jobs haven’t loaded yet</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {message || 'Check your connection and try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <RefreshCw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}
