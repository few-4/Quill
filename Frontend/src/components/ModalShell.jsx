import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const ModalShell = ({ onClose, accentColor = 'blue', icon: Icon, title, subtitle, children }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const glowColors = {
    blue: ['bg-brand-blue/8', 'bg-brand-pink/8'],
    pink: ['bg-brand-pink/8', 'bg-brand-blue/8'],
  };
  const [topGlow, bottomGlow] = glowColors[accentColor] || glowColors.blue;

  const iconBg = accentColor === 'pink' ? 'bg-brand-pink/10 text-brand-pink' : 'bg-brand-blue/10 text-brand-blue';

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-300 animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-theme-card border border-theme-border/80 rounded-2xl p-6 shadow-2xl flex flex-col items-stretch overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`absolute top-[-20%] right-[-20%] w-[180px] h-[180px] ${topGlow} rounded-full blur-[45px] pointer-events-none`} />
        <div className={`absolute bottom-[-20%] left-[-20%] w-[180px] h-[180px] ${bottomGlow} rounded-full blur-[45px] pointer-events-none`} />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-theme-txt-primary text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-theme-txt-secondary text-xs mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute -top-1 -right-1 p-1.5 rounded-lg text-theme-txt-secondary/60 hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalShell;
