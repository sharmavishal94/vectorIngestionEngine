"use client";

import { useActionState, useRef } from "react";
import { uploadFile, type FormState } from "@/app/leads/actions";

export function FileUpload({ leadId }: { leadId: string }) {
  const [state, formAction, isPending] = useActionState(uploadFile, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="upload-zone">
      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="upload-form"
      >
        <input type="hidden" name="leadId" value={leadId} />
        <label className="upload-label">
          <div style={{ fontSize: '2rem', color: 'var(--accent)' }}>📂</div>
          <div>{isPending ? "Uploading..." : "Click or drag to upload document"}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>
            PDF, DOCX, or TXT (Max 10MB)
          </p>
          <input
            type="file"
            name="file"
            accept=".pdf,.docx,.txt"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.length) {
                formRef.current?.requestSubmit();
              }
            }}
          />
        </label>
        {state?.error ? <p className="error" style={{ marginTop: '1rem' }}>{state.error}</p> : null}
      </form>
    </div>
  );
}
