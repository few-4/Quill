import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowUpDown, Check, FolderOpen } from 'lucide-react';

const WorkspaceSwitcher = ({ currentWorkspace, allWorkspaces = [], onSwitchWorkspace }) => {
  const navigate = useNavigate();
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const workspaceDropdownRef = useRef(null);

  // Close workspace dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(e.target)) {
        setWorkspaceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-3" ref={workspaceDropdownRef}>
      <button
        onClick={() => setWorkspaceDropdownOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl theme-transition duration-200 cursor-pointer group ${
          workspaceDropdownOpen 
            ? "bg-theme-btn-sec-hover" 
            : "hover:bg-theme-btn-sec-hover"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Workspace avatar */}
          <div className="w-8 h-8 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            {currentWorkspace?.name?.charAt(0)?.toUpperCase() || "Q"}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-sm font-semibold text-theme-txt-primary truncate leading-tight tracking-tight">
              {currentWorkspace?.name || "Select Workspace"}
            </span>
            <span className="text-[10px] text-theme-txt-secondary/50 leading-none mt-0.5">
              {allWorkspaces.length} workspace{allWorkspaces.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <ArrowUpDown className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 ${
          workspaceDropdownOpen ? "text-brand-blue" : "text-theme-txt-secondary/40 group-hover:text-theme-txt-secondary"
        }`} />
      </button>

      {/* Workspace Switcher Dropdown */}
      {workspaceDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-theme-card border border-theme-border/80 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-theme-border/50">
            <p className="text-[10px] font-bold tracking-widest text-theme-txt-secondary/40 uppercase">
              Switch Workspace
            </p>
          </div>

          {/* Workspace list */}
          <div className="py-1 max-h-[220px] overflow-y-auto">
            {allWorkspaces.length > 0 ? (
              allWorkspaces.map((ws) => {
                const isActive = ws._id === currentWorkspace?._id;
                return (
                  <button
                    key={ws._id}
                    onClick={() => {
                      onSwitchWorkspace(ws);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left theme-transition duration-150 hover:bg-theme-btn-sec-hover cursor-pointer ${
                      isActive ? "bg-brand-blue/5" : ""
                    }`}
                  >
                    {/* Mini avatar */}
                    <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                      isActive 
                        ? "bg-brand-blue text-white" 
                        : "bg-theme-btn-cta-bg text-theme-btn-cta-text"
                    }`}>
                      {ws.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`text-xs font-semibold truncate ${isActive ? "text-brand-blue" : "text-theme-txt-primary"}`}>
                        {ws.name}
                      </span>
                      {ws.description && (
                        <span className="text-[10px] text-theme-txt-secondary/50 truncate leading-none mt-0.5">
                          {ws.description}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-theme-txt-secondary/50">
                No workspaces found
              </div>
            )}
          </div>

          {/* Footer: manage workspaces */}
          <div className="border-t border-theme-border/50 p-1.5">
            <button
              onClick={() => { setWorkspaceDropdownOpen(false); navigate("/workspace"); }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover theme-transition duration-150 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 shrink-0" />
              Manage Workspaces
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
