import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  tenantId: number;
  email: string;
  role: string; // 🔹 NEW
}

export const signAccessToken = (payload: JwtPayload): string =>
    jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

export const signRefreshToken = (payload: JwtPayload): string =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

export const verifyAccessToken = (token: string): JwtPayload =>
    jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;