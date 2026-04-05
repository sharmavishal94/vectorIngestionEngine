import Link from "next/link";
import { LeadForm } from "../lead-form";
import { createLead } from "../actions";

export default function NewLeadPage() {
  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>New lead</h1>
        <Link href="/leads">Back</Link>
      </div>
      <LeadForm action={createLead} submitLabel="Create" />
    </>
  );
}
