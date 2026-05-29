import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { QuillLogo } from "../../components/QuillLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Local React state for checking theme (light/dark)
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });

  // Sync state with DOM on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light");
      setIsLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsLight(false);
    }
  }, []);

  // Theme Toggler
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

  const navLinks = [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-nav-bg backdrop-blur-md border-b border-theme-border theme-transition duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight text-theme-txt-primary flex items-center gap-2 hover:opacity-90 transition-opacity no-underline">
            <QuillLogo className="w-6.5 h-6.5" />
            <span>Quill</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-xs font-medium text-theme-txt-secondary hover:text-theme-txt-primary theme-transition duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Action Utilities */}
        <div className="hidden md:flex items-center gap-5">
          {/* Theme Toggle Icon Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover rounded-lg theme-transition duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isLight ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          
          <NavLink 
            to="/sign-in" 
            className="text-xs font-medium text-theme-txt-secondary hover:text-theme-txt-primary theme-transition duration-200"
          >
            Sign In
          </NavLink>
          
          <NavLink
            to="/sign-up"
            className="text-xs font-semibold bg-theme-btn-cta-bg text-theme-btn-cta-text px-4 py-2 rounded-md hover:opacity-90 active:scale-[0.98] theme-transition duration-200 shadow-sm flex items-center gap-1"
          >
            Get Started
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover rounded-lg theme-transition duration-200"
            aria-label="Toggle theme"
          >
            {isLight ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-theme-txt-secondary hover:text-theme-txt-primary focus:outline-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-theme-bg border-b border-theme-border px-6 py-6 space-y-4 flex flex-col theme-transition duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-theme-txt-secondary hover:text-theme-txt-primary theme-transition"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-theme-border my-2" />
          <div className="flex flex-col gap-4 pt-2">
            <a 
              href="#signin" 
              className="text-sm font-medium text-theme-txt-secondary hover:text-theme-txt-primary text-center theme-transition"
            >
              Sign In
            </a>
            <a
              href="#get-started"
              className="text-sm font-semibold bg-theme-btn-cta-bg text-theme-btn-cta-text px-4 py-2.5 rounded-md text-center shadow-md active:scale-[0.98] theme-transition"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}