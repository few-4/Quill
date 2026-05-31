import React, { useState, useEffect, useRef } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const VisualEditor = ({ content = [], onChange, socket, currentUser, remoteCursors = {} }) => {
  const [theme, setTheme] = useState("dark");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const isInitializedRef = useRef(false);
  
  
  const initialVersion = Array.isArray(content) 
    ? content.reduce((acc, el) => acc + (el.version || 0), 0) 
    : 0;
  const lastElementsVersionRef = useRef(initialVersion);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitializedRef.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    };

    
    checkTheme();

    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  
  useEffect(() => {
    if (excalidrawAPI && content) {
      const incomingElements = Array.isArray(content) ? content : [];
      const incomingVersion = incomingElements.reduce((acc, el) => acc + (el.version || 0), 0);

      
      if (incomingVersion !== lastElementsVersionRef.current) {
        lastElementsVersionRef.current = incomingVersion;
        excalidrawAPI.updateScene({
          elements: incomingElements,
        });
      }
    }
  }, [excalidrawAPI, content]);

  
  
  const collaboratorsMap = new Map();
  Object.values(remoteCursors).forEach((cursor) => {
    if (cursor.x == null || cursor.y == null) return;
    collaboratorsMap.set(cursor.socketId, {
      pointer: { x: cursor.x, y: cursor.y },
      button: cursor.button || 'up',
      username: cursor.username || 'User',
      color: {
        background: cursor.color || '#3b82f6',
        stroke: cursor.color || '#3b82f6',
      },
    });
  });

  const handleCanvasChange = (elements) => {
    const currentElements = Array.isArray(elements) ? elements : [];
    
    
    const currentVersion = currentElements.reduce((acc, el) => acc + (el.version || 0), 0);

    
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

  
  const handlePointerUpdate = ({ pointer, button }) => {
    if (!socket || !pointer) return;
    socket.emit('cursor-move', {
      x: pointer.x,
      y: pointer.y,
      button: button || 'up',
    });
  };

  return (
    <div className="w-full h-[calc(100vh-150px)] border border-theme-border/60 bg-theme-card/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] relative">
      
      {}
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
        onPointerUpdate={handlePointerUpdate}
        collaborators={collaboratorsMap}
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
        {}
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ToggleTheme />
        </MainMenu>

        {}
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