import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../../db";
import * as schema from "../../../db/schema";

/**
 * Outbound adapter: provides the database layer for Better Auth (port implementation).
 * Uses Drizzle + PostgreSQL and the shared auth schema.
 */
export function getAuthDatabaseAdapter() {
  return drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  });
}
