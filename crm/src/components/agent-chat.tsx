"use client";

import { useState, useRef, useEffect } from "react";
import { askAgentAction } from "@/app/leads/actions";

interface Message {
  role: "user" | "agent";
  content: string;
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: "Hello! I'm your Data Cloud assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      console.log('h')
      const res = await askAgentAction(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: res.response,
        },
      ]);
    } catch (error) {
      console.error("Agent error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry, I'm having trouble connecting to the RAG engine right now. Please try again later.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="agent-container">
      <div className="agent-header">
        <div className="agent-avatar">AI</div>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Data Assistant</h2>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Online • Powered by RAG Engine
          </span>
        </div>
      </div>

      <div className="agent-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="message agent">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="agent-input-container">
        <form className="agent-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="agent-input"
            placeholder="Ask anything about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className="agent-send-btn" disabled={isTyping}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
