import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "../../contact-form";
import { getContact, updateContact } from "../../actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditContactPage({ params }: Props) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) {
    notFound();
  }

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Edit contact</h1>
        <Link href="/contacts">Back</Link>
      </div>
      <ContactForm
        action={updateContact}
        submitLabel="Save"
        defaultValues={{
          id: contact.id,
          email: contact.email,
          full_name: contact.full_name,
          phone: contact.phone ?? "",
        }}
      />
    </>
  );
}
