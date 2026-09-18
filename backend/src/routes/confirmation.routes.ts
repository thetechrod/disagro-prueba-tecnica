import { Router } from "express";

import { createConfirmation } from "../services/confirmation.service";
import { AppError } from "../utils/appError";

export const confirmationRouter = Router();

confirmationRouter.post("/", async (req, res) => {
  try {
    const confirmation = await createConfirmation(req.body);

    res.status(201).json({
      data: confirmation,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
      });

      return;
    }

    console.error("Error al crear la confirmación:", error);

    res.status(500).json({
      message: "Ocurrió un error inesperado.",
    });
  }
});
