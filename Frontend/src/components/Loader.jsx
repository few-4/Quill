import React from 'react';

const Loader = ({ text = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-theme-bg/40 backdrop-blur-xs min-h-[300px]">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-b-2 border-brand-blue rounded-full animate-spin"></div>
        <div className="absolute w-6 h-6 border-r-2 border-l-2 border-brand-pink rounded-full animate-spin [animation-direction:reverse]"></div>
      </div>
      {text && (
        <span className="text-xs font-bold tracking-widest text-theme-txt-secondary/60 mt-4 uppercase animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 w-full h-full min-h-screen flex items-center justify-center bg-theme-bg">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
