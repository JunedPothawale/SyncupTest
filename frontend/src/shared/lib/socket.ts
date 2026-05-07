import { io } from "socket.io-client";

export const socket = io(
    "http://localhost:4000",
    {
        withCredentials: true,
        autoConnect: false,
        transports: [
            "websocket",
        ]
    }
);

export const sendRegister = (_id: any) => {
    socket.emit("register", _id)
}
export const sendNotification = (payload: any) => {
    socket.emit("notification", payload)
}