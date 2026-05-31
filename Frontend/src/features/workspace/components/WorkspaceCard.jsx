import React from 'react';
import { ChevronRight } from 'lucide-react';

const WorkspaceCard = ({ ws, onClick, bgGradient }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-start gap-4 p-5 rounded-2xl bg-theme-card/65 border border-theme-border/80 backdrop-blur-md cursor-pointer hover:border-theme-txt-secondary/30 hover:bg-theme-card/90 hover:translate-y-[-2px] transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] select-none animate-in fade-in-50 slide-in-from-bottom-2"
    >
      {}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-brand-blue/0 to-brand-pink/0 group-hover:from-brand-blue/2 group-hover:to-brand-pink/2 transition-colors duration-300 pointer-events-none" />

      {}
      <div className={`w-12 h-12 rounded-xl shrink-0 bg-linear-to-tr ${bgGradient} flex items-center justify-center font-bold text-lg shadow-inner shadow-black/10`}>
        {ws.name?.charAt(0)?.toUpperCase()}
      </div>

      {}
      <div className="flex-1 min-w-0 pr-6">
        <h3 className="text-base font-bold text-theme-txt-primary truncate group-hover:text-brand-blue transition-colors duration-200">
          {ws.name}
        </h3>
        <p className="text-xs text-theme-txt-secondary/80 leading-relaxed mt-1 line-clamp-2">
          {ws.description || 'Collaborative workspace for real-time creation.'}
        </p>
      </div>

      {}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-txt-secondary/30 group-hover:text-theme-txt-primary group-hover:translate-x-1 transition-all duration-300">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

export default WorkspaceCard;
