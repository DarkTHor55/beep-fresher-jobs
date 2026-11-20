import { type JobResponse } from '../../lib/types';
import { formatRelativeTime, formatAbsoluteDate } from '../../lib/utils';
import { Avatar } from '../common/Avatar';
import { RoleChip } from '../common/RoleChip';
import { BadgeCheck, MapPin } from 'lucide-react';
import { CityChip } from '../common/CityChip';
import { ApplyButton } from '../common/ApplyButton';

interface JobCardProps {
  job: JobResponse;
  onSelect?: (id: number) => void;
}

export function JobCard({ job, onSelect }: JobCardProps): JSX.Element {
  const openDetails = () => onSelect?.(job.id);
  return (
    <article
      className="job-card group relative flex h-full cursor-pointer flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      onClick={openDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetails();
        }
      }}
      aria-label={`View job: ${job.title} at ${job.company}`}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start gap-3">
          <Avatar name={job.company} size="md" />
          <h3 className="job-title-clamp flex-1 pt-0.5 font-display text-[17px] font-semibold leading-6 tracking-tight text-slate-900 transition-colors group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
            {job.title}
          </h3>
          {job.postedAt && (
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600" title={formatAbsoluteDate(job.postedAt) ?? undefined}>
              {formatRelativeTime(job.postedAt) || 'Recently'}
            </span>
          )}
        </div>

        <p className="mb-1 pl-[52px] text-sm font-medium text-slate-700">{job.company}</p>
        <div className="mb-4 flex items-center gap-1.5 pl-[52px] text-[13px] text-slate-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{job.locationRaw || job.cityTag || 'Location not specified'}</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <RoleChip role={job.roleTag} />
          <CityChip city={job.cityTag} />
          {job.fresherOrIntern && <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"><BadgeCheck className="h-3.5 w-3.5" />Fresher / Intern</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
          <span className="min-w-0 truncate text-xs text-slate-600">{job.postedAt ? formatRelativeTime(job.postedAt) : 'Open listing'}</span>
          <ApplyButton url={job.applyUrl} size="sm" onClick={(event) => event.stopPropagation()} />
        </div>
      </div>
    </article>
  );
}



