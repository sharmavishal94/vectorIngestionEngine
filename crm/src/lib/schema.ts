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
    CREATE TABLE IF NOT EXISTS app.leads (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      phone TEXT,
      source TEXT,
      status TEXT DEFAULT 'New',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS app.documents (
      id BIGSERIAL PRIMARY KEY,
      lead_id BIGINT REFERENCES app.leads(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_app_contacts_email ON app.contacts (email);
    CREATE INDEX IF NOT EXISTS idx_app_leads_email ON app.leads (email);
    CREATE INDEX IF NOT EXISTS idx_app_documents_lead_id ON app.documents (lead_id);
  `);
}
