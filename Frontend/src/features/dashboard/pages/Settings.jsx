import React from "react";
import { Settings as SettingsIcon, Shield, Sliders, Bell } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Settings
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Configure your workspace details, security policies, and integrations.
          </p>
        </div>
      </header>

      {/* Settings Sections */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition w-full max-w-4xl flex flex-col gap-8">
        
        {/* Section 1: General */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 border-b border-theme-border/40 pb-6">
          <div className="w-full md:w-1/3 flex flex-col">
            <span className="text-sm font-bold text-theme-txt-primary">General Profile</span>
            <span className="text-xs text-theme-txt-secondary/60 mt-1 leading-normal">
              Change your username, identity details, and avatar logo.
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 max-w-md">
              <label className="text-xs font-semibold text-theme-txt-secondary">Workspace Name</label>
              <input 
                type="text" 
                defaultValue="Quill HQ" 
                className="px-3.5 py-2 rounded-lg border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none focus:border-theme-txt-secondary/40 theme-transition font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 border-b border-theme-border/40 pb-6">
          <div className="w-full md:w-1/3 flex flex-col">
            <span className="text-sm font-bold text-theme-txt-primary">Email Notifications</span>
            <span className="text-xs text-theme-txt-secondary/60 mt-1 leading-normal">
              Select what alerts and workspace reports you'd like to get in your inbox.
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-brand-blue" id="notify-mention" />
              <label htmlFor="notify-mention" className="text-xs text-theme-txt-primary font-medium cursor-pointer">Mentions and comments</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-brand-blue" id="notify-updates" />
              <label htmlFor="notify-updates" className="text-xs text-theme-txt-primary font-medium cursor-pointer">Weekly product updates and newsletters</label>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
