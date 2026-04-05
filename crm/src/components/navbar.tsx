"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  // Hide the navbar on the login page
  if (pathname === "/login") return null;

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-dot"></span>
          Data Cloud
        </div>
        <div className="nav-links">
          <Link
            href="/contacts"
            className={`nav-link ${pathname === "/contacts" ? "active" : ""}`}
          >
            Contacts
          </Link>
          <Link
            href="/leads"
            className={`nav-link ${pathname === "/leads" ? "active" : ""}`}
          >
            Leads
          </Link>
        </div>
        <div className="nav-user">
          <Link href="/login" className="logout-btn">
            Sign out
          </Link>
        </div>
      </div>
    </nav>
  );
}
