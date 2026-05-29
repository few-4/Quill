import React, { useState } from "react";
import { NavLink, useParams, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Settings,
  MessageSquare,
  Sparkles,
  Search,
  ChevronDown,
  Plus,
  Share2
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useDocument, useDocuments } from "../../features/dashboard/hooks/useDashboard";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useWorkspaces } from "../../features/workspace/hooks/useWorkspace";
import { setCurrentWorkspace } from "../../features/workspace/workspace.slice";
import { setWorkspace } from "../../features/dashboard/dashboard.slice";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import NavDocumentDropdown from "./NavDocumentDropdown";
import UserCard from "./UserCard";

const NAV_ITEMS = (workspaceId) => [
  { label: "Dashboard", icon: LayoutDashboard, to: `/dashboard/${workspaceId}` },
  { label: "Documents", icon: FileText, to: `/documents/${workspaceId}` },
  { label: "Chat", icon: MessageSquare, to: `/team-spaces/${workspaceId}` },
  { label: "Templates", icon: Sparkles, to: `/templates/${workspaceId}` },
  { label: "Settings", icon: Settings, to: `/settings/${workspaceId}` },
];

const LeftNavBar = ({ onCloseMobileMenu }) => {
  const currentWorkspace = useSelector((state) => state.dashboard.workspace);
  const currentUser = useSelector((state) => state.auth.user);
  const unreadChat = useSelector((state) => state.dashboard.unreadChat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { workspaceId, documentId } = useParams();
  const location = useLocation();

  const [copied, setCopied] = useState(false);

  const { data: activeDocument } = useDocument(documentId);
  const { data: docsResponse } = useDocuments(workspaceId);
  const allDocuments = docsResponse?.data || [];

  const { handleLogout } = useAuth();
  const { mutate: logoutUser, isPending: isLoggingOut } = handleLogout();

  const { data: workspacesResponse } = useWorkspaces();
  const allWorkspaces = workspacesResponse?.data || [];

  const handleSwitchWorkspace = (ws) => {
    dispatch(setCurrentWorkspace(ws));
    dispatch(setWorkspace(ws));
    navigate(`/dashboard/${ws._id}`);
  };

  const navItems = NAV_ITEMS(currentWorkspace?._id);
  const isInDocument = !!documentId;
  const avatarLetter =
    currentUser?.username?.charAt(0)?.toUpperCase() ||
    currentUser?.email?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <aside className="h-full w-1/7 min-w-[240px] bg-theme-card border-r border-theme-border flex flex-col justify-between theme-transition duration-300 font-sans relative z-20">
      <div className="flex flex-col flex-1 px-3 pt-4 overflow-y-auto overflow-x-hidden select-none">

        <WorkspaceSwitcher
          currentWorkspace={currentWorkspace}
          allWorkspaces={allWorkspaces}
          onSwitchWorkspace={handleSwitchWorkspace}
        />

        {currentWorkspace?.inviteCode && (
          <div className="px-1 mb-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentWorkspace.inviteCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-theme-border/60 bg-theme-bg/30 hover:bg-theme-btn-sec-hover text-theme-txt-secondary hover:text-theme-txt-primary transition-all duration-200 text-xs font-bold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>{copied ? "Invite Code Copied!" : "Share Workspace Code"}</span>
            </button>
          </div>
        )}

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = location.pathname.startsWith(item.to);
            const isDocumentsItem = item.label === "Documents";
            const isChatItem = item.label === "Chat";

            return (
              <div key={item.label} className="flex flex-col">
                <NavLink
                  to={item.to}
                  onClick={() => {
                    if (onCloseMobileMenu) onCloseMobileMenu();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium theme-transition duration-200 group relative no-underline ${
                    isItemActive
                      ? "bg-theme-btn-sec-hover text-theme-txt-primary"
                      : "text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover"
                  }`}
                >
                  {isItemActive && (
                    <span className="absolute left-1 w-1 h-5 rounded-full bg-brand-blue" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 theme-transition ${
                    isItemActive ? "text-brand-blue" : "text-theme-txt-secondary/70 group-hover:text-theme-txt-primary"
                  }`} />
                  <span className="truncate">{item.label}</span>

                  {isChatItem && unreadChat && (
                    <span className="absolute right-3.5 w-2 h-2 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse" />
                  )}

                  {isDocumentsItem && (
                    <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-300 ${
                      isInDocument
                        ? "rotate-0 text-brand-blue"
                        : "-rotate-90 text-theme-txt-secondary/30 group-hover:text-theme-txt-secondary/60"
                    }`} />
                  )}
                </NavLink>

                {isDocumentsItem && isInDocument && (
                  <NavDocumentDropdown
                    workspaceId={workspaceId}
                    documentId={documentId}
                    activeDocument={activeDocument}
                    allDocuments={allDocuments}
                  />
                )}
              </div>
            );
          })}
        </nav>

        <hr className="border-none border-t border-theme-border my-4 theme-transition duration-300" />

        <hr className="border-none border-t border-theme-border my-4 theme-transition duration-300" />

      </div>

      <UserCard
        currentUser={currentUser}
        avatarLetter={avatarLetter}
        logoutUser={logoutUser}
        isLoggingOut={isLoggingOut}
      />
    </aside>
  );
};

export default LeftNavBar;