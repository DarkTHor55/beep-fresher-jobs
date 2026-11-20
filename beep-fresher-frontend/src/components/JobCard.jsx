import {
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Tag,
  Users,
  Play,
} from "lucide-react";

export function JobCard({ job }) {
  const roleColor = {
    SWE: "bg-blue-100 text-blue-800",
    Data: "bg-green-100 text-green-800",
    QA: "bg-purple-100 text-purple-800",
    DevOps: "bg-orange-100 text-orange-800",
    Design: "bg-pink-100 text-pink-800",
    Marketing: "bg-indigo-100 text-indigo-800",
    Sales: "bg-red-100 text-red-800",
    Operations: "bg-yellow-100 text-yellow-800",
    HR: "bg-teal-100 text-teal-800",
    Finance: "bg-cyan-100 text-cyan-800",
    Other: "bg-slate-100 text-slate-800",
  }[job.role_tag || "Other"] || "bg-slate-100 text-slate-800";

  const postedText = job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "N/A";

  return (
    <article className="card flex flex-col">
      <div className="px-4 py-3">
        <div className="flex justify-between items-start gap-2 mb-1">
          <span className={`badge ${roleColor}`}>{job.role_tag || "Other"}</span>
          {job.is_fresher_or_intern ? (
            <span className="badge bg-emerald-100 text-emerald-800">Fresher/Intern</span>
          ) : null}
        </div>
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{job.title}</h3>
        <p className="text-slate-600 text-sm mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {job.location_raw || "Location not specified"}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {job.company}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {postedText}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" /> {job.source}
          </span>
        </div>
      </div>
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-silzila-600 hover:text-silzila-500"
        >
          Apply Now <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}

export function PlayButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-silzila-600"
    >
      <Play className="w-4 h-4" /> Refresh Data
    </button>
  );
}
