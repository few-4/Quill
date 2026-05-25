import React from "react";
import { Users, Plus, Shield } from "lucide-react";

const TeamSpaces = () => {
  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Team Spaces
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Collaborate in designated project workspaces with members of your organization.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none">
            <Plus className="w-4 h-4" />
            <span>Create Space</span>
          </button>
        </div>
      </header>

      {/* Grid of Team Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-bold">Public</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Engineering</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              Software dev trackers, code architecture specs, and build logs.
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-theme-border/40 pt-4 mt-auto">
            <div className="w-6 h-6 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold">D</div>
            <span className="text-[10px] text-theme-txt-secondary/50">8 Members</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-brand-pink/10 text-brand-pink px-2 py-0.5 rounded-full font-bold">Public</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Design Team</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              Interface sketches, vector moodboards, and product user journeys.
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-theme-border/40 pt-4 mt-auto">
            <div className="w-6 h-6 rounded-full bg-brand-pink text-white flex items-center justify-center text-[10px] font-bold">JC</div>
            <span className="text-[10px] text-theme-txt-secondary/50">4 Members</span>
          </div>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-bold">Private</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Marketing</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              Growth analytics reports, campaign briefs, and newsletter copy.
            </p>
          </div>
          <div className="flex items-center gap-2 border-t border-theme-border/40 pt-4 mt-auto">
            <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-[10px] font-bold">WW</div>
            <span className="text-[10px] text-theme-txt-secondary/50">3 Members</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TeamSpaces;
