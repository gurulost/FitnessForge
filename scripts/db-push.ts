import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

async function runMigration() {
  console.log("Pushing schema to database...");
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema });
  
  try {
    // This will create the tables defined in the schema
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Schema pushed successfully!");
  } catch (error) {
    console.error("Error pushing schema:", error);
  } finally {
    await pool.end();
  }
}

runMigration();