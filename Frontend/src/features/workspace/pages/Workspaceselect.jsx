import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, FolderIcon } from 'lucide-react';
import { useWorkspace } from '../hooks/useWorkspace';
import CollaborativeCursor from '../../../pages/components/Collaborative Cursor';
import CreateWorkSpaceModal from '../../../modal/CreateWorkSpaceModal';
import JoinWorkSpaceModal from '../../../modal/JoinWorkSpaceModal';
import { useDispatch } from 'react-redux';
import { setCurrentWorkspace } from '../workspace.slice';
import WorkspaceCard from '../components/WorkspaceCard';
import CreateWorkspaceCard from '../components/CreateWorkspaceCard';
import JoinWorkspaceCard from '../components/JoinWorkspaceCard';

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
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { handleWorkspaces } = useWorkspace();
  const { data: { data: workspaces = [] } = {}, isLoading } = handleWorkspaces();

  const handleWorkspaceSelection = (data) => {
    dispatch(setCurrentWorkspace(data));
    navigate('/dashboard/' + data._id);
  }


  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 overflow-hidden pt-12">
      {}
      <div className="grid-lines-bg" />

      {}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-brand-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {}
      <CollaborativeCursor name="Create" color="#3b82f6" className="top-[25%] left-[8%] md:left-[14%]" />
      <CollaborativeCursor name="Sprint" color="#ec4899" className="top-[55%] right-[7%] md:right-[15%]" />
      <CollaborativeCursor name="Sync" color="#10b981" className="bottom-[22%] left-[10%] md:left-[22%]" />

      {}
      <main className="flex-1 flex items-center justify-center py-12 px-6 w-full relative z-10">
        <div className="w-full max-w-3xl flex flex-col items-stretch">

          {}
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

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {}
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
                  <WorkspaceCard
                    key={ws._id || ws.id}
                    ws={ws}
                    onClick={() => handleWorkspaceSelection(ws)}
                    bgGradient={bgGradient}
                  />
                );
              })
            ) : (
              
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 rounded-2xl border border-theme-border/60 bg-theme-card/25 backdrop-blur-md text-center py-12">
                <FolderIcon className="w-10 h-10 text-theme-txt-secondary/40 mb-3 animate-bounce" />
                <h3 className="text-sm font-bold text-theme-txt-primary">No Workspaces Found</h3>
                <p className="text-xs text-theme-txt-secondary/60 mt-1 max-w-xs leading-normal">
                  You do not belong to any active workspace. Build a brand new space to start creating!
                </p>
              </div>
            )}

            {}
            <CreateWorkspaceCard onClick={() => setIsModalOpen(true)} />

            {}
            <JoinWorkspaceCard onClick={() => setIsJoinModalOpen(true)} />

            <CreateWorkSpaceModal isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <JoinWorkSpaceModal isVisible={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />

          </div>

        </div>
      </main>
    </div>
  );
};

export default Workspaceselect;