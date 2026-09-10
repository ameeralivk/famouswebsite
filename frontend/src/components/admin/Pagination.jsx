// Shared pager for admin list pages. `pagination` is the { total, page, pages, limit } object
// returned by paginated list endpoints; `onPageChange` receives the new page number.
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;
  const rangeStart = (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  // Show first, last, current ± 1, collapsing the rest into an ellipsis.
  const pageNumbers = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) pageNumbers.push(p);
    else if (pageNumbers[pageNumbers.length - 1] !== '…') pageNumbers.push('…');
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
      <p className="text-xs text-ink-400">
        Showing <span className="font-medium text-ink-600">{rangeStart}-{rangeEnd}</span> of{' '}
        <span className="font-medium text-ink-600">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {pageNumbers.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-ink-300 text-sm">
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                p === page ? 'bg-brand-gradient text-white shadow-card' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
