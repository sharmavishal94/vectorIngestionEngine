"use client";

import { useState } from "react";
import { AgentChat } from "./agent-chat";

export function FloatingAgent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="floating-agent-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        {isOpen ? "✕" : "AI"}
      </button>

      {isOpen && (
        <div className="quick-agent-popover">
          <AgentChat />
        </div>
      )}
    </>
  );
}
