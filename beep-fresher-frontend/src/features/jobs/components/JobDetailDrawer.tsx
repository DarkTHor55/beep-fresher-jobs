import { type JobResponse } from '../../../lib/types';
import { BadgeCheck, Clock3, MapPin, X } from 'lucide-react';
import { formatRelativeTime, formatAbsoluteDate } from '../../../lib/utils';
import { Avatar } from '../../../components/common/Avatar';
import { RoleChip } from '../../../components/common/RoleChip';
import { CityChip } from '../../../components/common/CityChip';
import { ApplyButton } from '../../../components/common/ApplyButton';

interface JobDetailDrawerProps {
  job: JobResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailDrawer({ job, isOpen, onClose }: JobDetailDrawerProps): JSX.Element | null {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-stretch md:justify-end" role="presentation" onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}>
      <button type="button" className="absolute inset-0 bg-slate-950/45" onClick={onClose} aria-label="Close job details" />
      <section className="job-detail-panel drawer-panel relative z-10 flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[24px] border border-slate-200 bg-surface md:h-full md:max-h-none md:max-w-xl md:rounded-none md:rounded-l-[24px] md:border-y-0 md:border-r-0 md:border-l dark:border-slate-700" role="dialog" aria-modal="true" aria-labelledby="job-drawer-title">
        <div className="border-b border-slate-200 px-5 pb-4 pt-3 sm:px-7 sm:pt-6 dark:border-slate-800">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300 md:hidden" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">Job details</p>
              <h2 id="job-drawer-title" className="font-display text-xl font-semibold leading-7 tracking-tight sm:text-2xl">{job.title}</h2>
            </div>
            <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close details"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="flex items-center gap-3">
            <Avatar name={job.company} size="lg" />
            <div className="min-w-0"><p className="truncate text-base font-semibold text-text">{job.company}</p>{job.source && <p className="mt-0.5 text-sm text-text-muted">Listed via {job.source}</p>}</div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <RoleChip role={job.roleTag} />
            <CityChip city={job.cityTag} />
            {job.fresherOrIntern && <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"><BadgeCheck className="h-3.5 w-3.5" />Fresher / Intern</span>}
          </div>

          <div className="job-detail-meta mt-6 grid gap-3 rounded-2xl border border-border bg-surface2 p-4 text-sm">
            <div className="flex items-start gap-2.5 text-slate-700"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span>{job.locationRaw || job.cityTag || 'Location not specified'}</span></div>
            <div className="flex items-start gap-2.5 text-slate-700"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><span>{formatRelativeTime(job.postedAt) || 'Posting date unavailable'}{job.postedAt && <span className="ml-1 text-slate-600">({formatAbsoluteDate(job.postedAt)})</span>}</span></div>
          </div>

          <div className="mt-7">
            <h3 className="font-display text-base font-semibold">About this opportunity</h3>
            <div className="job-detail-description mt-3 rounded-2xl border border-border bg-surface2 p-4 sm:p-5"><p className="max-w-[70ch] whitespace-pre-line text-sm leading-7 text-text">{job.description || 'The original listing has more details about this opportunity.'}</p></div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7 dark:border-slate-800">
          <ApplyButton url={job.applyUrl} size="md" />
          <p className="mt-2 text-center text-xs text-slate-600">You’ll continue to the original job listing.</p>
        </div>
      </section>
    </div>
  );
}

