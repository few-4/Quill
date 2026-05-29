import React, { useState } from 'react';
import { Loader2, LogOut, Sun, Moon } from 'lucide-react';

const UserCard = ({ currentUser, avatarLetter, logoutUser, isLoggingOut }) => {
  const [isLight, setIsLight] = useState(() => {
    return document.documentElement.classList.contains("light");
  });

  const toggleTheme = () => {
    const nextLight = !isLight;
    setIsLight(nextLight);
    if (nextLight) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="p-3.5 flex flex-col gap-3 select-none bg-theme-card theme-transition border-t border-theme-border/60">
      <div className="flex items-center justify-between px-1.5 py-1 rounded-xl hover:bg-theme-btn-sec-hover theme-transition duration-200">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-semibold text-xs leading-none">
              {avatarLetter}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-green border-2 border-theme-card theme-transition" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-theme-txt-primary truncate leading-tight">
              {currentUser?.username || "Unknown User"}
            </span>
            <span className="text-[10px] text-theme-txt-secondary truncate leading-snug mt-0.5">
              {currentUser?.email || ""}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-1.5 rounded-lg hover:bg-theme-border/50 text-theme-txt-secondary/50 hover:text-theme-txt-primary theme-transition cursor-pointer border-none bg-transparent flex items-center justify-center"
          >
            {isLight ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </button>
          
          <button 
            onClick={() => logoutUser()}
            disabled={isLoggingOut}
            title="Logout"
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-txt-secondary/50 hover:text-red-400 theme-transition cursor-pointer border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
