import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt.js";
import jwt from 'jsonwebtoken'
import { hashToken } from "../utils/token.js";
import { blacklistToken } from "../utils/blacklist.js";
import { redisClient } from "../configs/redis.config.js";

export const registerUser = async ({ name, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return issueTokens(user);
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");
    const tokens = await issueTokens(user)
    const userData = { user, tokens };
    return userData;
};


const issueTokens = async (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);


    const hashed = hashToken(refreshToken);

    user.refreshToken = hashed;
    await user.save();

    return { accessToken, refreshToken }
};



export const refreshAccessToken = async (refreshToken) => {
    const { verifyRefreshToken, generateAccessToken } = await import(
        "../utils/jwt.js"
    );

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
        throw new Error("Unauthorized");
    }

    const hashedIncoming = hashToken(refreshToken);

    // 🔐 compare hashed tokens
    if (hashedIncoming !== user.refreshToken) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({
        id: user._id,
        role: user.role,
    });

    return { accessToken: newAccessToken };
};



export const logoutUser = async (token) => {
    try {
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            throw new Error("Invalid token");
        }

        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;


        if (ttl <= 0) return true;

        const hashed = hashToken(token);

        await redisClient.set(`bl:${hashed}`, "true", "EX", ttl);

        return true;
    } catch (err) {
        console.error("Logout error:", err); // 👈 IMPORTANT
        throw err; // don't overwrite
    }
};