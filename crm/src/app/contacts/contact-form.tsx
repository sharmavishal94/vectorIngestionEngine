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
  };
};

export function ContactForm({ action, submitLabel, defaultValues }: Props) {
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
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
