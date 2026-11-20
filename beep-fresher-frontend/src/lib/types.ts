export type JobResponse = {
  id: number;
  source: string;
  sourceJobId: string;
  title: string;
  company: string;
  locationRaw: string | null;
  description: string | null;
  applyUrl: string;
  postedAt: string | null;
  roleTag: string | null;
  cityTag: string | null;
  tagConfidence: number | null;
  fresherOrIntern: boolean;
};

export type PageResponse = {
  items: JobResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type StatsResponse = {
  totalJobs: number;
  byRole: Array<{ name: string; count: number }>;
  byCity: Array<{ name: string; count: number }>;
  lastRefreshedAt: string | null;
};

export type SearchParams = {
  q?: string;
  role?: string;
  city?: string;
  page?: number;
  pageSize?: number;
};
