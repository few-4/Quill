import React from "react";
import { Link, useNavigate } from "react-router";
import { Home, Compass, AlertCircle } from "lucide-react";
import CollaborativeCursor from "./components/Collaborative Cursor";
import { QuillLogo } from "../components/QuillLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary flex flex-col items-center relative font-sans theme-transition duration-300 pt-16">
      <div className="grid-lines-bg" />

      <CollaborativeCursor name="Lost?" color="#ec4899" className="top-[25%] left-[8%] md:left-[18%]" />
      <CollaborativeCursor name="404" color="#3b82f6" className="top-[55%] right-[10%] md:right-[16%]" />

      <header className="w-full flex justify-between items-center px-12 py-6 absolute top-0 left-0 z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-brand-blue/10 text-brand-blue shadow-inner shrink-0">
            <QuillLogo className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent">
            Quill
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center w-full relative z-10 p-6">
        <div className="w-full max-w-md bg-theme-card border border-theme-border rounded-2xl px-9 py-12 flex flex-col items-center text-center theme-transition duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          
          <div className="w-16 h-16 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center mb-6 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-7xl font-extrabold tracking-tight hero-text-gradient mb-4">
            404
          </h1>
          
          <h2 className="text-xl font-bold text-theme-txt-primary tracking-tight mb-2">
            Page Not Found
          </h2>
          
          <p className="text-sm text-theme-txt-secondary leading-relaxed mb-8 max-w-xs">
            Oops! It looks like you've drifted off the workspace grid. The page you are looking for does not exist or has been relocated.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate("/workspace")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-xs font-bold tracking-wider cursor-pointer hover:opacity-90 active:scale-[0.98] theme-transition duration-200 border-none font-sans"
            >
              <Compass className="w-4 h-4" />
              <span>DASHBOARD</span>
            </button>
            
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-theme-border bg-theme-bg/30 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover text-xs font-bold tracking-wider cursor-pointer theme-transition duration-200 font-sans no-underline"
            >
              <Home className="w-4 h-4" />
              <span>HOME</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full flex justify-center py-6 relative z-10">
        <span className="text-[0.8rem] text-theme-txt-secondary/40 theme-transition duration-300">
          © 2026 Quill Technologies Inc. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default NotFound;
