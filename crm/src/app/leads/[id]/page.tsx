import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead, listDocuments } from "../actions";
import { FileUpload } from "@/components/file-upload";
import { RagTrigger } from "@/components/rag-trigger";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const [lead, documents] = await Promise.all([
    getLead(id),
    listDocuments(id)
  ]);

  if (!lead) {
    notFound();
  }

  return (
    <>
      <div className="detail-header">
        <div>
          <Link href="/leads" style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'block', marginBottom: '0.75rem' }}>
            ← Back to all leads
          </Link>
          <h1 style={{ margin: 0, fontSize: '2.25rem' }}>{lead.full_name}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <span className={`status-badge ${lead.status === 'New' ? 'active' : ''}`}>
              {lead.status}
            </span>
          </div>
        </div>
        <div className="row-actions">
          <Link href={`/leads/${lead.id}/edit`} className="btn">
            Edit details
          </Link>
        </div>
      </div>

      <div className="detail-grid">
        <div className="info-card">
          <h3>Contact Details</h3>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{lead.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{lead.phone || "—"}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>Lead Intel</h3>
          <div className="info-item">
            <span className="info-label">Source</span>
            <span className="info-value">{lead.source || "Unknown"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Created</span>
            <span className="info-value">{new Date(lead.created_at).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Updated</span>
            <span className="info-value">{new Date(lead.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Documents & Knowledge Base</h2>
        
        <FileUpload leadId={lead.id} />
        
        <div style={{ maxWidth: '400px', margin: '0 0 2.5rem' }}>
          <RagTrigger leadId={lead.id} />
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'center' }}>
            This will trigger the Airflow <code>process_lead_rag</code> pipeline.
          </p>
        </div>

        {documents.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center' }}>
            No documents uploaded yet. Upload a PDF or DOCX to start the vector ingestion process.
          </p>
        ) : (
          <div className="document-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-info">
                  <span className="document-name">{doc.filename}</span>
                  <span className="document-meta">
                    Uploaded on {new Date(doc.created_at).toLocaleDateString()} • {doc.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <span style={{
                     fontSize: '0.7rem',
                     color: 'var(--accent)',
                     background: 'rgba(59, 130, 246, 0.1)',
                     padding: '0.2rem 0.5rem',
                     borderRadius: '4px',
                     border: '1px solid rgba(59, 130, 246, 0.2)'
                   }}>
                     READY FOR RAG
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info-card" style={{ marginTop: '1.5rem' }}>
        <h3>Activity Timeline</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          No activity recorded yet for this lead. Activities like emails sent or calls made will appear here.
        </p>
      </div>
    </>
  );
}
