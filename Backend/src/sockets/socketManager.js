import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/token.util.js";
import * as DocumentDAO from "../dao/document.dao.js"
import { getActiveUsersInRoom } from "./activeSocket.js";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.use((socket, next)=>{
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

            if(!token){
                return next(new Error("Authorization token is missing"))
            }

            const decodedToken = verifyAccessToken(token);

            if(!decodedToken){
                return next(new Error("Authentication Error: Invalid token"))
            }
            
            socket.user = decodedToken;

            next();
        } catch (error) {
            return next(new Error("Authentication Error: Connection refused"))
        }
    })

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.user?.username || "Unknown"} (Socket ID: ${socket.id})`);

        socket.on("join-document", ({documentId})=>{

            //Check who is in room
            const users = getActiveUsersInRoom(io, documentId);

            io.to(documentId).emit("room-users", { documentId, users});

            socket.join(documentId);
            console.log(`🔌 User ${socket.user?.username} has entered Document Room: ${documentId}`);

            socket.on("save-document", async({content, yDocState})=>{
                try {
                    const savedDoc = await DocumentDAO.saveDocumentData(documentId, content, yDocState)

                    if(!savedDoc){
                        throw new Error("Document not found or could not be saved")
                    }

                    console.log(`✅ Document Saved: ${documentId}`);
                } catch (error) {
                    console.error(`❌ Error saving document ${documentId}:`, error);
                }
            })
        })

        socket.on("leave-document", ({documentId}) => {
            socket.leave(documentId);
            console.log(`🚫 User ${socket.user?.username} left Document Room: ${documentId}`);

            const users = getActiveUsersInRoom(io, documentId);
            io.to(documentId).emit("room-users", { documentId, users});
        });

        socket.on("disconnecting", ()=>{
            const rooms = Array.from(socket.rooms);

            rooms.forEach((room) => {
                if (room !== socket.id) {
                    process.nextTick(() => {
                        const users = getActiveUsersInRoom(io, room);
                        io.to(room).emit("room-users", { documentId: room, users });
                    });
                }
            })
        })

        socket.on("disconnect", () => {
            console.log(`🔌 User disconnected: ${socket.user?.username || "Unknown"} (Socket ID: ${socket.id})`);
        })
    })

    return io
}