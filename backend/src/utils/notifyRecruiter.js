import Notification from "../models/notifications.model.js";
import { getIO, getConnectedUsers } from "../services/websocket/websocket.js";

export const notifyRecruiter = (recruiterId, payload) => {
    try {
        const io = getIO();
        const connectedUsers = getConnectedUsers();
        // =========================
        // GET SOCKET ID
        // =========================
        const socketId = connectedUsers.get(recruiterId);

        if (!socketId) {
            console.log("Recruiter offline");
            return;
        }
        console.log("Recruiter ID:", recruiterId);

        console.log("ONLINE USERS:");

        console.log(Array.from(connectedUsers.entries()));
        // =========================
        // SEND NOTIFICATION
        // =========================
        io.to(socketId).emit("notification", payload);

        console.log(`Notification sent to recruiter ${recruiterId}`);

    } catch (err) {
        console.error("NOTIFICATION ERROR:", err.message);
    }
};

