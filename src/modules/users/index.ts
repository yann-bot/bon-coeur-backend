
import { UserService } from "./core/users.services";
import { UserPostgresRepo } from "./outbound/users.postgres";
import UserController from "./inbound/users.rest";

export const repo = new UserPostgresRepo();
const service = new UserService(repo);
export const router = UserController(service);