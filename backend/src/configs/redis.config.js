import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
    reconnectOnError() {
        return true;
    },
};

// ==============================
// 🔹 Clients
// ==============================
export const redisClient = new Redis(redisConfig);
export const pub = new Redis(redisConfig);
export const sub = new Redis(redisConfig);

// ==============================
// 🔹 Events (attach to instance)
// ==============================
redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
});

// (optional but recommended)
pub.on("error", (err) => console.error("Pub error:", err.message));
sub.on("error", (err) => console.error("Sub error:", err.message));