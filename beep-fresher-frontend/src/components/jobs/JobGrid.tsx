import { type JobResponse } from '../../lib/types';
import { JobCard } from './JobCard';

interface JobGridProps {
  jobs: JobResponse[];
  onSelect: (id: number) => void;
}

export function JobGrid({ jobs, onSelect }: JobGridProps): JSX.Element | null {
  if (jobs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onSelect={onSelect} />
      ))}
    </div>
  );
}
