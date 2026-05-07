
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../services/auth.service.js";

import { successResponse, errorResponse } from "../utils/constants/response.js";

import { accessCookieOptions, refreshCookieOptions } from "../utils/cookie.js";
import { getUserFromToken } from "../utils/jwt.js";

// ---- REGISTER ----
export const register = async (req, res) => {
    try {
        const tokens = await registerUser(req.body);

        if (!tokens?.accessToken || !tokens?.refreshToken) {
            return errorResponse(res, "Token generation failed", 500, "TOKEN_ERROR");
        }

        res.cookie("accessToken", tokens.accessToken, accessCookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

        return successResponse(res, null, "Register successful", 201);
    } catch (err) {
        return errorResponse(res, err.message, 400, "REGISTER_ERROR");
    }
};

// ---- LOGIN ----
export const login = async (req, res) => {
    try {
        const userData = await loginUser(req.body);
        const { user, tokens } = userData
        const { _id, email, role } = user

        if (!tokens?.accessToken || !tokens?.refreshToken) {
            return errorResponse(res, "Token generation failed", 500, "TOKEN_ERROR");
        }

        res.cookie("accessToken", tokens.accessToken, accessCookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

        return successResponse(res, { _id, email, role }, "Login successful");
    } catch (err) {
        return errorResponse(res, err.message, 401, "AUTH_ERROR");
    }
};

// ---- REFRESH ----
export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken || typeof refreshToken !== "string") {
            return errorResponse(res, "Refresh token missing", 401, "NO_TOKEN");
        }

        const tokens = await refreshAccessToken(refreshToken);

        if (!tokens?.accessToken) {
            return errorResponse(res, "Token refresh failed", 500, "TOKEN_ERROR");
        }

        res.cookie("accessToken", tokens.accessToken, accessCookieOptions);

        return successResponse(res, null, "Token refreshed");
    } catch (err) {
        return errorResponse(res, err.message, 403, "REFRESH_ERROR");
    }
};

// ---- LOGOUT ----
export const logout = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;

        // optional: allow logout even if token missing (idempotent)
        if (token && typeof token === "string") {
            await logoutUser(token);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return successResponse(res, null, "Logged out successfully");
    } catch (err) {
        return errorResponse(res, err.message, 400, "LOGOUT_ERROR");
    }
};


export const getMe = async (req, res) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];
        if (!token) {
            return errorResponse(res, "Unauthorized", 401, "NO_TOKEN");
        }
        const user = await getUserFromToken(token);
        return successResponse(res, user, "User fetched successfully");
    } catch (err) {
        return errorResponse(res, err.message, 401, "AUTH_ERROR");
    }
};