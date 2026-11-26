import { defineConfig } from "prisma/config";

try {
  if (!process.env.DATABASE_URL && typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  }
} catch {
  // .env is optional when DATABASE_URL is provided via environment secrets
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
