import {
  Search,
  Filter,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobCard, PlayButton } from "./JobCard";
import { Badge } from "./Badge";
import { jobService } from "../services/api";

export function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 1,
  });
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const roles = ["SWE", "Data", "QA", "DevOps", "Design", "Marketing", "Sales", "Operations", "HR", "Finance", "Other"];
  const cities = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Remote", "Unknown"];

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs({
        q: query || undefined,
        role: role || undefined,
        city: city || undefined,
        page: pagination.page,
        page_size: pagination.page_size,
      });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await jobService.refresh();
      await fetchJobs();
    } catch (err) {
      setError(err.response?.data?.detail || "Refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [query, role, city, pagination.page]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-silzila-600 mb-4"></div>
        <p className="text-slate-500">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fresher & Internship Jobs</h1>
          <p className="text-slate-500 mt-1">
            {pagination.total} jobs found in India
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-primary"
          >
            {refreshing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Refresh Data
              </>
            )}
          </button>
          <a
            href="/stats"
            className="btn-outline"
          >
            View Stats
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search title, company..."
                className="input-field pl-9"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
            <select
              className="input-field"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {jobs.length === 0 && !loading && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-slate-500">
            <Filter className="w-12 h-12 mb-2 opacity-50" />
            <p>No jobs found matching your filters.</p>
          </div>
        )}
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => {
              setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }));
            }}
            disabled={pagination.page === 1}
            className="btn-outline px-3"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-sm text-slate-600">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => {
              setPagination((p) => ({ ...p, page: Math.min(p.total_pages, p.page + 1) }));
            }}
            disabled={pagination.page === pagination.total_pages}
            className="btn-outline px-3"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    jobService
      .getJob(id)
      .then(setJob)
      .catch(() => {
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-silzila-600 mb-4"></div>
        <p className="text-slate-500">Loading job details...</p>
      </div>
    );
  }

  if (!job) return <div className="text-center py-20">Job not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-silzila-600 hover:text-silzila-500"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`badge ${job.role_tag ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-800"}`}>
              {job.role_tag || "Other"}
            </span>
            {job.is_fresher_or_intern ? (
              <span className="badge bg-emerald-100 text-emerald-800 ml-2">Fresher/Intern</span>
            ) : null}
          </div>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Apply Now <ChevronRight className="w-4 h-4 ml-2" />
          </a>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h1>
        <p className="text-slate-600 text-sm flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3" /> {job.location_raw || "Not specified"}
        </p>
        <p className="text-slate-600 text-sm flex items-center gap-1 mb-4">
          <Users className="w-3 h-3" /> {job.company}
        </p>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
          <div className="prose prose-sm text-slate-700 max-w-none">
            {job.description || "No description available."}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-500">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase">Source</p>
            <p className="font-medium">{job.source}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase">Posted At</p>
            <p className="font-medium">
              {job.posted_at ? new Date(job.posted_at).toLocaleString() : "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
            <span className={`badge ${job.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
              {job.status}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase">Confidence</p>
            <p className="font-medium">
              {job.tag_confidence !== null ? Math.round(job.tag_confidence * 100) + "%" : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
