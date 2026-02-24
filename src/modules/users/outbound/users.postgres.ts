import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { user, userProfile } from "../../../db/schema";
import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfile,
  UserProfileRole,
  UserProfileStatus,
  UserRepo,
} from "../core/users.models";

function mapRowToUserProfile(
  u: typeof user.$inferSelect,
  p: typeof userProfile.$inferSelect
): UserProfile {
  return {
    id: u.id,
    name: u.name ?? undefined,
    image: u.image ?? undefined,
    email: u.email,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    firstName: p.firstName ?? undefined,
    lastName: p.lastName ?? undefined,
    phone: p.phone ?? undefined,
    role: (p.role as UserProfileRole) ?? undefined,
    status: (p.status as UserProfileStatus) ?? undefined,
    lastLoginAt: p.lastLoginAt,
  };
}
export class UserPostgresRepo implements UserRepo {
  async create(input: CreateUserProfileInput): Promise<UserProfile> {
    const now = new Date();
    await db.insert(userProfile).values({
      userId: input.id,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      phone: input.phone ?? null,
      role: input.role ?? null,
      status: input.status ?? null,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    });

    const profile = await this.findById(input.id);
    if (!profile) {
      throw new Error("Failed to create user profile");
    }
    return profile;
  }

  async findById(id: string): Promise<UserProfile | null> {
    const rows = await db
      .select()
      .from(user)
      .innerJoin(userProfile, eq(user.id, userProfile.userId))
      .where(eq(user.id, id));

    const row = rows[0];
    if (!row) return null;
    return mapRowToUserProfile(row.user, row.user_profile);
  }

  async findByUserName(userName: string): Promise<UserProfile | null> {
    const rows = await db
      .select()
      .from(user)
      .innerJoin(userProfile, eq(user.id, userProfile.userId))
      .where(eq(user.email, userName));

    const row = rows[0];
    if (!row) return null;
    return mapRowToUserProfile(row.user, row.user_profile);
  }

  async update(id: string, input: UpdateUserProfileInput): Promise<UserProfile> {
    const profileUpdate: Partial<typeof userProfile.$inferInsert> = {};
    if (input.firstName !== undefined) profileUpdate.firstName = input.firstName;
    if (input.lastName !== undefined) profileUpdate.lastName = input.lastName;
    if (input.phone !== undefined) profileUpdate.phone = input.phone;
    if (input.role !== undefined) profileUpdate.role = input.role;
    if (input.status !== undefined) profileUpdate.status = input.status;
    if (input.lastLoginAt !== undefined)
      profileUpdate.lastLoginAt = input.lastLoginAt;

    const userUpdate: Partial<typeof user.$inferInsert> = {};
    if (input.name !== undefined) userUpdate.name = input.name;
    if (input.image !== undefined) userUpdate.image = input.image;
    if (input.email !== undefined) userUpdate.email = input.email;
    if (input.emailVerified !== undefined)
      userUpdate.emailVerified = input.emailVerified;

    if (Object.keys(profileUpdate).length > 0) {
      await db
        .update(userProfile)
        .set(profileUpdate)
        .where(eq(userProfile.userId, id));
    }
    if (Object.keys(userUpdate).length > 0) {
      await db.update(user).set(userUpdate).where(eq(user.id, id));
    }

    const profile = await this.findById(id);
    if (!profile) {
      throw new Error("Failed to update user profile");
    }
    return profile;
  }

  async delete(id: string): Promise<void> {
    await db.delete(userProfile).where(eq(userProfile.userId, id));
  }

  async findAll(): Promise<UserProfile[]> {
    const rows = await db
      .select()
      .from(user)
      .innerJoin(userProfile, eq(user.id, userProfile.userId));
    return rows.map((row) => mapRowToUserProfile(row.user, row.user_profile));
  }
}
