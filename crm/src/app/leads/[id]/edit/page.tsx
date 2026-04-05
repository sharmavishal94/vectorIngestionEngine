import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "../../lead-form";
import { getLead, updateLead } from "../../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) {
    notFound();
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Edit lead</h1>
        <Link href="/leads">Back</Link>
      </div>
      <LeadForm
        action={updateLead}
        submitLabel="Save"
        defaultValues={{
          id: lead.id,
          email: lead.email,
          full_name: lead.full_name,
          phone: lead.phone ?? "",
          source: lead.source ?? "",
          status: lead.status ?? "New",
        }}
      />
    </>
  );
}
