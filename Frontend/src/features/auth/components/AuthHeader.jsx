import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { QuillLogo } from "../../../components/QuillLogo";


const AuthHeader = ({ authLinkTo, authLinkText }) => {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      setIsLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-nav-bg backdrop-blur-md border-b border-theme-border theme-transition duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-theme-txt-primary flex items-center gap-2 hover:opacity-90 transition-opacity no-underline"
        >
          <QuillLogo className="w-6.5 h-6.5" />
          <span>Quill</span>
        </Link>

        {}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-2 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover rounded-lg theme-transition duration-200 cursor-pointer border-none bg-transparent"
            aria-label="Toggle theme"
            id="auth-theme-toggle"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {authLinkTo && authLinkText && (
            <Link
              to={authLinkTo}
              className="text-xs font-semibold bg-theme-btn-cta-bg text-theme-btn-cta-text px-4 py-2 rounded-md hover:opacity-90 active:scale-[0.98] theme-transition duration-200 shadow-sm no-underline"
            >
              {authLinkText}
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default AuthHeader;
