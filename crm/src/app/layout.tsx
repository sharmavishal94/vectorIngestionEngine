import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { FloatingAgent } from "@/components/floating-agent";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM",
  description: "Contacts (app schema)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <FloatingAgent />
      </body>
    </html>
  );
}
