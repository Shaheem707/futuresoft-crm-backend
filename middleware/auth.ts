/// <reference path="../types/express.d.ts" />
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

// Extend Express Request type once, globally
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: number;
                email: string;
            };
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = verifyAccessToken(token);
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};