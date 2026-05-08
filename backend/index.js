import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

import { connectDB } from "./src/configs/db.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./src/routers/authRoutes.js";
import jobRouter from "./src/routers/jobRoutes.js";
import applicationRouter from "./src/routers/applicationRoutes.js";
import { initSocket } from "./src/services/websocket/websocket.js";
import path from "path";


dotenv.config();

const app = express();


app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:4000",
            "http://localhost:5001",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// app.use(rateLimiter);
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.get("/", (req, res) => {
    return res.json({ "message": "Working" });
})
const server = http.createServer(app);



const PORT = process.env.MY_SERVICE_PORT || 4000;

initSocket(server);
server.listen(PORT, async () => {
    console.log("Server running on port " + PORT);
    await connectDB();
});