import type { Request, Response } from "express";
import { Router } from "express";
import type { UserService } from "../core/users.services";
import {
  DatabaseError,
  EmailConflictError,
  UserNotFoundError,
} from "../core/users.services";
import type { UpdateUserProfileInput } from "../core/users.models";

export default function createUserRouter(service: UserService): Router {
  const router = Router();

  

  router.get("/:id", async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID requis" });
    }
    try {
      const profile = await service.findById(id);
      if (!profile) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      return res.json(profile);
    } catch (error) {
      if (error instanceof DatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  router.patch("/:id", async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID requis" });
    }
    try {
      const input = req.body as UpdateUserProfileInput;
      const profile = await service.update(id, input);
      return res.json(profile);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof EmailConflictError) {
        return res.status(409).json({ error: error.message });
      }
      if (error instanceof DatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID requis" });
    }
    try {
      await service.delete(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof DatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  return router;
}
