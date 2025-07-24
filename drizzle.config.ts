import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/repository/postgres/schema/*",
  out: "./migration/drizzle",
});
