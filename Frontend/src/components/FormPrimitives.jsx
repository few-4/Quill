import React from 'react';

const inputBase = 'w-full px-4 py-2.5 rounded-xl bg-theme-bg border text-sm text-theme-txt-primary placeholder-theme-txt-secondary/40 focus:outline-none focus:ring-2 transition-all duration-200';
const inputValid = 'border-theme-border/70 focus:border-brand-blue focus:ring-brand-blue/20';
const inputError = 'border-red-500/50 focus:ring-red-500/20';

export const FormField = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90">
      {label}
    </label>
    {children}
    {error && (
      <span className="text-red-400 text-xs font-medium block pl-1 animate-in slide-in-from-top-1 duration-200">
        {error}
      </span>
    )}
  </div>
);

export const FormInput = ({ id, hasError, ...props }) => (
  <input
    id={id}
    className={`${inputBase} ${hasError ? inputError : inputValid}`}
    {...props}
  />
);

export const FormTextarea = ({ id, hasError, ...props }) => (
  <textarea
    id={id}
    className={`${inputBase} resize-none ${hasError ? inputError : inputValid}`}
    {...props}
  />
);

export const ApiErrorAlert = ({ error, fallback }) => {
  if (!error) return null;
  return (
    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed animate-in fade-in duration-200">
      {error.response?.data?.message || error.message || fallback}
    </div>
  );
};
