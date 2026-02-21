/**
 * Auth module – hexagonal composition root.
 * Core: createAuth (config)
 * Outbound: getAuthDatabaseAdapter (Drizzle)
 * Inbound: createAuthHandler (REST), createAuthServerApi (programmatic)
 */
import { createAuth } from "./core/auth.config";
import { createAuthHandler } from "./inbound/auth.rest";
import { createAuthServerApi } from "./inbound/auth.server";
import { getAuthDatabaseAdapter } from "./outbound/auth.drizzle";

const databaseAdapter = getAuthDatabaseAdapter();
export const auth = createAuth(databaseAdapter);

export const authHandler = createAuthHandler(auth);
export const authServerApi = createAuthServerApi(auth);

export const AUTH_BASE_PATH = "/api/auth";
