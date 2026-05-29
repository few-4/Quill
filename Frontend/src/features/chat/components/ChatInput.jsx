import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

const ChatInput = ({ onSend, isPending, workspaceName = "workspace", onTyping }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (onTyping) {
      if (!isTyping && val.trim().length > 0) {
        setIsTyping(true);
        onTyping(true);
      } else if (val.trim().length === 0 && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTyping) onTyping(false);
      }
    }, 2000);
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setValue("");
    setIsTyping(false);
    if (onTyping) onTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const charCount = value.length;
  const nearLimit = charCount > 900;

  return (
    <div className="px-6 pb-5 pt-3 shrink-0 bg-theme-bg theme-transition">
      <div className={`flex items-end gap-3 bg-theme-card border rounded-2xl px-4 py-3 theme-transition shadow-sm ${
        nearLimit ? "border-red-500/40 focus-within:border-red-400" : "border-theme-border focus-within:border-brand-blue/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
      }`}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${workspaceName}…`}
          maxLength={1000}
          className="flex-1 resize-none bg-transparent border-none text-sm text-theme-txt-primary placeholder:text-theme-txt-secondary/35 focus:outline-none leading-relaxed overflow-hidden font-sans min-h-[22px]"
        />

        <div className="flex items-center gap-2 shrink-0 self-end">
          {nearLimit && (
            <span className={`text-[10px] font-semibold tabular-nums ${charCount >= 1000 ? "text-red-400" : "text-orange-400"}`}>
              {1000 - charCount}
            </span>
          )}
          <button
            onClick={submit}
            disabled={!value.trim() || isPending}
            className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center hover:opacity-90 active:scale-95 theme-transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Send (Enter)"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-theme-txt-secondary/30 mt-2 px-1">
        <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default ChatInput;
