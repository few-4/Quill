import React, { useState, useRef, useEffect } from 'react';
import { Palette, FileText, Trash2, Pencil, Check, X } from 'lucide-react';

const DocumentRow = ({ doc, onClick, onDelete, onRename, timeAgoText }) => {
  const isVisual = doc.type === "visual";
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleValue, setTitleValue] = useState(doc.title || "Untitled Document");
  const inputRef = useRef(null);

  useEffect(() => {
    setTitleValue(doc.title || "Untitled Document");
  }, [doc.title]);

  const startRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const commitRename = () => {
    const trimmed = titleValue.trim();
    if (!trimmed) {
      setTitleValue(doc.title || "Untitled Document");
      setIsRenaming(false);
      return;
    }
    if (trimmed !== doc.title) {
      onRename({ docId: doc._id, title: trimmed });
    }
    setIsRenaming(false);
  };

  const cancelRename = (e) => {
    e?.stopPropagation();
    setTitleValue(doc.title || "Untitled Document");
    setIsRenaming(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); commitRename(); }
    if (e.key === "Escape") cancelRename();
  };

  return (
    <div
      onClick={isRenaming ? undefined : onClick}
      className={`flex items-center justify-between px-4 py-3.5 bg-theme-bg/10 theme-transition group ${isRenaming ? "bg-theme-bg/20" : "hover:bg-theme-bg/30 cursor-pointer"}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isVisual ? (
          <Palette className="w-5 h-5 text-brand-pink shrink-0" />
        ) : (
          <FileText className="w-5 h-5 text-brand-blue shrink-0" />
        )}

        <div className="flex flex-col min-w-0 flex-1">
          {isRenaming ? (
            <input
              ref={inputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              maxLength={60}
              className="text-sm font-semibold text-theme-txt-primary bg-theme-metric border border-brand-blue/50 rounded-lg px-2.5 py-0.5 outline-none focus:ring-2 focus:ring-brand-blue/20 w-full max-w-xs theme-transition"
            />
          ) : (
            <span className="text-sm font-semibold text-theme-txt-primary group-hover:text-brand-blue theme-transition truncate">
              {titleValue}
            </span>
          )}
          <span className="text-[10px] text-theme-txt-secondary/40 mt-0.5 uppercase tracking-wider">
            {isVisual ? "Canvas" : "Document"} · Edited {timeAgoText}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-3">
        {isRenaming ? (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); commitRename(); }}
              className="p-1.5 rounded-lg text-brand-green hover:bg-brand-green/10 theme-transition cursor-pointer border-none bg-transparent"
              title="Save name"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={cancelRename}
              className="p-1.5 rounded-lg text-theme-txt-secondary/50 hover:bg-theme-btn-sec-hover theme-transition cursor-pointer border-none bg-transparent"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startRename}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-theme-txt-secondary/40 hover:text-brand-blue hover:bg-brand-blue/10 theme-transition cursor-pointer border-none bg-transparent"
              title="Rename document"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(doc); }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-theme-txt-secondary/40 hover:text-red-400 hover:bg-red-500/10 theme-transition cursor-pointer border-none bg-transparent"
              title="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentRow;
