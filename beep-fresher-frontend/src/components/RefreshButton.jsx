import { Play, Clock } from "lucide-react";
import { useState } from "react";
import { jobService } from "../services/api";
import { Badge } from "./Badge";

export function RefreshButton() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const result = await jobService.refresh();
      setLastResult(result);
    } catch (err) {
      setLastResult({
        message: err.response?.data?.detail || "Refresh failed",
        fetched: 0,
        new_jobs: 0,
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Admin Refresh</h3>
          <p className="text-xs text-slate-500">Trigger a fresh data sync from all sources</p>
        </div>
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
              <Play className="w-4 h-4" /> Refresh Now
            </>
          )}
        </button>
      </div>

      {lastResult && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600">{lastResult.message}</p>
          <div className="mt-2 flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="font-medium">Fetched:</span> {lastResult.fetched}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">New:</span> {lastResult.new_jobs}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
