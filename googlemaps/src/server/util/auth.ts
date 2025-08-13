// src/server/util/auth.ts
import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
const app = admin.apps[0] || admin.initializeApp();

export async function verify(idToken?: string) {
  if (!idToken) throw new Error("No token");
  return admin.auth().verifyIdToken(idToken);
}

interface AuthenticatedRequest extends Request {
  user: admin.auth.DecodedIdToken;
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (["/public", "/health"].some((p) => req.path.startsWith(p))) return next();
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    (req as AuthenticatedRequest).user = await verify(token);
    next();
  } catch (e) {
    res.status(401).json({ error: "unauthorized" });
  }
}

interface SocketWithAuth extends Socket {
  user: admin.auth.DecodedIdToken;
}

interface SocketAuthData {
  token?: string;
}

export async function wsAuth(socket: Socket, next: (err?: Error) => void): Promise<void> {
  try {
    const token = (socket.handshake.auth as SocketAuthData)?.token;
    (socket as SocketWithAuth).user = await verify(token);
    next();
  } catch (e) {
    next(new Error("unauthorized"));
  }
}
