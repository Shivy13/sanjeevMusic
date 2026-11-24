import "dotenv/config";
import { seedDatabase } from "../db/seed";
import { getPool } from "../db/index";

async function main() {
  let pool: ReturnType<typeof getPool> | undefined;
  try {
    pool = getPool();
    await seedDatabase();
    console.log("Seed completed!");
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    if (pool) await pool.end();
    process.exit(1);
  }
}

main();
