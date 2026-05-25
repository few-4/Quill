import React from "react";
import { FileText, Plus, Search } from "lucide-react";

const Documents = () => {
  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Documents
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Manage, organize, and write all your collaborative notes and documents.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none">
            <Plus className="w-4 h-4" />
            <span>Create Document</span>
          </button>
        </div>
      </header>

      {/* Main List */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition w-full max-w-5xl flex flex-col gap-6">
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg w-full max-w-md theme-transition">
          <Search className="w-4 h-4 text-theme-txt-secondary/60" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full bg-transparent border-none text-sm text-theme-txt-primary outline-none placeholder:text-theme-txt-secondary/40 font-sans"
          />
        </div>

        <div className="border border-theme-border/40 rounded-xl divide-y divide-theme-border/30 overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-theme-bg/10 hover:bg-theme-bg/30 theme-transition cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold text-theme-txt-primary">🚀 Quill Launch Roadmap 2026</span>
            </div>
            <span className="text-xs text-theme-txt-secondary/50">Edited 2 mins ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-theme-bg/10 hover:bg-theme-bg/30 theme-transition cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold text-theme-txt-primary">📝 Meeting Notes: UI Sync</span>
            </div>
            <span className="text-xs text-theme-txt-secondary/50">Edited 3 hrs ago</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-theme-bg/10 hover:bg-theme-bg/30 theme-transition cursor-pointer">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-semibold text-theme-txt-primary">💡 Brand Style brainstorm</span>
            </div>
            <span className="text-xs text-theme-txt-secondary/50">Edited 1 day ago</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Documents;
