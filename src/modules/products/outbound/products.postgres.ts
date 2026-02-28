import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { product } from "../../../db/schema";
import type {
  CreateProductInput,
  Product,
  ProductRepo,
  UpdateProductInput,
} from "../core/products.models";

function mapRowToProduct(row: typeof product.$inferSelect): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    priceCents: row.priceCents,
    currency: row.currency,
    stock: row.stock,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class ProductPostgresRepo implements ProductRepo {
  async create(input: CreateProductInput): Promise<Product> {
    const id = randomUUID();

    await db.insert(product).values({
      id,
      name: input.name,
      description: input.description ?? null,
      priceCents: input.priceCents,
      currency: input.currency ?? "EUR",
      stock: input.stock ?? 0,
      isActive: input.isActive ?? true,
    });

    const created = await this.findById(id);
    if (!created) {
      throw new Error("Failed to create product");
    }
    return created;
  }

  async findById(id: string): Promise<Product | null> {
    const rows = await db.select().from(product).where(eq(product.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return mapRowToProduct(row);
  }

  async findAll(): Promise<Product[]> {
    const rows = await db.select().from(product).orderBy(desc(product.createdAt));
    return rows.map(mapRowToProduct);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const updateData: Partial<typeof product.$inferInsert> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.priceCents !== undefined) updateData.priceCents = input.priceCents;
    if (input.currency !== undefined) updateData.currency = input.currency;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    if (Object.keys(updateData).length > 0) {
      await db.update(product).set(updateData).where(eq(product.id, id));
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Failed to update product");
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.delete(product).where(eq(product.id, id));
  }
}
