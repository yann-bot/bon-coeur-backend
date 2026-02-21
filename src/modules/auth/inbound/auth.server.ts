import type { AuthInstance } from "../core/auth.config";

/**
 * Inbound programmatic adapter: server-side auth API (e.g. for scripts or internal calls).
 */
export function createAuthServerApi(auth: AuthInstance) {
  return {
    async signInEmail(email: string, password: string) {
      return auth.api.signInEmail({
        body: { email, password },
        asResponse: true,
      });
    },
  };
}
