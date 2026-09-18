import { Router } from "express";
import { getActiveEvent } from "../services/event.service";

export const eventRouter = Router();

eventRouter.get("/active", async (_req, res) => {
  try {
    const event = await getActiveEvent();

    if (!event) {
      res.status(404).json({
        message: "No hay un evento activo disponible.",
      });

      return;
    }

    res.status(200).json({
      data: event,
    });
  } catch (error) {
    console.error("Error al obtener el evento activo:", error);

    res.status(500).json({
      message: "Ocurrió un error inesperado.",
    });
  }
});
