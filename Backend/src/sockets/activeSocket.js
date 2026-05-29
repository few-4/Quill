export const getActiveUsersInRoom = (io, documentId) => {
    const activeUsers = [];
    
    const socketIds = io.sockets.adapter.rooms.get(documentId);
    
    if (socketIds) {

        for (const socketId of socketIds) {

            const clientSocket = io.sockets.sockets.get(socketId);
            
            if (clientSocket && clientSocket.user) {
                activeUsers.push({
                    socketId: clientSocket.id,
                    userId: clientSocket.user.userId || clientSocket.user.id || clientSocket.user._id,
                    username: clientSocket.user.username,
                    email: clientSocket.user.email
                });
            }
        }
    }
    
    return activeUsers;
};