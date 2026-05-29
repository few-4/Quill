import React from 'react';
import { Loader2 } from 'lucide-react';

const ModalActions = ({ onClose, isPending, submitLabel, pendingLabel, accentColor = 'blue' }) => {
  const submitBg =
    accentColor === 'pink'
      ? 'bg-brand-pink shadow-brand-pink/15 hover:shadow-brand-pink/25'
      : 'bg-blue-600 shadow-blue-600/15 hover:shadow-blue-600/25';

  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        disabled={isPending}
        className="px-4 py-2.5 rounded-xl border border-theme-border/80 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isPending}
        className={`px-5 py-2.5 rounded-xl ${submitBg} text-white font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95`}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{pendingLabel}</span>
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </button>
    </div>
  );
};

export default ModalActions;
