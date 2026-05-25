import React from "react";
import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  Sparkles, 
  Search, 
  ChevronDown, 
  Plus, 
  MoreHorizontal, 
  LogOut
} from "lucide-react";

const LeftNavBar = () => {
  // Navigation Links mock items
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Documents", icon: FileText, to: "/dashboard/documents" },
    { label: "Team Spaces", icon: Users, to: "/dashboard/team-spaces" },
    { label: "Templates", icon: Sparkles, to: "/dashboard/templates" },
    { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  ];

  // Recent/Favorite pages mock items
  const favoritePages = [
    { title: "Project Launch Plan", icon: "🚀" },
    { title: "Weekly Sync Notes", icon: "📝" },
    { title: "UI/UX Brainstorming", icon: "💡" },
    { title: "Q3 Design Review", icon: "🎨" },
  ];

  // Team Spaces mock items
  const teamSpaces = [
    { name: "Engineering", color: "bg-brand-blue" },
    { name: "Design Team", color: "bg-brand-pink" },
    { name: "Marketing", color: "bg-brand-green" },
  ];

  return (
    <aside className="h-full w-1/7 min-w-[240px] bg-theme-card border-r border-theme-border flex flex-col justify-between theme-transition duration-300 font-sans relative z-20">
      
      {/* Top Half */}
      <div className="flex flex-col flex-1 px-4 pt-5 overflow-y-auto overflow-x-hidden select-none">
        
        {/* Workspace Selector */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-theme-btn-sec-hover theme-transition duration-200 cursor-pointer mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text flex items-center justify-center font-bold text-sm shadow-sm select-none">
              Q
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-theme-txt-primary truncate leading-tight tracking-tight">
                Quill HQ
              </span>
              <span className="text-[10px] text-theme-txt-secondary/60 truncate leading-none mt-0.5">
                Free Plan
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-theme-txt-secondary/60 flex-shrink-0" />
        </div>

        {/* Search Bar Trigger */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-theme-bg/60 border border-theme-border hover:border-theme-txt-secondary/30 hover:bg-theme-btn-sec-hover theme-transition duration-200 cursor-pointer mb-5">
          <div className="flex items-center gap-2 text-theme-txt-secondary/50">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search...</span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium theme-transition duration-200 group relative no-underline ${
                    isActive 
                      ? "bg-theme-btn-sec-hover text-theme-txt-primary" 
                      : "text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-1 w-1 h-5 rounded-full bg-brand-blue" />
                    )}
                    <Icon className={`w-4 h-4 flex-shrink-0 theme-transition ${
                      isActive ? "text-brand-blue" : "text-theme-txt-secondary/70 group-hover:text-theme-txt-primary"
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Divider */}
        <hr className="border-none border-t border-theme-border my-5 theme-transition duration-300" />

        {/* Favorites / Recent Pages */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold tracking-wider text-theme-txt-secondary/40">
              FAVORITES
            </span>
            <button className="p-0.5 rounded hover:bg-theme-btn-sec-hover text-theme-txt-secondary/40 hover:text-theme-txt-primary theme-transition cursor-pointer border-none bg-transparent">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
          </div>
        </div>

        {/* Divider */}
        <hr className="border-none border-t border-theme-border my-5 theme-transition duration-300" />

        {/* Team Spaces */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold tracking-wider text-theme-txt-secondary/40">
              TEAM SPACES
            </span>
            <button className="p-0.5 rounded hover:bg-theme-btn-sec-hover text-theme-txt-secondary/40 hover:text-theme-txt-primary theme-transition cursor-pointer border-none bg-transparent">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Half (User Profile & Extra Info) */}
      <div className="p-4 flex flex-col gap-3.5 select-none bg-theme-card theme-transition border-t border-theme-border/60">

        {/* User Card */}
        <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-theme-btn-sec-hover theme-transition duration-200 cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with active indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-semibold text-xs leading-none">
                D
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-green border-2 border-theme-card theme-transition" />
            </div>
            {/* User Info */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-theme-txt-primary truncate leading-tight">
                Quill User
              </span>
              <span className="text-[10px] text-theme-txt-secondary/60 truncate leading-none mt-0.5">
                Quill Email
              </span>
            </div>
          </div>
          
          {/* Action icon */}
          <button className="p-1 rounded hover:bg-theme-bg text-theme-txt-secondary/50 hover:text-theme-txt-primary theme-transition cursor-pointer border-none bg-transparent">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </aside>
  );
};

export default LeftNavBar;