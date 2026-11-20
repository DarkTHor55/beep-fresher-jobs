import type { JobResponse, PageResponse, StatsResponse } from './types';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'https://beep-fresher-jobs.onrender.com';

function resolveUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function parseJob(item: unknown): JobResponse {
  if (item === null || typeof item !== 'object') {
    throw new ApiError(400, 'Invalid job item: expected object');
  }

  const obj = item as Record<string, unknown>;

  const id =
    typeof obj.id === 'number' ? obj.id : Number(obj.id) || 0;
  const source =
    typeof obj.source === 'string' ? obj.source : '';
  const sourceJobId =
    typeof obj.source_job_id === 'string'
      ? obj.source_job_id
      : typeof obj.sourceJobId === 'string'
        ? obj.sourceJobId
        : '';
  const title =
    typeof obj.title === 'string' && obj.title.trim().length > 0
      ? obj.title.trim()
      : 'Untitled Job';
  const company =
    typeof obj.company === 'string' && obj.company.trim().length > 0
      ? obj.company.trim()
      : 'Unknown Company';
  const locationRaw =
    typeof obj.location_raw === 'string' ? obj.location_raw : null;
  const description =
    typeof obj.description === 'string' ? obj.description : null;
  const applyUrl =
    typeof obj.apply_url === 'string' && obj.apply_url.trim().length > 0
      ? obj.apply_url
      : typeof obj.applyUrl === 'string'
        ? obj.applyUrl
        : '#';
  const postedAt =
    typeof obj.posted_at === 'string' ? obj.posted_at : null;
  const roleTag =
    typeof obj.role_tag === 'string' ? obj.role_tag : null;
  const cityTag =
    typeof obj.city_tag === 'string' ? obj.city_tag : null;
  const tagConfidence =
    typeof obj.tag_confidence === 'number' ? obj.tag_confidence : null;
  const fresherOrIntern =
    typeof obj.is_fresher_or_intern === 'boolean'
      ? obj.is_fresher_or_intern
      : typeof obj.fresherOrIntern === 'boolean'
        ? obj.fresherOrIntern
        : false;

  return {
    id,
    source,
    sourceJobId,
    title,
    company,
    locationRaw,
    description,
    applyUrl,
    postedAt,
    roleTag,
    cityTag,
    tagConfidence,
    fresherOrIntern,
  };
}

export async function fetchJobs(params: {
  q?: string;
  role?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}): Promise<PageResponse> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.role) qs.set('role', params.role);
  if (params.city) qs.set('city', params.city);
  qs.set('page', String(params.page ?? 1));
  qs.set('pageSize', String(params.pageSize ?? 25));

  const url = resolveUrl(`/api/jobs?${qs.toString()}`);

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new ApiError(res.status, `Failed to fetch jobs: ${res.statusText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;

  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const items = itemsRaw.map((item) => parseJob(item));

  const page =
    typeof data.page === 'number' ? data.page : Number(data.page) || 1;
  const pageSize =
    typeof data.page_size === 'number'
      ? data.page_size
      : Number(data.pageSize) || 25;
  const totalItems =
    typeof data.total_items === 'number'
      ? data.total_items
      : Number(data.totalItems) || 0;
  const totalPages =
    typeof data.total_pages === 'number'
      ? data.total_pages
      : Number(data.totalPages) || Math.ceil(totalItems / pageSize);

  return { items, page, pageSize, totalItems, totalPages };
}

export async function fetchJobById(id: number): Promise<JobResponse> {
  const url = resolveUrl(`/api/jobs/${id}`);

  const res = await fetch(url, { cache: 'no-store' });

  if (res.status === 404) {
    throw new ApiError(404, 'Job not found');
  }
  if (!res.ok) {
    throw new ApiError(res.status, `Failed to fetch job: ${res.statusText}`);
  }

  const data = (await res.json()) as Record<string, unknown>;
  return parseJob(data);
}

export async function fetchStats(): Promise<StatsResponse | null> {
  try {
    const url = resolveUrl('/api/stats');
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as Record<string, unknown>;

    const totalJobs =
      typeof data.total_jobs === 'number'
        ? data.total_jobs
        : Number(data.totalJobs) || 0;
    const byRoleRaw =
      Array.isArray(data.by_role) ? data.by_role : Array.isArray(data.byRole)
        ? data.byRole
        : [];
    const byCityRaw =
      Array.isArray(data.by_city) ? data.by_city : Array.isArray(data.byCity)
        ? data.byCity
        : [];

    const byRole = byRoleRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const obj = item as Record<string, unknown>;
        return {
          name: typeof obj.name === 'string' ? obj.name : 'Unknown',
          count:
            typeof obj.count === 'number'
              ? obj.count
              : Number(obj.count) || 0,
        };
      });

    const byCity = byCityRaw
      .filter((item) => item && typeof item === 'object')
      .map((item) => {
        const obj = item as Record<string, unknown>;
        return {
          name: typeof obj.name === 'string' ? obj.name : 'Unknown',
          count:
            typeof obj.count === 'number'
              ? obj.count
              : Number(obj.count) || 0,
        };
      });

    const lastRefreshedAt =
      typeof data.last_refreshed_at === 'string'
        ? data.last_refreshed_at
        : typeof data.lastRefreshedAt === 'string'
          ? data.lastRefreshedAt
          : null;

    return {
      totalJobs,
      byRole,
      byCity,
      lastRefreshedAt,
    };
  } catch {
    return null;
  }
}

export { ApiError };
