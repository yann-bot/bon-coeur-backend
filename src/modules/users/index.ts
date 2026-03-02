/**
 * Users module – hexagonal composition root.
 * Core: UserService
 * Outbound: UserPostgresRepo
 * Inbound: UserController (REST)
 */
import { UserService } from "./core/users.services";
import UserController from "./inbound/users.rest";
import { UserPostgresRepo } from "./outbound/users.postgres";

export const repo = new UserPostgresRepo();
const service = new UserService(repo);

export const router = UserController(service);
