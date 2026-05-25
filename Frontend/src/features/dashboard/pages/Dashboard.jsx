import React from "react";
import { Outlet } from "react-router";
import LeftNavBar from "../../../pages/components/LeftNavBar";

const Dashboard = () => {
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