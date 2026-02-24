import { betterAuth } from "better-auth";
import type { UserService } from "../../users/core/users.services";
import type { AuthDatabaseAdapter } from "./auth.ports";

/**
 * Creates the Better Auth instance (core application).
 * Database adapter is injected from the outbound layer.
 * userService is used to create UserProfile when a user signs up.
 */
export function createAuth(
  database: AuthDatabaseAdapter,
  userService: UserService
) {
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_BASE_URL ?? "http://localhost:3000",
    trustedOrigins: ["http://localhost:5173"],
    database: database as Parameters<typeof betterAuth>[0]["database"],
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await userService.createProfile({
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image ?? undefined,
              emailVerified: user.emailVerified,
            });
          },
        },
      },
    },
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
