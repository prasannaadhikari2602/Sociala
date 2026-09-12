import { useState } from "react";
import { FiX, FiShare2 } from "react-icons/fi";

const ShareComposerModal = ({ onClose, onConfirm, isSharing }) => {
  const [caption, setCaption] = useState("");

  const handleConfirm = () => {
    onConfirm(caption.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md
          rounded-t-2xl sm:rounded-2xl
          bg-white
          shadow-xl
        "
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#12111A]">
            <FiShare2 size={16} className="text-[#A855F7]" />
            Share to your feed
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Say something about this post (optional)..."
            className="
              w-full resize-none
              rounded-xl border border-slate-200
              px-3 py-2.5
              text-sm text-slate-700
              outline-none
              focus:border-[#A855F7] focus:ring-2 focus:ring-purple-100
            "
          />

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSharing}
              className="
                flex items-center gap-1.5
                rounded-xl bg-[#A855F7]
                px-4 py-2.5
                text-sm font-semibold text-white
                transition hover:bg-[#9333EA]
                disabled:opacity-60
              "
            >
              <FiShare2 size={15} />
              {isSharing ? "Sharing..." : "Share now"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSharing}
              className="
                rounded-xl border border-slate-200
                px-4 py-2.5
                text-sm font-semibold text-slate-600
                transition hover:bg-slate-50
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareComposerModal;