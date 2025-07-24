import type { AppConfig } from "../../core/config";
import { drizzle } from "drizzle-orm/bun-sql";

export function Initialize(config: AppConfig) {
  const db = drizzle(config.database_url);
  return db;
}
