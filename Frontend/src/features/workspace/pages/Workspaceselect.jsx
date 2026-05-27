import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, ChevronRight, Sparkles, FolderIcon } from 'lucide-react';
import { useWorkspace } from '../hooks/useWorkspace';
import CollaborativeCursor from '../../../pages/components/Collaborative Cursor';
import CreateWorkSpaceModal from '../../../modal/CreateWorkSpaceModal';

const gradientPresets = {
  indigo: 'from-indigo-500 to-purple-500 text-white',
  emerald: 'from-emerald-400 to-teal-600 text-white',
  rose: 'from-pink-500 to-rose-500 text-white',
  amber: 'from-amber-400 to-orange-500 text-white',
  blue: 'from-blue-500 to-cyan-500 text-white',
};

const getWorkspaceColor = (name = "") => {
  const colors = ['indigo', 'emerald', 'rose', 'blue', 'amber'];
  const index = name.length % colors.length;
  return colors[index];
};

const Workspaceselect = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleWorkspaces } = useWorkspace();
  const { data: { data: workspaces = [] } = {}, isLoading } = handleWorkspaces();


  return ( 
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 overflow-hidden pt-12">
      {/* Background square grid */}
      <div className="grid-lines-bg" />

      {/* Auroral Glow spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-brand-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating collaborative cursors */}
      <CollaborativeCursor name="Create" color="#3b82f6" className="top-[25%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Sprint" color="#ec4899" className="top-[55%] right-[7%] md:right-[15%]" />
      <CollaborativeCursor name="Sync" color="#10b981" className="bottom-[22%] left-[10%] md:left-[22%]" />

      {/* Main select dashboard card */}
      <main className="flex-1 flex items-center justify-center py-12 px-6 w-full relative z-10">
        <div className="w-full max-w-3xl flex flex-col items-stretch">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold mb-4 border border-brand-blue/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time Workspace Manager</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 hero-text-gradient leading-tight">
              Welcome to Quill
            </h1>
            <p className="text-theme-txt-secondary text-sm max-w-md mx-auto leading-relaxed">
              Select an active workspace from your portfolio or build a brand new collaborative space.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Loading Skeleton State */}
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-theme-card/40 border border-theme-border/50 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-theme-border/60 shrink-0" />
                  <div className="flex-1 space-y-2 mt-1">
                    <div className="h-4 bg-theme-border/60 rounded w-1/3" />
                    <div className="h-3 bg-theme-border/40 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : workspaces.length > 0 ? (
              workspaces.map((ws) => {
                const color = getWorkspaceColor(ws.name);
                const bgGradient = gradientPresets[color] || gradientPresets.indigo;
                return (
                  <div
                    key={ws._id || ws.id}
                    onClick={() => navigate('/dashboard')}
                    className="group relative flex items-start gap-4 p-5 rounded-2xl bg-theme-card/65 border border-theme-border/80 backdrop-blur-md cursor-pointer hover:border-theme-txt-secondary/30 hover:bg-theme-card/90 hover:translate-y-[-2px] transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] select-none animate-in fade-in-50 slide-in-from-bottom-2"
                  >
                    {/* Glowing dynamic background highlight on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-brand-blue/0 to-brand-pink/0 group-hover:from-brand-blue/2 group-hover:to-brand-pink/2 transition-colors duration-300 pointer-events-none" />

                    {/* Icon Avatar */}
                    <div className={`w-12 h-12 rounded-xl shrink-0 bg-linear-to-tr ${bgGradient} flex items-center justify-center font-bold text-lg shadow-inner shadow-black/10`}>
                      {ws.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h3 className="text-base font-bold text-theme-txt-primary truncate group-hover:text-brand-blue transition-colors duration-200">
                        {ws.name}
                      </h3>
                      <p className="text-xs text-theme-txt-secondary/80 leading-relaxed mt-1 line-clamp-2">
                        {ws.description || 'Collaborative workspace for real-time creation.'}
                      </p>
                    </div>

                    {/* Hover indicator arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-txt-secondary/30 group-hover:text-theme-txt-primary group-hover:translate-x-1 transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })
            ) : (
              /* No Workspaces Found State */
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 rounded-2xl border border-theme-border/60 bg-theme-card/25 backdrop-blur-md text-center py-12">
                <FolderIcon className="w-10 h-10 text-theme-txt-secondary/40 mb-3 animate-bounce" />
                <h3 className="text-sm font-bold text-theme-txt-primary">No Workspaces Found</h3>
                <p className="text-xs text-theme-txt-secondary/60 mt-1 max-w-xs leading-normal">
                  You do not belong to any active workspace. Build a brand new space to start creating!
                </p>
              </div>
            )}

            {/* Create Workspace CTA Card (Static UI presentation) */}
            <div onClick={() => setIsModalOpen(true)} className="group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-theme-border/80 bg-theme-bg/30 backdrop-blur-md cursor-pointer hover:border-brand-blue/50 hover:bg-theme-card/50 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center min-h-[120px] select-none">
              <div className="w-10 h-10 rounded-full bg-theme-card border border-theme-border group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 flex items-center justify-center text-theme-txt-secondary group-hover:text-brand-blue transition-all duration-300 mb-2">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-theme-txt-secondary group-hover:text-theme-txt-primary transition-colors duration-200">
                Create new workspace
              </span>
            </div>

            <CreateWorkSpaceModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />

          </div>

        </div>
      </main>
    </div>
  );
};

export default Workspaceselect;