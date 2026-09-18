import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Autenticación requerida.",
    });

    return;
  }

  const token = authorization.substring(7);

  try {
    jwt.verify(token, env.jwtSecret);

    next();
  } catch {
    res.status(401).json({
      message: "Sesión inválida o expirada.",
    });
  }
}
