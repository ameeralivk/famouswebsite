const STEPS = ['Pending', 'Confirmed', 'Delivered'];

const OrderStatusTracker = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2.5 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6m0-6-6 6" />
        </svg>
        <span className="text-sm font-semibold">This order was cancelled</span>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  done ? 'bg-brand-gradient text-white' : 'bg-ink-100 text-ink-400'
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${done ? 'text-ink-800' : 'text-ink-400'}`}>{step}</span>
            </div>
            {!isLast && <div className={`h-0.5 flex-1 mx-1.5 -mt-4 ${i < currentIndex ? 'bg-brand-500' : 'bg-ink-100'}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;
