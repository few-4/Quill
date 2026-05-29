import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router";
import { Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import LeftNavBar from "../../../pages/components/LeftNavBar";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";
import { setUnreadChat } from "../dashboard.slice";

const Dashboard = () => {
  const { handleCurrentWorkspace } = useDashboard();
  const { workspaceId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { data: currentWorkspace, isLoading: isWorkspaceLoading } = handleCurrentWorkspace(workspaceId);

  const { handleGetMe } = useAuth();
  const { isLoading: isUserLoading } = handleGetMe();

  useEffect(() => {
    if (location.pathname.includes(`/team-spaces/${workspaceId}`)) {
      dispatch(setUnreadChat(false));
    }
  }, [location.pathname, workspaceId, dispatch]);

  // Connect to workspace chat in background to track incoming messages for the unread badge
  useEffect(() => {
    if (!accessToken || !workspaceId) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const socket = io(backendUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socket.emit("join-workspace-chat", { workspaceId });

    socket.on("new-workspace-message", ({ message }) => {
      const isOnChatPage = window.location.pathname.includes(`/team-spaces/${workspaceId}`);
      const selfId = currentUser?._id || currentUser?.id || currentUser?.userId;
      const isOwnMessage = (message.senderId?._id || message.senderId) === selfId;

      if (!isOnChatPage && !isOwnMessage) {
        dispatch(setUnreadChat(true));
      }
    });

    return () => {
      socket.emit("leave-workspace-chat", { workspaceId });
      socket.disconnect();
    };
  }, [accessToken, workspaceId, currentUser, dispatch]);

  if (isUserLoading || isWorkspaceLoading || !currentWorkspace) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-theme-bg text-theme-txt-primary flex-col font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        <h1 className="text-xs font-bold tracking-widest text-theme-txt-secondary/60 mt-4 uppercase animate-pulse">
          Loading Workspace...
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex bg-theme-bg text-theme-txt-primary font-sans theme-transition duration-300 overflow-hidden relative">
      {/* Sidebar Drawer Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Nav Bar container - sliding drawer on mobile, relative on desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 md:relative md:flex shrink-0 transition-transform duration-300 md:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <LeftNavBar onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 h-full flex flex-col bg-theme-bg border-l border-theme-border/20 theme-transition duration-300 relative overflow-hidden">
        {/* Mobile Top Navigation Header */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-card theme-transition shrink-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-theme-btn-sec-hover text-theme-txt-secondary hover:text-theme-txt-primary transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-theme-txt-primary truncate">
            {currentWorkspace?.name}
          </span>
          <div className="w-9" />
        </header>

        {/* Main scrollable body */}
        <div className="flex-1 overflow-y-auto w-full h-full relative">
          {/* Background Subtle Gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Child Router Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;