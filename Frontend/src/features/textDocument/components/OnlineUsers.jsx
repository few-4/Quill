import React from 'react';

const OnlineUsers = ({ onlineUsers = [], currentUser = {} }) => {
  return (
    <div className='flex items-center gap-3 bg-theme-bg/30 px-3 py-1.5 rounded-xl border border-theme-border/40 shadow-xs'>
      <p className='text-xs font-semibold text-theme-txt-secondary/80'>Active</p>
      <div className='flex items-center -space-x-2.5 overflow-hidden'>
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <div 
              key={user.socketId}
              title={`${user.username} (${user.email})`}
              className='w-7 h-7 rounded-full bg-linear-to-tr from-brand-blue to-brand-pink text-white flex items-center justify-center text-[10px] font-bold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm border border-theme-card relative cursor-help'
            >
              {user.username?.substring(0, 1)?.toUpperCase() || "U"}
            </div>
          ))
        ) : (
          <div className='w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center text-[10px] font-bold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm border border-theme-card'>
            {currentUser?.username?.substring(0, 1)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
