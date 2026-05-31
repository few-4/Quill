import React from 'react';
import { LogIn, ChevronRight } from 'lucide-react';

const JoinWorkspaceCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-theme-border/80 bg-theme-bg/30 backdrop-blur-md cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] select-none min-h-[120px]"
    >
      {}
      <div className="w-12 h-12 rounded-xl bg-theme-card border border-theme-border shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 flex items-center justify-center text-theme-txt-secondary group-hover:text-emerald-400 transition-all duration-300">
        <LogIn className="w-5 h-5" />
      </div>

      {}
      <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-bold text-theme-txt-primary group-hover:text-emerald-400 transition-colors duration-200">
          Join a Workspace
        </span>
        <span className="text-xs text-theme-txt-secondary/60 leading-snug">
          Enter an invite code to join an existing team.
        </span>
      </div>

      {}
      <ChevronRight className="w-4 h-4 text-theme-txt-secondary/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
    </div>
  );
};

export default JoinWorkspaceCard;
