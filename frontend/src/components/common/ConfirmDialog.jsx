// Generic confirm modal. Render conditionally (or pass open) wherever a destructive action
// needs a second step instead of firing immediately on click.
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-sm p-6 animate-slide-up">
        <h3 className="font-display font-bold text-ink-900 text-lg mb-2">{title}</h3>
        {message && <p className="text-sm text-ink-500 mb-6">{message}</p>}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-full font-semibold text-white shadow-card transition ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-gradient hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full font-semibold border border-ink-200 text-ink-600 hover:bg-ink-50 transition"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
