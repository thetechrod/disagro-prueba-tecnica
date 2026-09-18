import { scryptSync, timingSafeEqual } from "node:crypto";

import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { findUserByEmail } from "../repositories/auth.repository";
import { AppError } from "../utils/appError";

function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const suppliedHash = scryptSync(password, salt, 64);

  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (suppliedHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(suppliedHash, storedHashBuffer);
}

export async function login(emailInput: string, password: string) {
  const email = emailInput?.trim().toLowerCase();

  if (!email || !password) {
    throw new AppError(400, "Email y contraseña son obligatorios.");
  }

  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AppError(401, "Credenciales inválidas.");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: "4h",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
