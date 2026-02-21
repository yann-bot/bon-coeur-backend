/**
 * Ports (hexagonal): interfaces that the auth core depends on.
 * Outbound adapters (e.g. Drizzle) implement these.
 *
 * Better Auth expects a database adapter with a specific shape;
 * the outbound auth.drizzle module provides it.
 */
export type AuthDatabaseAdapter = (options: unknown) => unknown;
