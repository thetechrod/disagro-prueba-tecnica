import cors from "cors";
import express from "express";
import { confirmationRouter } from "./routes/confirmation.routes";
import { eventRouter } from "./routes/event.routes";
import { authRouter } from "./routes/auth.routes";
import { requireAuth } from "./middleware/auth.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/events", requireAuth, eventRouter);

app.use("/api/confirmations", requireAuth, confirmationRouter);
