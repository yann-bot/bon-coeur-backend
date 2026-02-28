import cors from "cors";
import express, { type Request, type Response } from "express";
import { AUTH_BASE_PATH, authHandler } from "./modules/auth";
import { router as usersRouter } from "./modules/users";
import { router as productsRouter } from "./modules/products";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Better Auth: mount before express.json() so auth API works correctly
app.use(AUTH_BASE_PATH, authHandler);

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Bon coeur multiservice API" });
});


export default app;