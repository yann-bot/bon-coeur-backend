import { describe, expect, it } from "bun:test";
import {
  ProductDatabaseError,
  ProductNotFoundError,
  ProductService,
  ProductValidationError,
} from "./products.services";
import type {
  CreateProductInput,
  Product,
  ProductRepo,
  UpdateProductInput,
} from "./products.models";

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-1",
    name: "Produit test",
    description: "desc",
    priceCents: 1000,
    currency: "EUR",
    stock: 10,
    isActive: true,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function createRepoMock(overrides: Partial<ProductRepo> = {}): ProductRepo {
  return {
    create: async (input: CreateProductInput) =>
      buildProduct({
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        currency: input.currency ?? "EUR",
        stock: input.stock ?? 0,
        isActive: input.isActive ?? true,
      }),
    findById: async (_id: string) => buildProduct(),
    findAll: async () => [buildProduct()],
    update: async (_id: string, input: UpdateProductInput) =>
      buildProduct({ ...input }),
    delete: async (_id: string) => undefined,
    ...overrides,
  };
}

describe("ProductService", () => {
  it("crée un produit valide", async () => {
    const service = new ProductService(createRepoMock());

    const created = await service.create({
      name: "Clavier",
      priceCents: 4999,
      stock: 5,
    });

    expect(created.name).toBe("Clavier");
    expect(created.priceCents).toBe(4999);
    expect(created.stock).toBe(5);
  });

  it("rejette une création avec prix négatif", async () => {
    const service = new ProductService(createRepoMock());

    expect(
      service.create({
        name: "Invalide",
        priceCents: -1,
      }),
    ).rejects.toBeInstanceOf(ProductValidationError);
  });

  it("rejette une mise à jour avec stock négatif", async () => {
    const service = new ProductService(createRepoMock());

    expect(service.update("p-1", { stock: -10 })).rejects.toBeInstanceOf(
      ProductValidationError,
    );
  });

  it("retourne ProductNotFoundError quand update cible un produit inexistant", async () => {
    const repo = createRepoMock({
      findById: async () => null,
    });
    const service = new ProductService(repo);

    expect(service.update("missing", { name: "X" })).rejects.toBeInstanceOf(
      ProductNotFoundError,
    );
  });

  it("retourne ProductNotFoundError quand delete cible un produit inexistant", async () => {
    const repo = createRepoMock({
      findById: async () => null,
    });
    const service = new ProductService(repo);

    expect(service.delete("missing")).rejects.toBeInstanceOf(
      ProductNotFoundError,
    );
  });

  it("wrap les erreurs repo en ProductDatabaseError sur create", async () => {
    const repo = createRepoMock({
      create: async () => {
        throw new Error("db down");
      },
    });
    const service = new ProductService(repo);

    expect(
      service.create({
        name: "Produit",
        priceCents: 100,
      }),
    ).rejects.toBeInstanceOf(ProductDatabaseError);
  });
});
