import Navbar from "./components/Navbar";
import { Zap, ChevronRight, ArrowRight } from "lucide-react";
import liveEditingImg from "../assets/live_editing.jpeg";
import archPlanningImg from "../assets/architecture_planning.png";
import CollaborativeCursor from "./components/Collaborative Cursor";
import { Link } from "react-router";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-txt-primary relative overflow-hidden flex flex-col font-sans theme-transition duration-300">
      <Navbar />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 flex flex-col items-center justify-center px-6 overflow-hidden border-b border-theme-border/30 theme-transition duration-300">
        <div className="grid-lines-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_65%)] pointer-events-none" />
        
        <CollaborativeCursor
          name="Developer"
          color="#3b82f6" 
          className="top-[32%] left-[8%] md:left-[16%] animate-float-blue"
        />
        <CollaborativeCursor
          name="Designer"
          color="#ec4899" 
          className="top-[52%] right-[8%] md:right-[14%] animate-float-pink"
        />
        <CollaborativeCursor
          name="Product Manager"
          color="#10b981" 
          className="bottom-[22%] left-[12%] md:left-[24%] animate-float-green"
        />
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7.5xl font-extrabold tracking-tight leading-[1.05] text-theme-txt-primary mb-8 font-display theme-transition duration-300">
            Collaborate on docs and <br />
            diagrams, <span className="hero-text-gradient">ridiculously fast.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-theme-txt-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-light theme-transition duration-300">
            The real-time workspace for technical teams. Built for developers,
            designers, and planners who demand instant synchronization and
            clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/sign-up"
              className="w-full sm:w-auto bg-theme-btn-cta-bg text-theme-btn-cta-text font-semibold text-xs px-6 py-3 rounded-md hover:opacity-90 active:scale-[0.98] theme-transition duration-200 shadow-lg flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          
          
          <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group hover:border-theme-txt-secondary/30 theme-transition duration-300">
            <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-white/1 pointer-events-none" />
            
            
            <div className="h-56 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden border border-theme-border relative theme-transition duration-300">
              <img
                src={liveEditingImg}
                alt="Live Document Editing UI Mockup"
                className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-500"
              />
              
              <div className="absolute bottom-4 left-4 bg-theme-bg/60 backdrop-blur-md border border-theme-border px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-semibold text-theme-txt-primary theme-transition duration-300">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live editing active
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-bold text-theme-txt-primary mb-3 theme-transition duration-300">
                Live Document Editing
              </h3>
              <p className="text-xs sm:text-sm text-theme-txt-secondary leading-relaxed font-light theme-transition duration-300">
                Experience seamless real-time co-authoring designed for teams.
                Watch as cursors glide and ideas take shape instantly, with
                integrated typing guards to prevent cursor jumps and text overwrites.
              </p>
            </div>
          </div>

          <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group hover:border-theme-txt-secondary/30 theme-transition duration-300">
            <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-white/1 pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all duration-300">
                <Zap className="w-5 h-5 fill-blue-400/20" />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-theme-txt-primary mb-3 theme-transition duration-300">
                Robust WebSocket Sync
              </h3>
              
              <p className="text-xs sm:text-sm text-theme-txt-secondary leading-relaxed font-light mb-8 theme-transition duration-300">
                Powered by Socket.io namespaces and dynamic room coordination, synchronizing 
                caret selections and whiteboard pointer positions instantly.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-theme-metric border border-theme-border/60 p-4 rounded-xl text-xs sm:text-sm theme-transition duration-300">
                <span className="text-theme-txt-secondary font-medium theme-transition duration-300">Pointer Sync</span>
                <span className="text-theme-txt-primary font-bold font-mono bg-theme-card border border-theme-border px-2.5 py-1 rounded-md theme-transition duration-300">
                  ~60 FPS
                </span>
              </div>
              <div className="flex justify-between items-center bg-theme-metric border border-theme-border/60 p-4 rounded-xl text-xs sm:text-sm theme-transition duration-300">
                <span className="text-theme-txt-secondary font-medium theme-transition duration-300">Typing Guard</span>
                <span className="text-theme-txt-primary font-bold font-mono bg-theme-card border border-theme-border px-2.5 py-1 rounded-md theme-transition duration-300">
                  1200ms window
                </span>
              </div>
            </div>
          </div>

        </div>

        
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center overflow-hidden hover:border-theme-txt-secondary/30 theme-transition duration-300 group">
          
          
          <div className="flex flex-col justify-center h-full">
            
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase w-max mb-6 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Planner Mode
            </div>

            <h3 className="text-2xl md:text-4xl font-bold text-theme-txt-primary mb-4 tracking-tight leading-tight theme-transition duration-300">
              Architecture & Planning
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-theme-txt-secondary leading-relaxed font-light mb-8 theme-transition duration-300">
              Move from text to visuals without leaving the canvas. Our built-in
              drawing tool is optimized for architectural plans, flowcharts, and
              technical diagrams. Drag, drop, and connect with your team in a
              shared spatial environment.
            </p>
          </div>


          <div className="h-56 sm:h-72 md:h-80 w-full rounded-xl overflow-hidden border border-theme-border relative theme-transition duration-300">
            <img
              src={archPlanningImg}
              alt="Architecture & Planning Board Mockup"
              className="w-full h-full object-cover object-medium group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

        </div>
      </section>

      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="bg-theme-cta border border-theme-border rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden flex flex-col items-center justify-center theme-transition duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0%,transparent_70%)] pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-theme-txt-primary mb-4 tracking-tight theme-transition duration-300">
            Ready to build together?
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-theme-txt-secondary max-w-md mb-8 leading-relaxed font-light theme-transition duration-300">
            Join teams building the future with Quill.
          </p>

          <Link
            to="/sign-in"
            className="w-full sm:w-auto bg-theme-btn-cta-bg text-theme-btn-cta-text font-semibold text-xs px-8 py-3.5 rounded-md hover:opacity-90 active:scale-[0.98] theme-transition duration-200 shadow-md text-center"
          >
            Launch Your Workspace
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
