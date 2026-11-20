import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Moon,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useTheme } from '../lib/theme';
import { useJobs } from '../features/jobs/hooks/useJobs';
import { JobGrid } from '../components/jobs/JobGrid';
import { JobSkeleton } from '../components/jobs/JobSkeleton';
import { EmptyState } from '../components/jobs/EmptyState';
import { ErrorState } from '../components/jobs/ErrorState';
import { FilterChips } from '../components/jobs/FilterChips';
import { Pager } from '../components/jobs/Pager';
import { JobDetailDrawer } from '../features/jobs/components/JobDetailDrawer';

const ROLES = [
  'Software Developer',
  'Web Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Data Scientist',
  'Data Analyst',
  'Data Engineer',
  'DevOps Engineer',
  'QA Engineer',
  'Product Manager',
  'UI Designer',
  'UX Designer',
  'Other',
];

const CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Indore',
  'Kochi',
  'Coimbatore',
  'Lucknow',
  'Remote',
];

const QUICK_ROLES = ['Software Developer', 'Data Analyst', 'Product Manager', 'UI Designer'];

export function HomePage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { data, isLoading, isError, error, refetch, slowLoad, params, actions } = useJobs();

  const jobs = data?.items ?? [];
  const hasFilters = Boolean(params.q || params.role || params.city);
  const isEmpty = !isLoading && !isError && jobs.length === 0;
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const clearFilters = () => {
    actions.setRole(null);
    actions.setCity(null);
    actions.setQ('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-page text-ink">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Beep home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-extrabold tracking-tight text-white shadow-sm">B</span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-extrabold tracking-tight">beep<span className="text-indigo-600">.</span></span>
              <span className="block text-xs font-medium text-slate-500">Fresher jobs in India</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#opportunities" className="transition hover:text-indigo-600">Find jobs</a>
            <a href="#how-it-works" className="transition hover:text-indigo-600">How it works</a>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300" aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
              {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
            <button type="button" onClick={() => void refetch()} disabled={isLoading} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-60 sm:px-4 dark:border-slate-700">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh jobs</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 sm:px-6 lg:px-8">
        <section className="hero-panel mt-5 rounded-3xl border border-slate-200 px-5 py-7 sm:mt-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800 dark:border-indigo-800">
                <Sparkles className="h-3.5 w-3.5" />
                A good place to begin
              </div>
              <h1 className="font-display text-[30px] font-bold leading-[1.18] tracking-[-0.025em] sm:text-4xl">
                Your first job starts with <span className="text-indigo-600">one search.</span>
              </h1>
              <p className="mt-2 max-w-[65ch] text-sm leading-6 text-slate-600 sm:text-base">
                Explore fresher and internship roles from companies hiring across India.
              </p>

              <form
                className="mt-5 flex min-h-14 flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:flex-row sm:items-center dark:border-slate-700"
                onSubmit={(event) => {
                  event.preventDefault();
                  actions.setQ(searchQuery);
                  document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <label className="flex min-h-11 min-w-0 flex-1 items-center gap-3 px-3">
                  <Search className="h-5 w-5 shrink-0 text-indigo-600" />
                  <input
                    type="search"
                    placeholder="Role, company, or skill"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      actions.setQ(event.target.value);
                    }}
                    className="min-h-11 min-w-0 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-500"
                    aria-label="Search jobs, companies, or skills"
                  />
                </label>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                  Search jobs <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="mr-1 font-medium text-slate-500">Popular searches</span>
                {QUICK_ROLES.map((role) => (
                  <button key={role} type="button" onClick={() => actions.setRole(role)} className="min-h-9 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700">
                    {role}
                  </button>
                ))}
              </div>
          </div>
        </section>

        <section id="opportunities" className="scroll-mt-24 pt-9 sm:pt-11">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">The next step</p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Explore opportunities</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A good first role can take you anywhere.</p>
            </div>
            {data && <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 sm:self-auto dark:bg-emerald-400/10 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500" />{data.totalItems.toLocaleString('en-IN')} roles listed</div>}
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.02] sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400"><Search className="h-4 w-4" /></span>Find the right fit</div>
            <FilterChips
              roles={ROLES}
              cities={CITIES}
              selectedRole={params.role ?? null}
              selectedCity={params.city ?? null}
              onRoleChange={actions.setRole}
              onCityChange={actions.setCity}
              onClearAll={clearFilters}
            />
          </div>

          {slowLoad && isLoading && <div className="mb-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-400/10 dark:text-amber-200"><RefreshCw className="h-4 w-4 animate-spin" />Gathering the latest listings. The first load may take a moment.</div>}

          {isError && <ErrorState message={error?.message ?? 'Failed to load jobs'} onRetry={() => void refetch()} />}
          {isLoading && !data && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <JobSkeleton key={item} />)}</div>}
          {!isLoading && !isError && (
            isEmpty ? <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} /> : (
              <>
                <JobGrid jobs={jobs} onSelect={setSelectedJobId} />
                <Pager page={params.page} pageSize={params.pageSize} totalItems={data?.totalItems ?? 0} totalPages={data?.totalPages ?? 0} onPageChange={actions.setPage} />
              </>
            )
          )}
        </section>

        <section id="how-it-works" className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-surface p-6 sm:p-8 dark:border-slate-800">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl"><p className="text-sm font-semibold text-indigo-700">A simpler start</p><h2 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">Find it. Explore it. Make it yours.</h2><p className="mt-2 text-sm leading-6 text-slate-600">Browse fresher-friendly roles and apply directly through the original job listing.</p></div>
            <a href="#opportunities" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">Browse jobs <ArrowDown className="h-4 w-4" /></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-surface dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-slate-400">
          <p>Beep helps fresh talent discover their next opportunity.</p>
          <p>Listings link directly to their original source. <span className="ml-1">© {new Date().getFullYear()} Beep</span></p>
        </div>
      </footer>

      {selectedJob && <JobDetailDrawer job={selectedJob} isOpen onClose={() => setSelectedJobId(null)} />}
    </div>
  );
}
