import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { closeReportModal } from "../../features/reports/reportSlice";
import { useReportPostMutation } from "../../features/reports/reportApi";

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate_speech", label: "Hate speech" },
  { value: "nudity", label: "Nudity or sexual content" },
  { value: "violence", label: "Violence" },
  { value: "misinformation", label: "False information" },
  { value: "other", label: "Other" },
];

const ReportPostModal = () => {
  const dispatch = useDispatch();
  const postId = useSelector((s) => s.reports.reportingPostId);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [reportPost, { isLoading }] = useReportPostMutation();

  if (!postId) return null;

  const submit = async () => {
    await reportPost({ post: postId, reason, description });
    dispatch(closeReportModal());
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Report this post</h2>
          <button onClick={() => dispatch(closeReportModal())}>
            <FiX size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {REASONS.map((r) => (
            <label
              key={r.value}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                reason === r.value ? "border-[#A855F7] bg-purple-50" : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
              />
              {r.label}
            </label>
          ))}
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          className="mt-3 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm"
          rows={3}
        />

        <button
          onClick={submit}
          disabled={isLoading}
          className="mt-4 w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Submitting..." : "Submit report"}
        </button>
      </div>
    </div>
  );
};

export default ReportPostModal;