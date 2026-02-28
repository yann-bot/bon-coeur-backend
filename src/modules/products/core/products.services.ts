import type {
  CreateProductInput,
  Product,
  ProductRepo,
  UpdateProductInput,
} from "./products.models";

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Produit non trouvé : ${id}`);
    this.name = "ProductNotFoundError";
  }
}

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductValidationError";
  }
}

export class ProductDatabaseError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "ProductDatabaseError";
    if (cause) this.cause = cause;
  }
}

export class ProductService {
  private db: ProductRepo;

  constructor(repo: ProductRepo) {
    this.db = repo;
  }

  private validateBusinessRules(input: {
    priceCents?: number;
    stock?: number;
  }) {
    if (input.priceCents !== undefined && input.priceCents < 0) {
      throw new ProductValidationError("Le prix doit être positif ou nul");
    }
    if (input.stock !== undefined && input.stock < 0) {
      throw new ProductValidationError("Le stock doit être positif ou nul");
    }
  }

  async create(input: CreateProductInput): Promise<Product> {
    try {
      this.validateBusinessRules(input);
      return await this.db.create(input);
    } catch (error) {
      if (error instanceof ProductValidationError) {
        throw error;
      }
      throw new ProductDatabaseError(
        "Erreur lors de la création du produit",
        error instanceof Error ? error : undefined,
      );
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      return await this.db.findById(id);
    } catch (error) {
      throw new ProductDatabaseError(
        "Erreur lors de la récupération du produit",
        error instanceof Error ? error : undefined,
      );
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.db.findAll();
    } catch (error) {
      throw new ProductDatabaseError(
        "Erreur lors de la récupération des produits",
        error instanceof Error ? error : undefined,
      );
    }
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      this.validateBusinessRules(input);
      const existing = await this.db.findById(id);
      if (!existing) {
        throw new ProductNotFoundError(id);
      }
      return await this.db.update(id, input);
    } catch (error) {
      if (
        error instanceof ProductNotFoundError ||
        error instanceof ProductValidationError ||
        error instanceof ProductDatabaseError
      ) {
        throw error;
      }
      throw new ProductDatabaseError(
        "Erreur inattendue lors de la mise à jour du produit",
        error instanceof Error ? error : undefined,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.db.findById(id);
      if (!existing) {
        throw new ProductNotFoundError(id);
      }
      await this.db.delete(id);
    } catch (error) {
      if (
        error instanceof ProductNotFoundError ||
        error instanceof ProductDatabaseError
      ) {
        throw error;
      }
      throw new ProductDatabaseError(
        "Erreur inattendue lors de la suppression du produit",
        error instanceof Error ? error : undefined,
      );
    }
  }
}
