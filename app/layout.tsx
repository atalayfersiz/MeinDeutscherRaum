import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "MeinDeutscherRaum — Kişisel Almanca Belleği",
  description: "Minimalist, Bauhaus-inspired personal German learning & memory space. Local-first Markdown sync, Knowledge Graph, Konnektoren Hub, SRS Vocabulary, and Focus Reader.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF9F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAF9F5] dark:bg-[#111110] text-[#181715] dark:text-[#F2EFE9] transition-colors selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
