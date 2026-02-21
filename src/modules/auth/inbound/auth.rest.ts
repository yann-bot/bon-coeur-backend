import type { IncomingMessage, ServerResponse } from "node:http";
import { toNodeHandler } from "better-auth/node";
import type { AuthInstance } from "../core/auth.config";

const rawHandler = (auth: AuthInstance) => toNodeHandler(auth);

/**
 * Inbound HTTP adapter: Better Auth handler for /api/auth/*.
 * Wraps the handler to catch JSON parse errors and return 400.
 */
export function createAuthHandler(auth: AuthInstance) {
  const handler = rawHandler(auth);
  return function authHandler(req: IncomingMessage, res: ServerResponse): void {
    handler(req, res).catch((err: unknown) => {
      if (
        err instanceof SyntaxError &&
        "message" in err &&
        String(err.message).includes("JSON")
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Invalid JSON body",
            detail:
              "Send valid JSON with header Content-Type: application/json. Check for trailing commas, double quotes, and complete braces.",
          }),
        );
      } else {
        console.error("[auth]", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  };
}
