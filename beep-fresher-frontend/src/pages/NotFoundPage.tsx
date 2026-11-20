import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function NotFoundPage(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary">
      <div className="container px-4 text-center">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-rose-50 dark:bg-rose-900/30 mb-6">
          <AlertTriangle className="h-12 w-12 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="text-2xl font-semibold text-text mb-2">Page not found</h1>
        <p className="text-sm text-text-muted dark:text-text-muted mb-6 max-w-md">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 dark:bg-accent-500 dark:hover:bg-accent-600"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
