import jwt from "jsonwebtoken";
import crypto from "crypto";
import { errorResponse } from "../utils/constants/response.js";
import { redisClient } from "../configs/redis.config.js";

// 🔐 hash helper
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

export const protect = async (req, res, next) => {
    try {

        // ✅ Get token from cookie OR header
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return errorResponse(res, "Unauthorized", 401, "NO_TOKEN");
        }

        // 🔥 Check blacklist FIRST
        const hashed = hashToken(token);
        const isBlocked = await redisClient.get(`bl:${hashed}`);

        if (isBlocked) {
            return errorResponse(res, "Token revoked", 401, "TOKEN_REVOKED");
        }

        // 🔐 Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return errorResponse(res, "Invalid or expired token", 401, "AUTH_ERROR");
    }
};