import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { MessageSquare, Users, Hash, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useMessages, useSendMessage, useEditMessage, useDeleteMessage } from "../hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatPanel = ({ workspaceId }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const currentWorkspace = useSelector((state) => state.dashboard.workspace);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("chat_sidebar_collapsed") === "true";
  });
  const [chatUsers, setChatUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const { data: messages = [], isLoading } = useMessages(workspaceId);
  const { mutate: sendMsg, isPending } = useSendMessage(workspaceId);
  const { mutate: editMsg } = useEditMessage(workspaceId);
  const { mutate: deleteMsg } = useDeleteMessage(workspaceId);

  const handleTyping = (isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit(isTyping ? "typing" : "stop-typing", { workspaceId });
    }
  };

  useEffect(() => {
    if (!accessToken || !workspaceId) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const socket = io(backendUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.emit("join-workspace-chat", { workspaceId });

    socket.on("new-workspace-message", ({ message }) => {
      queryClient.setQueryData(["messages", workspaceId], (old) => {
        const currentData = old?.data ?? [];
        const alreadyExists = currentData.some((m) => m._id === message._id);
        if (alreadyExists) return old;
        return { ...old, data: [...currentData, message] };
      });
    });

    socket.on("workspace-message-edited", ({ message }) => {
      queryClient.setQueryData(["messages", workspaceId], (old) => {
        const currentData = old?.data ?? [];
        const updated = currentData.map((m) => m._id === message._id ? message : m);
        return { ...old, data: updated };
      });
    });

    socket.on("workspace-message-deleted", ({ messageId }) => {
      queryClient.setQueryData(["messages", workspaceId], (old) => {
        const currentData = old?.data ?? [];
        const filtered = currentData.filter((m) => m._id !== messageId);
        return { ...old, data: filtered };
      });
    });

    socket.on("chat-users", ({ users }) => {
      const uniqueUsers = [];
      const userIds = new Set();
      users.forEach((u) => {
        if (!userIds.has(u.userId)) {
          userIds.add(u.userId);
          uniqueUsers.push(u);
        }
      });
      setChatUsers(uniqueUsers);
    });

    socket.on("user-typing", ({ username, userId }) => {
      const selfId = currentUser?._id || currentUser?.id || currentUser?.userId;
      if (userId === selfId) return;
      setTypingUsers((prev) => {
        const alreadyExists = prev.some((u) => u.userId === userId);
        if (alreadyExists) return prev;
        return [...prev, { userId, username }];
      });
    });

    socket.on("user-stop-typing", ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    socket.on("chat-error", ({ message: errMsg }) => {
      setError(errMsg);
    });

    return () => {
      socket.emit("leave-workspace-chat", { workspaceId });
      socket.disconnect();
    };
  }, [accessToken, workspaceId, queryClient, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content) => {
    sendMsg(
      { workspaceId, content },
      {
        onSuccess: (data) => {
          if (socketRef.current) {
            socketRef.current.emit("send-workspace-message", {
              workspaceId,
              message: data.data,
            });
          }
        },
      }
    );
  };

  const handleEdit = (messageId, content) => {
    editMsg(
      { messageId, content },
      {
        onSuccess: (data) => {
          if (socketRef.current) {
            socketRef.current.emit("edit-workspace-message", {
              workspaceId,
              message: data.data,
            });
          }
        },
      }
    );
  };

  const handleDelete = (messageId) => {
    deleteMsg(messageId, {
      onSuccess: (data) => {
        if (socketRef.current) {
          socketRef.current.emit("delete-workspace-message", {
            workspaceId,
            messageId: data.data.messageId,
          });
        }
      },
    });
  };

  const isOwnMessage = (msg) => {
    const senderId = msg.senderId?._id || msg.senderId;
    return (
      senderId === currentUser?._id ||
      senderId === currentUser?.id ||
      senderId === currentUser?.userId ||
      msg.senderId?._optimistic
    );
  };

  return (
    <div className="w-full h-full flex bg-theme-bg theme-transition">

      {}
      <aside className={`hidden lg:flex flex-col shrink-0 border-r border-theme-border bg-theme-card theme-transition transition-all duration-300 ${
        isSidebarCollapsed ? "w-0 border-r-0 opacity-0 overflow-hidden" : "w-64 opacity-100"
      }`}>
        <div className="w-64 flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col">
            <div className="px-5 pt-6 pb-4 border-b border-theme-border/60">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-brand-blue" />
                </div>
                <span className="text-sm font-bold text-theme-txt-primary tracking-tight">Workspace Chat</span>
              </div>
              <p className="text-[11px] text-theme-txt-secondary/50 leading-relaxed mt-2">
                Real-time messaging for everyone in your workspace.
              </p>
            </div>

            <div className="px-4 pt-4 flex flex-col gap-1">
              <p className="text-[10px] font-bold tracking-widest text-theme-txt-secondary/30 uppercase px-2 mb-2">Channels</p>
              <button className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-brand-blue/8 text-brand-blue text-xs font-semibold cursor-pointer border-none w-full text-left">
                <Hash className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{currentWorkspace?.name || "general"}</span>
              </button>
            </div>

            <div className="px-4 pt-6 flex flex-col gap-2">
              <p className="text-[10px] font-bold tracking-widest text-theme-txt-secondary/30 uppercase px-2 mb-1">Online Members</p>
              <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto px-2">
                {chatUsers.length > 0 ? (
                  chatUsers.map((u) => (
                    <div key={u.socketId} className="flex items-center gap-2.5 py-1">
                      <div className="relative shrink-0">
                        <div className="w-6.5 h-6.5 rounded-full bg-linear-to-tr from-brand-blue to-brand-pink text-white flex items-center justify-center text-[9px] font-bold">
                          {u.username?.substring(0, 1)?.toUpperCase() || "U"}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-brand-green border border-theme-card" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-semibold text-theme-txt-primary truncate leading-tight">{u.username}</span>
                        <span className="text-[9px] text-theme-txt-secondary/40 truncate leading-none">Online</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-theme-txt-secondary/40 italic px-2">No active members</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {}
      <div className="flex-1 flex flex-col min-w-0 h-full">

        {}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-theme-border bg-theme-card theme-transition shrink-0">
          <button
            onClick={() => {
              setIsSidebarCollapsed((prev) => {
                const next = !prev;
                localStorage.setItem("chat_sidebar_collapsed", String(next));
                return next;
              });
            }}
            className="p-1.5 rounded-lg hover:bg-theme-btn-sec-hover text-theme-txt-secondary/60 hover:text-theme-txt-primary transition-all duration-200 cursor-pointer border-none bg-transparent flex items-center justify-center mr-1"
            title={isSidebarCollapsed ? "Show chat info sidebar" : "Hide chat info sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <Hash className="w-4 h-4 text-theme-txt-secondary/50" />
            <span className="text-sm font-bold text-theme-txt-primary tracking-tight">
              {currentWorkspace?.name || "Workspace"} — general
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-theme-txt-secondary/40">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Members only</span>
          </div>
        </div>

        {}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2 min-h-0">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                <span className="text-xs text-theme-txt-secondary/50 font-medium">Loading messages…</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/8 border border-brand-blue/15 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-brand-blue/40" />
              </div>
              <div>
                <p className="text-base font-bold text-theme-txt-primary/70">No messages yet</p>
                <p className="text-sm text-theme-txt-secondary/40 mt-1">
                  Be the first to say something to your team!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const own = isOwnMessage(msg);
                const prevMsg = messages[i - 1];
                const prevSenderId = prevMsg?.senderId?._id || prevMsg?.senderId;
                const currSenderId = msg.senderId?._id || msg.senderId;
                const isGrouped = i > 0 && prevSenderId === currSenderId && !own;
                return (
                  <ChatMessage
                    key={msg._id}
                    message={msg}
                    isOwn={own}
                    grouped={isGrouped}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {}
        {typingUsers.length > 0 && (
          <div className="px-6 py-1.5 shrink-0 bg-theme-bg flex items-center gap-2 text-xs text-theme-txt-secondary/50 font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
            {}
            <div className="flex gap-1 items-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="truncate">
              {typingUsers.map((u) => u.username).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
            </span>
          </div>
        )}

        {}
        <ChatInput
          onSend={handleSend}
          isPending={isPending}
          workspaceName={currentWorkspace?.name || "workspace"}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
