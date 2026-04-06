import { AgentChat } from "@/components/agent-chat";

export default function AgentsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ marginBottom: "0.5rem" }}>AI Agents</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Interact with your documentation and data cloud through autonomous agents.
        </p>
      </div>
      
      <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
        <AgentChat />
      </div>
    </div>
  );
}
