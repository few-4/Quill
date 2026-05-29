import React from "react";

const timeLabel = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

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

const ChatMessage = ({ message, isOwn, grouped = false }) => {
  const isOptimistic = message._id?.startsWith("optimistic-");
  const senderName = message.senderId?.username || "Unknown";
  const initial = senderName.charAt(0).toUpperCase();
  const color = avatarColor(senderName);

  if (isOwn) {
    return (
      <div className={`flex flex-col items-end gap-0.5 ${grouped ? "mt-0.5" : "mt-3"}`}>
        <div className={`flex items-end gap-2 max-w-[70%]`}>
          <span className={`text-[10px] text-theme-txt-secondary/35 self-end mb-0.5 ${isOptimistic ? "italic" : ""}`}>
            {isOptimistic ? "Sending…" : timeLabel(message.createdAt)}
          </span>
          <div
            className={`px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed wrap-break-word bg-brand-blue text-white shadow-sm ${
              isOptimistic ? "opacity-60" : "opacity-100"
            } theme-transition`}
          >
            {message.content}
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
            <span className="text-[10px] text-theme-txt-secondary/40">
              {isOptimistic ? "Sending…" : timeLabel(message.createdAt)}
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
