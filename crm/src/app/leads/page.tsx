import Link from "next/link";
import { deleteLead, listLeads } from "./actions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Leads</h1>
        <Link href="/leads/new" className="btn btn-primary">
          New lead
        </Link>
      </div>
      <p style={{ color: "var(--muted)", marginTop: 0, fontSize: "0.9rem" }}>
        Data lives in Postgres schema <code>app</code> (not <code>raw</code>).
      </p>
      {leads.length === 0 ? (
        <p>No leads yet. Add one to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Source</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.email}</td>
                <td>
                  <Link href={`/leads/${l.id}`} style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {l.full_name}
                  </Link>
                </td>
                <td>{l.source ?? "—"}</td>
                <td>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: l.status === 'Lost' ? 'var(--danger)' : 'var(--accent)',
                    color: '#fff'
                  }}>
                    {l.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/leads/${l.id}/edit`}>Edit</Link>
                    <form action={deleteLead}>
                      <input type="hidden" name="id" value={l.id} />
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
