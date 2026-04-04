import { getPool } from "./db";

/** Idempotent bootstrap for app schema (runs from instrumentation on server start). */
export async function ensureAppSchema(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS app;
    CREATE TABLE IF NOT EXISTS app.contacts (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_app_contacts_email ON app.contacts (email);
  `);
}
