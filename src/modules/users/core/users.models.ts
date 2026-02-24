export enum UserProfileRole {
    ADMIN = 'ADMIN',
    EMPLOYE = 'EMPLOYE',
    DIRECTEUR = 'DIRECTEUR',
}

export  type User = {
     id: string,
     name?: string; 
     image?: string;
     email: string;
     emailVerified: boolean;
     createdAt: Date;
     updatedAt: Date;
}


export enum UserProfileStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export type UserProfile  = User & {
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserProfileRole;
    status?: UserProfileStatus;
    lastLoginAt: Date;
}

export type CreateUserProfileInput = {
  id: string; // user.id from Better Auth - required
  name?: string;
  image?: string;
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserProfileRole;
  status?: UserProfileStatus;
}; 

export type UpdateUserProfileInput = Partial<
  Omit<UserProfile, "id" | "createdAt" | "updatedAt">
>;


export interface UserRepo {
    create: (input: CreateUserProfileInput) => Promise<UserProfile>;
    findById: (id: string) => Promise<UserProfile | null>;
    findByUserName: (userName: string) => Promise<UserProfile | null>;
    update: (id: string, input: UpdateUserProfileInput) => Promise<UserProfile>;
    delete: (id: string) => Promise<void>;
    findAll: () => Promise<UserProfile[]>;
}