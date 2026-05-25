import React from "react";
import { 
  FileText, 
  Palette, 
  Plus, 
  Clock
} from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      
      {/* Header Block */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Welcome back! Here is a summary of your workspace activities and documents.
          </p>
        </div>
        
        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none">
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>
      </header>

      {/* 4 Cards Grid - Neat, Clean, Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* Card 1: Total Documents */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 flex flex-col justify-between h-56 theme-transition hover:border-theme-txt-secondary/20 hover:shadow-lg hover:shadow-black/5 cursor-pointer relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                Total Documents
              </span>
              <h2 className="text-5xl font-extrabold text-theme-txt-primary mt-3 tracking-tight">
                24
              </h2>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-blue/10 text-brand-blue">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-theme-txt-secondary/60 leading-relaxed mt-4">
            Rich-text documentation, meeting minutes, and workspace wikis.
          </p>
        </div>

        {/* Card 2: Total Draw Documents */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 flex flex-col justify-between h-56 theme-transition hover:border-theme-txt-secondary/20 hover:shadow-lg hover:shadow-black/5 cursor-pointer relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                Total Visual Notes
              </span>
              <h2 className="text-5xl font-extrabold text-theme-txt-primary mt-3 tracking-tight">
                12
              </h2>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-pink/10 text-brand-pink">
              <Palette className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-theme-txt-secondary/60 leading-relaxed mt-4">
            Visual whiteboards, interactive diagrams, and user flows.
          </p>
        </div>

        {/* Card 3: Recent Document */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 flex flex-col justify-between h-56 theme-transition hover:border-theme-txt-secondary/20 hover:shadow-lg hover:shadow-black/5 cursor-pointer relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                Recent Document
              </span>
              <h3 className="text-xl font-bold text-theme-txt-primary mt-3 leading-snug truncate group-hover:text-brand-blue theme-transition">
                🚀 Quill Launch Roadmap 2026
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-blue/10 text-brand-blue flex-shrink-0 ml-4">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-theme-border/40 pt-4 mt-auto">
            <span className="text-[11px] text-theme-txt-secondary/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Edited 2 mins ago
            </span>
            <span className="text-[10px] bg-theme-bg border border-theme-border px-2.5 py-1 rounded-full text-theme-txt-secondary/70 font-semibold group-hover:bg-theme-btn-sec-hover theme-transition">
              Open File
            </span>
          </div>
        </div>

        {/* Card 4: Recent Visual Draw Project */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 flex flex-col justify-between h-56 theme-transition hover:border-theme-txt-secondary/20 hover:shadow-lg hover:shadow-black/5 cursor-pointer relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs font-bold tracking-wider text-theme-txt-secondary/50 uppercase">
                Recent Visual Project
              </span>
              <h3 className="text-xl font-bold text-theme-txt-primary mt-3 leading-snug truncate group-hover:text-brand-pink theme-transition">
                🎨 System Architecture Wireframe
              </h3>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-pink/10 text-brand-pink flex-shrink-0 ml-4">
              <Palette className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-theme-border/40 pt-4 mt-auto">
            <span className="text-[11px] text-theme-txt-secondary/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Edited 45 mins ago
            </span>
            <span className="text-[10px] bg-theme-bg border border-theme-border px-2.5 py-1 rounded-full text-theme-txt-secondary/70 font-semibold group-hover:bg-theme-btn-sec-hover theme-transition">
              Open Canvas
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
