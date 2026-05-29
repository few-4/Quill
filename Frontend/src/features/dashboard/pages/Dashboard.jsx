import React from "react";
import { Outlet, useParams } from "react-router";
import LeftNavBar from "../../../pages/components/LeftNavBar";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";

const Dashboard = () => {

  const { handleCurrentWorkspace } = useDashboard();
  const { workspaceId } = useParams();
  
  const { data: currentWorkspace, isLoading: isWorkspaceLoading } = handleCurrentWorkspace(workspaceId);

  const { handleGetMe } = useAuth();
  const { isLoading: isUserLoading } = handleGetMe();

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
    <div className="w-full h-screen flex bg-theme-bg text-theme-txt-primary font-sans theme-transition duration-300 overflow-hidden">
      {/* Left Nav Bar */}
      <LeftNavBar />

      {/* Main Content Layout */}
      <div className="flex-1 h-full flex flex-col overflow-y-auto bg-theme-bg border-l border-theme-border/20 theme-transition duration-300 relative">
        {/* Background Subtle Gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Child Router Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;