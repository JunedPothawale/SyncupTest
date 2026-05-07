import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import User from "../models/user.model.js";
dotenv.config()

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ---- Generate Tokens ----
export const generateAccessToken = (payload) => {

    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m",
        issuer: "job-platform",
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

// ---- Verify ----
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const getUserFromToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};