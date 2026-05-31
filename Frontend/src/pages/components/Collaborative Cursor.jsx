import React, { memo } from "react";

const CollaborativeCursor = memo(({ name, color, className }) => {
  return (
    <div className={`hidden md:flex absolute items-start gap-1 z-10 pointer-events-none select-none ${className}`}>
      {}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
      >
        <path
          d="M0 0L16 5.5L9.5 8L12 14.5L10 16L6.5 9.5L0 12V0Z"
          fill={color}
        />
      </svg>
      
      {}
      <div
        className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white tracking-wide shadow-lg border backdrop-blur-md"
        style={{
          backgroundColor: `${color}cc`, 
          borderColor: color,
          boxShadow: `0 4px 12px ${color}33`,
        }}
      >
        {name}
      </div>
    </div>
  );
});

CollaborativeCursor.displayName = "CollaborativeCursor";

export default CollaborativeCursor;