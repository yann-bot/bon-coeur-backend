import { ProductService } from "./core/products.services";
import createProductRouter from "./inbound/products.rest";
import { ProductPostgresRepo } from "./outbound/products.postgres";

const repo = new ProductPostgresRepo();
const service = new ProductService(repo);

export const router = createProductRouter(service);
