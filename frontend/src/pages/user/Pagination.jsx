import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, hasNext, hasPrevious, onPageChange, totalCount, pageSize = 20 }) => {
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : null;

  if (!hasNext && !hasPrevious && !totalPages) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        className="
          flex items-center gap-1 rounded-lg
          border border-slate-200 px-3 py-2
          text-xs font-semibold text-slate-600
          transition hover:bg-slate-50
          disabled:opacity-40 disabled:hover:bg-white
        "
      >
        <FiChevronLeft size={14} />
        Prev
      </button>

      <span className="text-xs font-medium text-slate-500">
        Page {page}
        {totalPages ? ` of ${totalPages}` : ""}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="
          flex items-center gap-1 rounded-lg
          border border-slate-200 px-3 py-2
          text-xs font-semibold text-slate-600
          transition hover:bg-slate-50
          disabled:opacity-40 disabled:hover:bg-white
        "
      >
        Next
        <FiChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;