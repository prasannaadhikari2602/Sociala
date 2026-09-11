import { useState } from "react";
import { useGetAdminReportsQuery, useResolveReportMutation } from "../../features/reports/reportApi";

const Reports = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: reports, isLoading } = useGetAdminReportsQuery(statusFilter);
  const [resolveReport] = useResolveReportMutation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Reported Posts</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="actioned">Actioned</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {isLoading && <p className="text-center text-sm text-slate-400">Loading reports...</p>}

        {reports?.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                Reported by <span className="font-semibold">@{r.reporter.username}</span> for{" "}
                <span className="font-semibold">{r.reason}</span>
              </p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                {r.status}
              </span>
            </div>

            {r.description && <p className="mt-2 text-sm text-slate-600">{r.description}</p>}

            <div className="mt-3 rounded-lg border border-slate-100 bg-[#F8F8FA] p-3">
              <p className="text-xs text-slate-500">Post by @{r.post.user.username}</p>
              <p className="mt-1 text-sm">{r.post.content}</p>
            </div>

            {r.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => resolveReport({ id: r.id, action: "delete_post" })}
                  className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white"
                >
                  Remove post & warn user
                </button>
                <button
                  onClick={() => resolveReport({ id: r.id, action: "dismiss" })}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Dismiss report
                </button>
              </div>
            )}
          </div>
        ))}

        {!isLoading && !reports?.length && (
          <p className="py-10 text-center text-sm text-slate-400">No reports here.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;