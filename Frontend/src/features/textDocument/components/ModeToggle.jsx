import React from 'react';

const ModeToggle = ({ isVisualMode, handleModeToggle }) => {
  return (
    <div className="flex items-center gap-2 bg-theme-bg/50 border border-theme-border/60 p-1.5 rounded-full select-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]">
      <span 
        onClick={() => handleModeToggle(false)}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
          !isVisualMode 
            ? "bg-brand-blue/10 text-brand-blue font-bold" 
            : "text-theme-txt-secondary/60 hover:text-theme-txt-primary"
        }`}
      >
        Doc
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={isVisualMode}
          onChange={(e) => handleModeToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-8 h-4.5 bg-theme-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-blue"></div>
      </label>
      <span 
        onClick={() => handleModeToggle(true)}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
          isVisualMode 
            ? "bg-brand-pink/10 text-brand-pink font-bold" 
            : "text-theme-txt-secondary/60 hover:text-theme-txt-primary"
        }`}
      >
        Canvas
      </span>
    </div>
  );
};

export default ModeToggle;
