import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "题库中心 Quiz Hub",
  description: "简洁干净的在线刷题平台。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
          {children}
        </main>
        <footer className="text-center text-xs text-slate-400 py-6">
          Powered by Next.js 15 · Cloudflare
        </footer>
      </body>
    </html>
  );
}
