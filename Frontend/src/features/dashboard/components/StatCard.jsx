import React from 'react';
import { Clock } from 'lucide-react';

const StatCard = ({
  title,
  value,
  isLoading,
  Icon,
  iconColorClass,
  description,
  isRecent = false,
  hasItem = false,
  emptyText = "No documents yet",
  footerText = "No activity yet",
  actionText = "Open File",
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="bg-theme-card border border-theme-border rounded-2xl p-8 flex flex-col justify-between h-56 theme-transition hover:border-theme-txt-secondary/20 hover:shadow-lg hover:shadow-black/5 cursor-pointer relative overflow-hidden group"
    >
      {!isRecent ? (
        // Standard count/metric card layout
        <>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                {title}
              </span>
              <h2 className="text-5xl font-extrabold text-theme-txt-primary mt-3 tracking-tight">
                {isLoading ? (
                  <span className="block w-16 h-12 bg-theme-border/40 rounded-lg animate-pulse" />
                ) : value}
              </h2>
            </div>
            <div className={`p-3.5 rounded-xl ${iconColorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          {description && (
            <p className="text-xs text-theme-txt-secondary/60 leading-relaxed mt-4">
              {description}
            </p>
          )}
        </>
      ) : (
        // Recent item preview card layout
        <>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                {title}
              </span>
              {isLoading ? (
                <div className="mt-3 space-y-2">
                  <div className="h-6 bg-theme-border/40 rounded w-3/4 animate-pulse" />
                </div>
              ) : hasItem ? (
                <h3 className="text-xl font-bold text-theme-txt-primary mt-3 leading-snug truncate group-hover:text-brand-blue theme-transition">
                  {value}
                </h3>
              ) : (
                <p className="text-sm text-theme-txt-secondary/50 mt-3 italic">{emptyText}</p>
              )}
            </div>
            <div className={`p-3.5 rounded-xl ${iconColorClass} shrink-0 ml-4`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-theme-border/40 pt-4 mt-auto">
            <span className="text-[11px] text-theme-txt-secondary/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {hasItem ? footerText : "No activity yet"}
            </span>
            {hasItem && (
              <span className="text-[10px] bg-theme-bg border border-theme-border px-2.5 py-1 rounded-full text-theme-txt-secondary/70 font-semibold group-hover:bg-theme-btn-sec-hover theme-transition">
                {actionText}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
