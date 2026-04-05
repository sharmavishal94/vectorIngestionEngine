"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";

export type LeadRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type FormState = { error?: string };

export async function listLeads(): Promise<LeadRow[]> {
  const r = await getPool().query<LeadRow>(
    `SELECT id::text, email, full_name, phone, source, status,
            created_at::text, updated_at::text
     FROM app.leads
     ORDER BY created_at DESC`,
  );
  return r.rows;
}

export async function getLead(id: string): Promise<LeadRow | null> {
  const r = await getPool().query<LeadRow>(
    `SELECT id::text, email, full_name, phone, source, status,
            created_at::text, updated_at::text
     FROM app.leads WHERE id = $1`,
    [id],
  );
  return r.rows[0] ?? null;
}

export async function createLead(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const source = String(formData.get("source") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "New").trim();

  if (!email || !full_name) {
    return { error: "Email and full name are required." };
  }
  try {
    await getPool().query(
      `INSERT INTO app.leads (email, full_name, phone, source, status) VALUES ($1, $2, $3, $4, $5)`,
      [email, full_name, phone, source, status],
    );
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "23505") {
      return { error: "That email is already in use." };
    }
    return { error: "Could not save lead." };
  }
  revalidatePath("/leads");
  redirect("/leads");
}

export async function updateLead(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const source = String(formData.get("source") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "New").trim();

  if (!id || !email || !full_name) {
    return { error: "All required fields must be filled." };
  }
  try {
    const r = await getPool().query(
      `UPDATE app.leads
       SET email = $1, full_name = $2, phone = $3, source = $4, status = $5, updated_at = now()
       WHERE id = $6`,
      [email, full_name, phone, source, status, id],
    );
    if (r.rowCount === 0) {
      return { error: "Lead not found." };
    }
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "23505") {
      return { error: "That email is already in use." };
    }
    return { error: "Could not update lead." };
  }
  revalidatePath("/leads");
  redirect("/leads");
}

export type DocumentRow = {
  id: string;
  lead_id: string;
  filename: string;
  file_path: string;
  file_type: string;
  created_at: string;
};

export async function listDocuments(leadId: string): Promise<DocumentRow[]> {
  const r = await getPool().query<DocumentRow>(
    `SELECT id::text, lead_id::text, filename, file_path, file_type, created_at::text
     FROM app.documents WHERE lead_id = $1 ORDER BY created_at DESC`,
    [leadId],
  );
  return r.rows;
}

export async function uploadFile(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const file = formData.get("file") as File;
  const leadId = String(formData.get("leadId") ?? "");

  if (!file || !leadId) {
    return { error: "File and Lead ID are required." };
  }

  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    await getPool().query(
      `INSERT INTO app.documents (lead_id, filename, file_path, file_type) VALUES ($1, $2, $3, $4)`,
      [leadId, file.name, filePath, file.type],
    );
  } catch (e: any) {
    console.error("Upload error:", e);
    return { error: "Could not upload file: " + e.message };
  }

  revalidatePath(`/leads/${leadId}`);
  return { error: "" };
}

export async function triggerRagAction(leadId: string): Promise<FormState> {
  const airflowUrl = "http://airflow-webserver:8080/api/v2/dags/process_lead_rag/dagRuns";

  // Create a base64 encoded auth header (admin:admin)
  const auth = Buffer.from("admin:admin").toString("base64");

  try {
    const response = await fetch(airflowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify({
        conf: { lead_id: leadId }
      })
    });

    if (!response.ok) {
      const status = response.status;
      const error = await response.text();
      console.error(`Airflow trigger error (${status}):`, error);
      return { error: `Could not trigger RAG (${status}): ` + error };
    }

    return { error: "" };
  } catch (e: any) {
    console.error("Airflow fetch error:", e);
    return { error: "Could not trigger RAG pipeline." };
  }
}

export async function deleteLead(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  await getPool().query(`DELETE FROM app.leads WHERE id = $1`, [id]);
  revalidatePath("/leads");
  redirect("/leads");
}
