import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Pencil } from 'lucide-react';
import ModeToggle from './ModeToggle';
import OnlineUsers from './OnlineUsers';
import { renameDocument } from '../../dashboard/services/dashboard.services';

const EditorHeader = ({
  document,
  workspaceId,
  isVisualMode,
  handleModeToggle,
  onlineUsers,
  currentUser
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(document?.title || "Untitled Document");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTitleValue(document?.title || "Untitled Document");
  }, [document?.title]);

  const { mutate: doRename } = useMutation({
    mutationFn: renameDocument,
    onSuccess: (data) => {
      queryClient.setQueryData(["document", document?._id], (old) =>
        old ? { ...old, title: data.data.title } : old
      );
      queryClient.setQueryData(["documents", workspaceId], (oldList) => {
        if (!oldList) return oldList;
        const docs = oldList?.data;
        if (!Array.isArray(docs)) return oldList;
        return {
          ...oldList,
          data: docs.map((d) =>
            d._id === document?._id ? { ...d, title: data.data.title } : d
          ),
        };
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const commitRename = () => {
    const trimmed = titleValue.trim();
    if (!trimmed) {
      setTitleValue(document?.title || "Untitled Document");
      setIsEditing(false);
      return;
    }
    if (trimmed !== document?.title) {
      doRename({ docId: document?._id, title: trimmed });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    }
    if (e.key === "Escape") {
      setTitleValue(document?.title || "Untitled Document");
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  return (
    <nav className='w-full h-16 flex items-center justify-between bg-theme-card border-b border-theme-border theme-transition px-4 relative z-20'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => navigate(`/documents/${workspaceId}`)}
          className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-sec-hover hover:bg-theme-border/50 text-theme-txt-primary text-sm font-semibold tracking-tight active:scale-[0.98] theme-transition shadow-xs cursor-pointer border border-theme-border/60'
        >
          Go Back
        </button>

        <div className='flex items-center gap-2 group'>
          {isEditing ? (
            <input
              ref={inputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleKeyDown}
              maxLength={60}
              className='text-sm font-semibold text-theme-txt-primary bg-theme-metric border border-brand-blue/40 rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-brand-blue/20 w-44 md:w-56 theme-transition'
            />
          ) : (
            <button
              onClick={startEditing}
              title="Click to rename document"
              className='flex items-center gap-1.5 group/title cursor-pointer'
            >
              <h1 className='text-sm font-semibold text-theme-txt-primary truncate max-w-[160px] md:max-w-[240px] group-hover/title:text-brand-blue theme-transition'>
                {titleValue}
              </h1>
              <Pencil
                size={12}
                className='text-theme-txt-secondary/40 group-hover/title:text-brand-blue theme-transition shrink-0'
              />
            </button>
          )}

          {saved && (
            <div className='flex items-center gap-1 text-brand-green animate-in fade-in'>
              <Check size={12} />
              <span className='text-xs font-medium'>Saved</span>
            </div>
          )}
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <ModeToggle isVisualMode={isVisualMode} handleModeToggle={handleModeToggle} />
        <OnlineUsers onlineUsers={onlineUsers} currentUser={currentUser} />

        <button
          onClick={() => navigate(`/dashboard/${workspaceId}`)}
          className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none'
        >
          <span>Back to Dashboard</span>
        </button>
      </div>
    </nav>
  );
};

export default EditorHeader;
