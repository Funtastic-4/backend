import { eq } from "drizzle-orm";
import type { IUserRepository, User } from "../../core/user";
import type { PostgresDatabase } from "./db";
import { user } from "./model/user";

class UserRepository implements IUserRepository {
  declare db: PostgresDatabase;

  constructor(db: PostgresDatabase) {
    this.db = db;
  }

  async getById(id: number): Promise<User> {
    let result = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!result[0]) {
      throw new Error("User not found");
    }

    return result[0] as User;
  }
}

export { UserRepository };
