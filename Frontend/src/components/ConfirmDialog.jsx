import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
  onCancel,
  danger = true,
  error = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-theme-card border border-theme-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl theme-transition">
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-500/10" : "bg-brand-blue/10"}`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? "text-red-400" : "text-brand-blue"}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-txt-primary">{title}</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold leading-relaxed animate-in fade-in">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 rounded-lg border border-theme-border text-sm font-medium text-theme-txt-secondary hover:bg-theme-btn-sec-hover theme-transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold theme-transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-theme-btn-cta-bg text-theme-btn-cta-text hover:opacity-90"
            }`}
          >
            {isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
