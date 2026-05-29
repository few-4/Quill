import React from 'react';
import { Plus } from 'lucide-react';

const CreateWorkspaceCard = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-theme-border/80 bg-theme-bg/30 backdrop-blur-md cursor-pointer hover:border-brand-blue/50 hover:bg-theme-card/50 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center min-h-[120px] select-none"
    >
      <div className="w-10 h-10 rounded-full bg-theme-card border border-theme-border group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 flex items-center justify-center text-theme-txt-secondary group-hover:text-brand-blue transition-all duration-300 mb-2">
        <Plus className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold text-theme-txt-secondary group-hover:text-theme-txt-primary transition-colors duration-200">
        Create new workspace
      </span>
    </div>
  );
};

export default CreateWorkspaceCard;
