"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";

type Props = {
  action: (
    prev: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  submitLabel: string;
  defaultValues?: {
    id?: string;
    email?: string;
    full_name?: string;
    phone?: string;
    source?: string;
    status?: string;
  };
};

export function LeadForm({ action, submitLabel, defaultValues }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="stack">
      {state?.error ? <p className="error">{state.error}</p> : null}
      {defaultValues?.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}
      <label>
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaultValues?.email}
        />
      </label>
      <label>
        Full name
        <input
          name="full_name"
          type="text"
          required
          autoComplete="name"
          defaultValue={defaultValues?.full_name}
        />
      </label>
      <label>
        Phone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={defaultValues?.phone ?? ""}
        />
      </label>
      <label>
        Source
        <input
          name="source"
          type="text"
          placeholder="e.g. Web, Referral"
          defaultValue={defaultValues?.source ?? ""}
        />
      </label>
      <label>
        Status
        <select name="status" defaultValue={defaultValues?.status ?? "New"} style={{
            font: 'inherit',
            padding: '0.5rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text)'
        }}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
        </select>
      </label>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
