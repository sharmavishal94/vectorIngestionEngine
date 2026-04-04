"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";

export type ContactRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type FormState = { error?: string };

export async function listContacts(): Promise<ContactRow[]> {
  const r = await getPool().query<ContactRow>(
    `SELECT id::text, email, full_name, phone,
            created_at::text, updated_at::text
     FROM app.contacts
     ORDER BY created_at DESC`,
  );
  return r.rows;
}

export async function getContact(id: string): Promise<ContactRow | null> {
  const r = await getPool().query<ContactRow>(
    `SELECT id::text, email, full_name, phone,
            created_at::text, updated_at::text
     FROM app.contacts WHERE id = $1`,
    [id],
  );
  return r.rows[0] ?? null;
}

export async function createContact(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  if (!email || !full_name) {
    return { error: "Email and full name are required." };
  }
  try {
    await getPool().query(
      `INSERT INTO app.contacts (email, full_name, phone) VALUES ($1, $2, $3)`,
      [email, full_name, phone],
    );
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "23505") {
      return { error: "That email is already in use." };
    }
    return { error: "Could not save contact." };
  }
  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function updateContact(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  if (!id || !email || !full_name) {
    return { error: "All required fields must be filled." };
  }
  try {
    const r = await getPool().query(
      `UPDATE app.contacts
       SET email = $1, full_name = $2, phone = $3, updated_at = now()
       WHERE id = $4`,
      [email, full_name, phone, id],
    );
    if (r.rowCount === 0) {
      return { error: "Contact not found." };
    }
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "23505") {
      return { error: "That email is already in use." };
    }
    return { error: "Could not update contact." };
  }
  revalidatePath("/contacts");
  redirect("/contacts");
}

export async function deleteContact(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  await getPool().query(`DELETE FROM app.contacts WHERE id = $1`, [id]);
  revalidatePath("/contacts");
  redirect("/contacts");
}
