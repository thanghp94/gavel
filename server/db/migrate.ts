import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from '../db';

async function main() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations completed!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});