import type { BetterAuthOptions, DBAdapter } from "better-auth";

/**
 * Ports (hexagonal): interfaces that the auth core depends on.
 * Outbound adapters (e.g. Drizzle) implement these.
 *
 * This matches the database adapter factory type that Better Auth expects.
 * The outbound `auth.drizzle` module returns a function of this shape.
 */
export type AuthDatabaseAdapter = (
  options: BetterAuthOptions,
) => DBAdapter<BetterAuthOptions>;
