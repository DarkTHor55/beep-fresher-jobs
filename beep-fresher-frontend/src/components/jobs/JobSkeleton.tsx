export function JobSkeleton(): JSX.Element {
  return (
    <article className="job-card min-h-[220px] p-5" aria-busy="true" aria-label="Loading job">
      <div className="flex items-start gap-3">
        <div className="skeleton h-11 w-11 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton h-4 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
        </div>
      </div>
      <div className="mt-5 space-y-2 pl-14">
        <div className="skeleton h-3.5 w-2/5" />
        <div className="skeleton h-3.5 w-3/5" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="skeleton h-7 w-24 rounded-full" />
        <div className="skeleton h-7 w-20 rounded-full" />
      </div>
      <div className="mt-5 flex justify-between border-t border-slate-200 pt-3">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-11 w-24 rounded-xl" />
      </div>
    </article>
  );
}
