/**
 * Domain types for auth (optional: Better Auth provides its own types).
 * Use for app-specific auth-related DTOs if needed.
 */
export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name: string;
};
