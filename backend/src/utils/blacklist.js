import { redisClient } from "../configs/redis.config.js";
import crypto from "crypto";

// 🔐 Hash token (better security + smaller key)
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

// ==============================
// 🚫 Blacklist Token
// ==============================
export const blacklistToken = async (token, expiresInSeconds) => {
    if (!token || !expiresInSeconds || expiresInSeconds <= 0) return;

    const hashed = hashToken(token);
    const key = `blacklist:${hashed}`;

    await redisClient.set(key, "1", "EX", expiresInSeconds);
};

// ==============================
// 🔍 Check Blacklist
// ==============================
export const isBlacklisted = async (token) => {
    if (!token) return false;

    const hashed = hashToken(token);
    const key = `blacklist:${hashed}`;

    const result = await redisClient.get(key);

    return result === "1"; // ✅ always boolean
};