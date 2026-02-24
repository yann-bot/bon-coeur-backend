/**
 * Auth module – hexagonal composition root.
 * Core: createAuth (config)
 * Outbound: getAuthDatabaseAdapter (Drizzle)
 * Inbound: createAuthHandler (REST), createAuthServerApi (programmatic)
 */
import { UserService } from "../users/core/users.services";
import { UserPostgresRepo } from "../users/outbound/users.postgres";
import { createAuth } from "./core/auth.config";
import { createAuthHandler } from "./inbound/auth.rest";
import { createAuthServerApi } from "./inbound/auth.server";
import { getAuthDatabaseAdapter } from "./outbound/auth.drizzle";

const databaseAdapter = getAuthDatabaseAdapter();
const userRepo = new UserPostgresRepo()
const userService = new UserService(userRepo);
export const auth = createAuth(databaseAdapter, userService);

export const authHandler = createAuthHandler(auth);
export const authServerApi = createAuthServerApi(auth);
export const AUTH_BASE_PATH = "/api/auth";
