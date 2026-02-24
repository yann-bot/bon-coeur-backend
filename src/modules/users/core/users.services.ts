import type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfile,
  UserRepo,
} from "./users.models";

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`Utilisateur non trouvé : ${id}`);
    this.name = "UserNotFoundError";
  }
}

export class EmailConflictError extends Error {
  constructor(email: string) {
    super(`Un utilisateur avec l'email ${email} existe déjà`);
    this.name = "EmailConflictError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "DatabaseError";
    if (cause) this.cause = cause;
  }
}

export class UserService {
  private db: UserRepo;

  constructor(repo: UserRepo) {
    this.db = repo;
  }

  async createProfile(input: CreateUserProfileInput): Promise<UserProfile> {
    try {
      return await this.db.create(input);
    } catch (error) {
      throw new DatabaseError(
        "Erreur lors de la création du profil utilisateur",
        error instanceof Error ? error : undefined
      );
    }
  }

  async findById(id: string): Promise<UserProfile | null> {
    try {
      return await this.db.findById(id);
    } catch (error) {
      throw new DatabaseError(
        "Erreur lors de la récupération de l'utilisateur",
        error instanceof Error ? error : undefined
      );
    }
  }

  async findByUserName(userName: string): Promise<UserProfile | null> {
    try {
      return await this.db.findByUserName(userName);
    } catch (error) {
      throw new DatabaseError(
        "Erreur lors de la recherche de l'utilisateur par email",
        error instanceof Error ? error : undefined
      );
    }
  }

  async findAll(): Promise<UserProfile[]> {
    try {
      return await this.db.findAll();
    } catch (error) {
      throw new DatabaseError(
        "Erreur lors de la récupération de tous les utilisateurs",
        error instanceof Error ? error : undefined
      );
    }
  }

  async update(id: string, input: UpdateUserProfileInput): Promise<UserProfile> {
    try {
      const existingUser = await this.db.findById(id);
      if (!existingUser) {
        throw new UserNotFoundError(id);
      }

      if (input.email && input.email !== existingUser.email) {
        const userWithSameEmail = await this.db.findByUserName(input.email);
        if (userWithSameEmail) {
          throw new EmailConflictError(input.email);
        }
      }

      return await this.db.update(id, input);
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof EmailConflictError ||
        error instanceof DatabaseError
      ) {
        throw error;
      }
      throw new DatabaseError(
        "Erreur inattendue lors de la mise à jour de l'utilisateur",
        error instanceof Error ? error : undefined
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingUser = await this.db.findById(id);
      if (!existingUser) {
        throw new UserNotFoundError(id);
      }
      await this.db.delete(id);
    } catch (error) {
      if (error instanceof UserNotFoundError || error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        "Erreur inattendue lors de la suppression du profil utilisateur",
        error instanceof Error ? error : undefined
      );
    }
  }
}
