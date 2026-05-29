import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import TipTapEditor from '../components/TipTapEditor'
import VisualEditor from '../components/VisualEditor'
import EditorHeader from '../components/EditorHeader'
import Loader from '../../../components/Loader'
import { useDashboard } from '../../dashboard/hooks/useDashboard'

const DocumentPage = () => {
  const navigate = useNavigate();
  const { workspaceId, documentId } = useParams();
  const { handleGetDocument } = useDashboard();
  const queryClient = useQueryClient();

  const { data: document, isLoading } = handleGetDocument(documentId);
  const [isVisualMode, setIsVisualMode] = useState(false);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const currentUser = useSelector((state) => state.auth.user);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  // Map of socketId → { socketId, userId, username, color, from, to, x, y, button }
  const [remoteCursors, setRemoteCursors] = useState({});
  const saveTimeoutRef = useRef(null);
  const hasInitializedMode = useRef(null);
  // Track the last time the local user made an edit so we can defer remote
  // content updates that would otherwise overwrite in-progress typing
  const lastLocalEditTimeRef = useRef(0);
  const pendingRemoteUpdateRef = useRef(null);
  const pendingUpdateTimerRef = useRef(null);
  // How long (ms) to defer a remote update while the user is actively editing.
  // Matches the text-editor debounce (1 s) + small buffer.
  const TEXT_EDIT_WINDOW_MS = 1200;

  // Initialize socket connection & join document room
  useEffect(() => {
    if (!accessToken || !documentId) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const newSocket = io(backendUrl, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("join-document", { documentId });

    newSocket.on("room-users", ({ users }) => {
      const uniqueUsers = [];
      const userIds = new Set();
      users.forEach((u) => {
        if (!userIds.has(u.userId)) {
          userIds.add(u.userId);
          uniqueUsers.push(u);
        }
      });
      setOnlineUsers(uniqueUsers);

      // Remove cursors for users that are no longer in the room
      setRemoteCursors((prev) => {
        const socketIds = new Set(users.map((u) => u.socketId));
        const next = { ...prev };
        Object.keys(next).forEach((sid) => {
          if (!socketIds.has(sid)) delete next[sid];
        });
        return next;
      });
    });

    // Listen for collaborative document updates from other users in real time
    newSocket.on("document-updated", ({ textContent, visualContent, yDocState, type, senderSocketId }) => {
      if (senderSocketId === newSocket.id) return;

      const applyRemoteUpdate = (tc, vc, yds, t) => {
        queryClient.setQueryData(["document", documentId], (oldData) => {
          if (!oldData) return oldData;
          const newData = { ...oldData };
          if (tc !== undefined) newData.textContent = tc;
          if (vc !== undefined) newData.visualContent = vc;
          if (yds !== undefined) newData.yDocState = yds;
          if (t !== undefined) newData.type = t;
          return newData;
        });
      };

      // For the visual canvas, apply immediately (drawing doesn't have a typing window)
      // For text edits, defer if the local user is mid-keystroke to prevent their
      // in-progress text from being overwritten by the remote setContent call.
      const isTextUpdate = textContent !== undefined;
      const timeSinceLocalEdit = Date.now() - lastLocalEditTimeRef.current;

      if (isTextUpdate && timeSinceLocalEdit < TEXT_EDIT_WINDOW_MS) {
        // Queue this update — overwrite any older pending one (last-remote-wins while deferred)
        pendingRemoteUpdateRef.current = { textContent, visualContent, yDocState, type };

        if (pendingUpdateTimerRef.current) clearTimeout(pendingUpdateTimerRef.current);
        // Apply after the user's edit window expires
        pendingUpdateTimerRef.current = setTimeout(() => {
          const pending = pendingRemoteUpdateRef.current;
          if (pending) {
            pendingRemoteUpdateRef.current = null;
            applyRemoteUpdate(pending.textContent, pending.visualContent, pending.yDocState, pending.type);
          }
        }, TEXT_EDIT_WINDOW_MS - timeSinceLocalEdit);
      } else {
        // Safe to apply immediately (visual canvas, or user hasn't typed recently)
        applyRemoteUpdate(textContent, visualContent, yDocState, type);
      }
    });

    newSocket.on("document-renamed", ({ title }) => {
      queryClient.setQueryData(["document", documentId], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, title };
      });
    });

    // Track remote collaborator cursors in real time
    newSocket.on("remote-cursor", (cursorData) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [cursorData.socketId]: cursorData,
      }));
    });

    return () => {
      newSocket.emit("leave-document", { documentId });
      newSocket.disconnect();
    };
  }, [accessToken, documentId, queryClient]);

  // Synchronize the default mode according to document's type on first load
  useEffect(() => {
    if (document && hasInitializedMode.current !== documentId) {
      setIsVisualMode(document.type === "visual" || document.type === "excalidraw");
      hasInitializedMode.current = documentId;
    }
  }, [document, documentId]);

  // Debounced save-document handler with dynamic delays (150ms for ultra-responsive Canvas drawing, 1000ms for text)
  const handleContentChange = (newContent) => {
    // Stamp the edit time so the remote-update gate knows the user is actively typing
    if (!isVisualMode) {
      lastLocalEditTimeRef.current = Date.now();
      // Cancel any pending deferred remote update — our local version is now the truth
      if (pendingUpdateTimerRef.current) {
        clearTimeout(pendingUpdateTimerRef.current);
        pendingRemoteUpdateRef.current = null;
      }
    }

    // Update local React Query cache immediately to prevent stale states and feedback loops
    queryClient.setQueryData(["document", documentId], (oldData) => {
      if (!oldData) return oldData;
      const newData = { ...oldData };
      if (isVisualMode) {
        newData.visualContent = newContent;
      } else {
        newData.textContent = newContent;
      }
      return newData;
    });

    if (!socket) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const delay = isVisualMode ? 150 : 1000;

    saveTimeoutRef.current = setTimeout(() => {
      if (isVisualMode) {
        socket.emit("save-document", { visualContent: newContent });
      } else {
        socket.emit("save-document", { textContent: newContent });
      }
      
      queryClient.setQueryData(["documents", workspaceId], (oldList) => {
        if (!oldList) return oldList;
        const docs = oldList?.data;
        if (!Array.isArray(docs)) return oldList;
        return {
          ...oldList,
          data: docs.map((d) =>
            d._id === documentId ? { ...d, updatedAt: new Date().toISOString() } : d
          ),
        };
      });
    }, delay);
  };

  const handleModeToggle = (visualMode) => {
    setIsVisualMode(visualMode);

    // Instantly update the document type in our React Query cache to stay in sync
    queryClient.setQueryData(["document", documentId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        type: visualMode ? "visual" : "text",
      };
    });

    // Save the document type change in the database
    if (socket) {
      socket.emit("save-document", { type: visualMode ? "visual" : "text" });
    }
  };

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (pendingUpdateTimerRef.current) {
        clearTimeout(pendingUpdateTimerRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return <Loader text="Hydrating Document..." />;
  }

  return (
    <div className='w-full min-h-full flex flex-col'>
      <EditorHeader
        document={document}
        workspaceId={workspaceId}
        isVisualMode={isVisualMode}
        handleModeToggle={handleModeToggle}
        onlineUsers={onlineUsers}
        currentUser={currentUser}
        socket={socket}
      />
      {/* Editor */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-6 z-10">
        {isVisualMode ? (
          <VisualEditor
            content={document?.visualContent}
            onChange={handleContentChange}
            socket={socket}
            currentUser={currentUser}
            remoteCursors={remoteCursors}
          />
        ) : (
          <TipTapEditor
            content={document?.textContent}
            onChange={handleContentChange}
            socket={socket}
            currentUser={currentUser}
            remoteCursors={remoteCursors}
          />
        )}
      </main>
    </div>
  )
}

export default DocumentPage