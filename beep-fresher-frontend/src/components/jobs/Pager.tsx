import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PagerProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pager({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}: PagerProps): JSX.Element | null {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const canGoBack = page > 1;
  const canGoNext = page < totalPages;
  const firstPage = Math.max(1, Math.min(page - 1, totalPages - 2));
  const visiblePages = Array.from({ length: Math.min(totalPages, 3) }, (_, index) => firstPage + index);

  return (
    <nav className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row dark:border-slate-800" aria-label="Job results pages">
      <p className="text-sm text-slate-600">
        Showing {start}-{end} of {totalItems} jobs
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoBack}
          className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <div className="hidden sm:flex items-center gap-1 px-1">
          {visiblePages.map((p) => {
            const isActive = p === page;
            const showPage =
              p === 1 || p === totalPages || Math.abs(p - page) <= 1;
            if (!showPage) return null;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-11 min-w-11 rounded-xl text-sm font-semibold tabular-nums transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                aria-label={`Page ${p}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Next page"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
