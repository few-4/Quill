import React, { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";

const timeLabel = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Avatar = ({ letter, colorClass }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${colorClass}`}>
    {letter}
  </div>
);

const COLORS = [
  "bg-brand-blue",
  "bg-brand-pink",
  "bg-brand-green",
  "bg-purple-500",
  "bg-orange-500",
  "bg-teal-500",
];

const avatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const ChatMessage = ({ message, isOwn, grouped = false, onEdit, onDelete }) => {
  const isOptimistic = message._id?.startsWith("optimistic-");
  const senderName = message.senderId?.username || "Unknown";
  const initial = senderName.charAt(0).toUpperCase();
  const color = avatarColor(senderName);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isEdited = message.updatedAt && message.updatedAt !== message.createdAt;

  const handleSave = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    if (editContent.trim() !== message.content) {
      onEdit(message._id, editContent.trim());
    }
    setIsEditing(false);
  };

  if (isOwn) {
    return (
      <div className={`flex flex-col items-end gap-0.5 ${grouped ? "mt-0.5" : "mt-3"}`}>
        <div className={`flex items-end gap-2 max-w-[70%]`}>
          <span className={`text-[10px] text-theme-txt-secondary/35 self-end mb-0.5 select-none ${isOptimistic ? "italic" : ""}`}>
            {isOptimistic ? "Sending…" : timeLabel(message.createdAt)}
            {isEdited && !isOptimistic && (
              <span className="text-[9px] text-theme-txt-secondary/30 ml-1">(edited)</span>
            )}
          </span>
          <div className="relative group">
            {!isOptimistic && !isEditing && (
              <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-0.5 bg-theme-card border border-theme-border rounded-lg p-0.5 shadow-md z-20">
                <button
                  onClick={() => {
                    setEditContent(message.content);
                    setIsEditing(true);
                  }}
                  className="p-1 rounded hover:bg-theme-btn-sec-hover text-theme-txt-secondary hover:text-theme-txt-primary cursor-pointer border-none bg-transparent flex items-center justify-center"
                  title="Edit message"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this message?")) {
                      onDelete(message._id);
                    }
                  }}
                  className="p-1 rounded hover:bg-theme-btn-sec-hover text-brand-pink hover:text-brand-pink/80 cursor-pointer border-none bg-transparent flex items-center justify-center"
                  title="Delete message"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div
              className={`px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed wrap-break-word bg-brand-blue text-white shadow-sm ${
                isOptimistic ? "opacity-60" : "opacity-100"
              } theme-transition ${isEditing ? "min-w-[200px]" : ""}`}
            >
              {isEditing ? (
                <form onSubmit={handleSave} className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="bg-transparent border-none text-sm text-white outline-none flex-1 font-sans"
                    autoFocus
                  />
                  <div className="flex gap-1 shrink-0">
                    <button type="submit" className="p-1 rounded hover:bg-white/10 text-white cursor-pointer border-none bg-transparent">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="p-1 rounded hover:bg-white/10 text-white cursor-pointer border-none bg-transparent">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              ) : (
                message.content
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 max-w-[75%] ${grouped ? "mt-0.5 pl-11" : "mt-3"}`}>
      {!grouped && (
        <Avatar letter={initial} colorClass={color} />
      )}

      <div className="flex flex-col gap-0.5 min-w-0">
        {!grouped && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-theme-txt-primary">{senderName}</span>
            <span className="text-[10px] text-theme-txt-secondary/40 select-none">
              {isOptimistic ? "Sending…" : timeLabel(message.createdAt)}
              {isEdited && !isOptimistic && (
                <span className="text-[9px] text-theme-txt-secondary/30 ml-1">(edited)</span>
              )}
            </span>
          </div>
        )}
        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-theme-card border border-theme-border text-sm text-theme-txt-primary leading-relaxed wrap-break-word shadow-xs theme-transition">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
