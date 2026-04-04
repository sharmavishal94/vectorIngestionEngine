import Link from "next/link";
import { deleteContact, listContacts } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const contacts = await listContacts();

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Contacts</h1>
        <Link href="/contacts/new" className="btn btn-primary">
          New contact
        </Link>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, fontSize: "0.9rem" }}>
        Data lives in Postgres schema <code>app</code> (not <code>raw</code>).
      </p>
      {contacts.length === 0 ? (
        <p>No contacts yet. Add one to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.email}</td>
                <td>{c.full_name}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`/contacts/${c.id}/edit`}>Edit</Link>
                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="btn-danger">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
