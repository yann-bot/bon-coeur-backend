import type { Request, Response } from "express";
import { Router } from "express";
import type { ProductService } from "../core/products.services";
import {
  ProductDatabaseError,
  ProductNotFoundError,
  ProductValidationError,
} from "../core/products.services";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../core/products.models";

export default function createProductRouter(service: ProductService): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    try {
      const products = await service.findAll();
      return res.json(products);
    } catch (error) {
      if (error instanceof ProductDatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID requis" });
    }

    try {
      const product = await service.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      return res.json(product);
    } catch (error) {
      if (error instanceof ProductDatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  router.post("/", async (req: Request, res: Response) => {
    try {
      const input = req.body as CreateProductInput;
      const product = await service.create(input);
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof ProductValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof ProductDatabaseError) {
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
      const input = req.body as UpdateProductInput;
      const product = await service.update(id, input);
      return res.json(product);
    } catch (error) {
      if (error instanceof ProductValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error instanceof ProductNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ProductDatabaseError) {
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
      if (error instanceof ProductNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      if (error instanceof ProductDatabaseError) {
        return res.status(500).json({ error: error.message });
      }
      throw error;
    }
  });

  return router;
}
