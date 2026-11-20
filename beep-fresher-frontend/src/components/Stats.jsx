import { useState, useEffect } from "react";
import { ArrowLeft, Users, Building2, Clock, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../services/api";
import { Badge } from "./Badge";

const statColors = {
  SWE: "bg-blue-100 text-blue-700",
  Data: "bg-green-100 text-green-700",
  QA: "bg-purple-100 text-purple-700",
  DevOps: "bg-orange-100 text-orange-700",
  Design: "bg-pink-100 text-pink-700",
  Marketing: "bg-indigo-100 text-indigo-700",
  Sales: "bg-red-100 text-red-700",
  Operations: "bg-yellow-100 text-yellow-700",
  HR: "bg-teal-100 text-teal-700",
  Finance: "bg-cyan-100 text-cyan-700",
  Other: "bg-slate-100 text-slate-700",
};

export function Stats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-silzila-600 mb-4"></div>
        <p className="text-slate-500">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Stats</h1>
          <p className="text-slate-500 mt-1">
            Last refresh:{stats?.last_refresh ? new Date(stats.last_refresh).toLocaleString() : "Never"}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-silzila-600 hover:text-silzila-500"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Total Jobs</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats?.total_jobs ?? 0}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Active Jobs</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{stats?.active_jobs ?? 0}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Expired Jobs</p>
          <p className="text-3xl font-bold text-rose-600 mt-1">{stats?.expired_jobs ?? 0}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Sources</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {Object.keys(stats?.by_source || {}).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-silzila-600" /> By Role
          </h3>
          <div className="space-y-2">
            {Object.entries(stats?.by_role || {}).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{role}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{count}</Badge>
                  <span className={`text-xs font-medium ${statColors[role] || "text-slate-600"}`}>
                    {count}
                  </span>
                </div>
              </div>
            ))}
            {Object.keys(stats?.by_role || {}).length === 0 && (
              <p className="text-sm text-slate-400 italic">No data</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-silzila-600" /> By City
          </h3>
          <div className="space-y-2">
            {Object.entries(stats?.by_city || {}).map(([city, count]) => (
              <div key={city} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{city}</span>
                <Badge variant="success">{count}</Badge>
              </div>
            ))}
            {Object.keys(stats?.by_city || {}).length === 0 && (
              <p className="text-sm text-slate-400 italic">No data</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-silzila-600" /> By Source
          </h3>
          <div className="space-y-2">
            {Object.entries(stats?.by_source || {}).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{source}</span>
                <Badge variant="warning">{count}</Badge>
              </div>
            ))}
            {Object.keys(stats?.by_source || {}).length === 0 && (
              <p className="text-sm text-slate-400 italic">No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
