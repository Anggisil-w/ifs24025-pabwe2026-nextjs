import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Postingan", description: "Aplikasi Postingan Delcom" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
