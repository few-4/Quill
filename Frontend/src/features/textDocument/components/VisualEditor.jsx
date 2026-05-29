import React, { useState, useEffect, useRef } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const VisualEditor = ({ content = [], onChange }) => {
  const [theme, setTheme] = useState("dark");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const isInitializedRef = useRef(false);
  
  // Seed the last elements version with the initial database content to prevent duplicate saves on mount
  const initialVersion = Array.isArray(content) 
    ? content.reduce((acc, el) => acc + (el.version || 0), 0) 
    : 0;
  const lastElementsVersionRef = useRef(initialVersion);

  // Set initialized flag after 500ms to allow Excalidraw to complete its mount and load initialData
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitializedRef.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Dynamically sync theme from parent HTML class or localstorage
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    };

    // Initial check
    checkTheme();

    // Create a MutationObserver to listen for document theme class shifts
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Sync dynamic remote collaborative elements received after the initial load
  useEffect(() => {
    if (excalidrawAPI && content) {
      const incomingElements = Array.isArray(content) ? content : [];
      const incomingVersion = incomingElements.reduce((acc, el) => acc + (el.version || 0), 0);

      // If version is structurally different, update the Excalidraw scene
      if (incomingVersion !== lastElementsVersionRef.current) {
        lastElementsVersionRef.current = incomingVersion;
        excalidrawAPI.updateScene({
          elements: incomingElements,
        });
      }
    }
  }, [excalidrawAPI, content]);

  const handleCanvasChange = (elements) => {
    const currentElements = Array.isArray(elements) ? elements : [];
    
    // Sum element versions to check for structural drawing modifications
    const currentVersion = currentElements.reduce((acc, el) => acc + (el.version || 0), 0);

    // Guard: ignore transient empty canvas event during the initial mount phase if the database is populated
    if (!isInitializedRef.current && currentElements.length === 0 && initialVersion > 0) {
      return;
    }

    if (currentVersion !== lastElementsVersionRef.current) {
      lastElementsVersionRef.current = currentVersion;

      if (onChange) {
        onChange(currentElements);
      }
    }
  };

  return (
    <div className="w-full h-[calc(100vh-150px)] border border-theme-border/60 bg-theme-card/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] relative">
      
      {/* Custom overrides to hide Help (?) and Library buttons in Excalidraw */}
      <style>{`
        .excalidraw .help-icon,
        .excalidraw .help-button,
        .excalidraw button[data-testid="help-button"],
        .excalidraw button[aria-label="Help"],
        .excalidraw button[aria-label="help"] {
          display: none !important;
        }
        
        .excalidraw .library-button,
        .excalidraw button[data-testid="library-button"],
        .excalidraw button[aria-label*="Library"],
        .excalidraw button[aria-label*="library"] {
          display: none !important;
        }
      `}</style>

      <Excalidraw 
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        theme={theme}
        onChange={handleCanvasChange}
        initialData={{
          elements: Array.isArray(content) ? content : [],
          appState: { theme }
        }}
        UIOptions={{
          canvasActions: {
            toggleTheme: true,
            export: {
              saveFileToDisk: true,
            },
          },
        }}
      >
        {/* Custom MainMenu with only required utility operations and no external social links */}
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ToggleTheme />
        </MainMenu>

        {/* Custom WelcomeScreen with Quill branding */}
        <WelcomeScreen>
          <WelcomeScreen.Center>
            <div className="flex flex-col items-center select-none cursor-default mb-4">
              <span className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-brand-blue to-brand-pink bg-clip-text text-transparent leading-none">
                Quill Canvas
              </span>
              <span className="text-[10px] text-theme-txt-secondary/60 font-semibold tracking-widest uppercase mt-1">
                Visual Collaborator
              </span>
            </div>
            <WelcomeScreen.Center.Heading>
              Draw diagrams, map wireframes, and brainstorm ideas in real-time.
            </WelcomeScreen.Center.Heading>
            <WelcomeScreen.Center.MenuItemLoadScene />
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
};

export default VisualEditor;