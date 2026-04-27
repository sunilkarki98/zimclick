import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the direct connection URL for migrations (not the PgBouncer pooled one)
    url: process.env.Direct_DATABASE_URL || process.env.DATABASE_URL,
  },
});
