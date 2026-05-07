import { Server } from "socket.io";

let io;

const connectedUsers = new Map();

export const initSocket = (server) => {
    io = new Server(server, { cors: { origin: "*", credentials: true } });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("register", (userId) => {
            console.log("REGISTER EVENT:", userId);
            connectedUsers.set(userId, socket.id);
            console.log("CONNECTED USERS:");
            console.log(Array.from(connectedUsers.entries()));
        });


        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            // REMOVE USER
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }
        });
    });
    return io;
};

export const getIO = () => io;
export const getConnectedUsers = () => connectedUsers;