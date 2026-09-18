import { Router } from "express";

import { login } from "../services/auth.service";
import { AppError } from "../utils/appError";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const result = await login(req.body.email, req.body.password);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      return;
    }

    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
      message: "Ocurrió un error inesperado.",
    });
  }
});
