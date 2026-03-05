import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AISpera Spec Management",
  description: "AISpera 지식재산권/인증/수상 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
