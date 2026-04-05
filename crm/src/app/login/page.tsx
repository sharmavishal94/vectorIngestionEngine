"use client";

import { useActionState } from "react";
import { redirect } from "next/navigation";

async function loginAction(prevState: any, formData: FormData) {
  // Mock login logic - Redirect to contacts if successful
  const email = formData.get("email");
  const password = formData.get("password");

  if (email && password) {
    // In real app: validate with DB
    redirect("/contacts");
  }
  return { error: "Invalid login credentials." };
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-glass-card">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold', color: '#fff' }}>
            Data Cloud
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
            Empower your team with advanced vector-driven CRM insight and real-time data ingestion.
          </p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your portal</p>
        </div>
        <form action={formAction} className="login-form">
          {state?.error && <p className="error">{state.error}</p>}
          <div className="login-input-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              className="login-input"
              placeholder="admin@datacloud.com"
              required
            />
          </div>
          <div className="login-input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="login-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="login-btn btn-primary" disabled={isPending}>
            {isPending ? "Signing in..." : "Continue"}
          </button>
        </form>
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
