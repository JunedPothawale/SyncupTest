import express from 'express'
import { getMe, login, logout, refresh, register } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validator.middleware.js';
import {
    registerSchema,
    loginSchema,
    refreshSchema,
} from '../validator/auth.validator.js'
import { getUserFromToken } from '../utils/jwt.js';

const authRouter = express.Router()



authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshSchema), refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);


export default authRouter