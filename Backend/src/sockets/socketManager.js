import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/token.util.js";
import * as DocumentDAO from "../dao/document.dao.js";
import { getActiveUsersInRoom } from "./activeSocket.js";
import { checkWorkSpaceMember } from "../dao/workspace.dao.js";

export const initializeSocket = (server) => {
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",").map(o => o.trim().replace(/\/$/, ""))
        : ["http://localhost:5173"];

    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                const cleanOrigin = origin ? origin.replace(/\/$/, "") : "";
                if (!origin || cleanOrigin.endsWith(".vercel.app") || allowedOrigins.includes(cleanOrigin)) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

            if (!token) {
                return next(new Error("Authorization token is missing"));
            }

            const decodedToken = verifyAccessToken(token);

            if (!decodedToken) {
                return next(new Error("Authentication Error: Invalid token"));
            }

            socket.user = decodedToken;
            next();
        } catch (error) {
            return next(new Error("Authentication Error: Connection refused"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.user?.username || "Unknown"} (Socket ID: ${socket.id})`);

        socket.on("join-document", ({ documentId }) => {
            socket.join(documentId);
            console.log(`🔌 User ${socket.user?.username} has entered Document Room: ${documentId}`);

            const users = getActiveUsersInRoom(io, documentId);
            io.to(documentId).emit("room-users", { documentId, users });

            socket.on("save-document", async ({ textContent, visualContent, yDocState, type }) => {
                try {
                    const savedDoc = await DocumentDAO.saveDocumentData(documentId, textContent, visualContent, yDocState, type);

                    if (!savedDoc) {
                        throw new Error("Document not found or could not be saved");
                    }

                    console.log(`✅ Document Saved: ${documentId}`);
                    socket.to(documentId).emit("document-updated", { textContent, visualContent, yDocState, type, senderSocketId: socket.id });
                } catch (error) {
                    console.error(`❌ Error saving document ${documentId}:`, error);
                }
            });

            socket.on("rename-document", ({ title }) => {
                socket.to(documentId).emit("document-renamed", { title });
            });
        });

        socket.on("leave-document", ({ documentId }) => {
            socket.leave(documentId);
            console.log(`🚫 User ${socket.user?.username} left Document Room: ${documentId}`);

            const users = getActiveUsersInRoom(io, documentId);
            io.to(documentId).emit("room-users", { documentId, users });
        });

        socket.on("join-workspace-chat", async ({ workspaceId }) => {
            try {
                const userId = socket.user?.userId || socket.user?.id;
                const isMember = await checkWorkSpaceMember(workspaceId, userId);

                if (!isMember) {
                    socket.emit("chat-error", { message: "You are not a member of this workspace" });
                    return;
                }

                const chatRoom = `chat:${workspaceId}`;
                socket.join(chatRoom);
                console.log(`💬 User ${socket.user?.username} joined chat room: ${chatRoom}`);

                const users = getActiveUsersInRoom(io, chatRoom);
                io.to(chatRoom).emit("chat-users", { workspaceId, users });
            } catch (error) {
                console.error(`❌ Error joining workspace chat:`, error);
            }
        });

        socket.on("send-workspace-message", ({ workspaceId, message }) => {
            const chatRoom = `chat:${workspaceId}`;
            socket.to(chatRoom).emit("new-workspace-message", { message });
        });

        socket.on("leave-workspace-chat", ({ workspaceId }) => {
            const chatRoom = `chat:${workspaceId}`;
            socket.leave(chatRoom);
            console.log(`💬 User ${socket.user?.username} left chat room: ${chatRoom}`);

            const users = getActiveUsersInRoom(io, chatRoom);
            io.to(chatRoom).emit("chat-users", { workspaceId, users });
        });

        socket.on("typing", ({ workspaceId }) => {
            const chatRoom = `chat:${workspaceId}`;
            socket.to(chatRoom).emit("user-typing", { 
                username: socket.user?.username, 
                userId: socket.user?.userId || socket.user?.id 
            });
        });

        socket.on("stop-typing", ({ workspaceId }) => {
            const chatRoom = `chat:${workspaceId}`;
            socket.to(chatRoom).emit("user-stop-typing", { 
                userId: socket.user?.userId || socket.user?.id 
            });
        });

        socket.on("disconnecting", () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach((room) => {
                if (room !== socket.id) {
                    process.nextTick(() => {
                        const users = getActiveUsersInRoom(io, room);
                        if (room.startsWith("chat:")) {
                            io.to(room).emit("chat-users", { 
                                workspaceId: room.replace("chat:", ""), 
                                users 
                            });
                        } else {
                            io.to(room).emit("room-users", { documentId: room, users });
                        }
                    });
                }
            });
        });

        socket.on("disconnect", () => {
            console.log(`🔌 User disconnected: ${socket.user?.username || "Unknown"} (Socket ID: ${socket.id})`);
        });
    });

    return io;
};