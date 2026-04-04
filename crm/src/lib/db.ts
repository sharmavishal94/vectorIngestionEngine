import { Pool } from "pg";

const globalForPool = globalThis as unknown as { pgPool: Pool | undefined };

export function getPool(): Pool {
  if (!globalForPool.pgPool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForPool.pgPool = new Pool({ connectionString: url, max: 10 });
  }
  return globalForPool.pgPool;
}
