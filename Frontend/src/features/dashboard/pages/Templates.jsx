import React from "react";
import { Sparkles, Plus, BookOpen, Laptop, Calendar } from "lucide-react";

const Templates = () => {
  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Templates
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Jumpstart your work with pre-built documentation outlines and Excalidraw templates.
          </p>
        </div>
      </header>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Product Spec Sheet</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              Standardized format to define goals, specifications, and layout mockups.
            </p>
          </div>
          <span className="text-[10px] text-brand-blue font-bold tracking-wider uppercase mt-4">Use Template →</span>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Design Wireframe Pad</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              A pre-configured grid whiteboard to sketch UI screens and responsive behaviors.
            </p>
          </div>
          <span className="text-[10px] text-brand-pink font-bold tracking-wider uppercase mt-4">Use Template →</span>
        </div>

        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition hover:border-theme-txt-secondary/20 flex flex-col gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-txt-primary">Weekly Meeting Sync</h3>
            <p className="text-xs text-theme-txt-secondary/70 mt-1 leading-relaxed">
              Structure agenda topics, capture action points, and log decisions made.
            </p>
          </div>
          <span className="text-[10px] text-brand-green font-bold tracking-wider uppercase mt-4">Use Template →</span>
        </div>
      </div>

    </div>
  );
};

export default Templates;
