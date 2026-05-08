import { io } from "socket.io-client";

export const socket = io(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}`,
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