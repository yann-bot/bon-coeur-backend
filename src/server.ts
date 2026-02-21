import express, { type Request, type Response } from "express";
import { AUTH_BASE_PATH, authHandler } from "./modules/auth";

const app = express();

// Better Auth: mount before express.json() so auth API works correctly
app.use(AUTH_BASE_PATH, authHandler);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Bon coeur multiservice API" });
});


export default app;