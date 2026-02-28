export type Product = {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  currency: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  priceCents: number;
  currency?: string;
  stock?: number;
  isActive?: boolean;
};

export type UpdateProductInput = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt">
>;

export interface ProductRepo {
  create: (input: CreateProductInput) => Promise<Product>;
  findById: (id: string) => Promise<Product | null>;
  findAll: () => Promise<Product[]>;
  update: (id: string, input: UpdateProductInput) => Promise<Product>;
  delete: (id: string) => Promise<void>;
}
