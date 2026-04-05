"use client";

import { useTransition } from "react";
import { triggerRagAction } from "@/app/leads/actions";

export function RagTrigger({ leadId }: { leadId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleTrigger = () => {
    startTransition(async () => {
      const result = await triggerRagAction(leadId);
      if (result.error) {
         alert(result.error);
      } else {
         alert("RAG Pipeline triggered in Airflow!");
      }
    });
  };

  return (
    <button
      onClick={handleTrigger}
      className={`btn ${isPending ? 'pending' : ''}`}
      disabled={isPending}
      style={{
        background: isPending ? 'var(--surface)' : 'var(--accent)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.25rem',
        fontWeight: 'bold',
        marginTop: '1rem',
        width: '100%',
        justifyContent: 'center',
        border: 'none',
        opacity: isPending ? 0.7 : 1
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>⚡</span>
      {isPending ? "Starting Pipeline..." : "Generate RAG Engine Index"}
    </button>
  );
}
