import { betterAuth } from "better-auth";
import type { AuthDatabaseAdapter } from "./auth.ports";

/**
 * Creates the Better Auth instance (core application).
 * Database adapter is injected from the outbound layer.
 */
export function createAuth(database: AuthDatabaseAdapter) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:3000",
    database: database as Parameters<typeof betterAuth>[0]["database"],
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
