import type { AppConfig } from "../../core/config";
import { drizzle } from "drizzle-orm/bun-sql";

export function initializeDatabase(config: AppConfig) {
  const db = drizzle(config.database_url);
  return db;
}

export type PostgresDatabase = ReturnType<typeof initializeDatabase>;
