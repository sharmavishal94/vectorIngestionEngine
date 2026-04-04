import Link from "next/link";
import { ContactForm } from "../contact-form";
import { createContact } from "../actions";

export default function NewContactPage() {
  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>New contact</h1>
        <Link href="/contacts">Back</Link>
      </div>
      <ContactForm action={createContact} submitLabel="Create" />
    </>
  );
}
