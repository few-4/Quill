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
  
  const [remoteCursors, setRemoteCursors] = useState({});
  const saveTimeoutRef = useRef(null);
  const hasInitializedMode = useRef(null);
  
  
  const lastLocalEditTimeRef = useRef(0);
  const pendingRemoteUpdateRef = useRef(null);
  const pendingUpdateTimerRef = useRef(null);
  
  
  const TEXT_EDIT_WINDOW_MS = 1200;

  
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

      
      setRemoteCursors((prev) => {
        const socketIds = new Set(users.map((u) => u.socketId));
        const next = { ...prev };
        Object.keys(next).forEach((sid) => {
          if (!socketIds.has(sid)) delete next[sid];
        });
        return next;
      });
    });

    
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

      
      
      
      const isTextUpdate = textContent !== undefined;
      const timeSinceLocalEdit = Date.now() - lastLocalEditTimeRef.current;

      if (isTextUpdate && timeSinceLocalEdit < TEXT_EDIT_WINDOW_MS) {
        
        pendingRemoteUpdateRef.current = { textContent, visualContent, yDocState, type };

        if (pendingUpdateTimerRef.current) clearTimeout(pendingUpdateTimerRef.current);
        
        pendingUpdateTimerRef.current = setTimeout(() => {
          const pending = pendingRemoteUpdateRef.current;
          if (pending) {
            pendingRemoteUpdateRef.current = null;
            applyRemoteUpdate(pending.textContent, pending.visualContent, pending.yDocState, pending.type);
          }
        }, TEXT_EDIT_WINDOW_MS - timeSinceLocalEdit);
      } else {
        
        applyRemoteUpdate(textContent, visualContent, yDocState, type);
      }
    });

    newSocket.on("document-renamed", ({ title }) => {
      queryClient.setQueryData(["document", documentId], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, title };
      });
    });

    
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

  
  useEffect(() => {
    if (document && hasInitializedMode.current !== documentId) {
      setIsVisualMode(document.type === "visual" || document.type === "excalidraw");
      hasInitializedMode.current = documentId;
    }
  }, [document, documentId]);

  
  const handleContentChange = (newContent) => {
    
    if (!isVisualMode) {
      lastLocalEditTimeRef.current = Date.now();
      
      if (pendingUpdateTimerRef.current) {
        clearTimeout(pendingUpdateTimerRef.current);
        pendingRemoteUpdateRef.current = null;
      }
    }

    
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

    
    queryClient.setQueryData(["document", documentId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        type: visualMode ? "visual" : "text",
      };
    });

    
    if (socket) {
      socket.emit("save-document", { type: visualMode ? "visual" : "text" });
    }
  };

  
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
      {}
      <main className={`flex-1 w-full mx-auto p-2 sm:p-6 z-10 ${isVisualMode ? "max-w-none px-2 sm:px-6 md:px-10" : "max-w-5xl"}`}>
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