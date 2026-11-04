import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "MeinDeutscherRaum — Personal German Workspace",
  description: "Minimalist, Bauhaus-inspired personal German learning & memory space. Local-first Markdown sync, Connectors Compass, Dativ & Akkusativ Hub, SRS Vocabulary, and Focus Reader.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111110",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#111110] dark:bg-[#111110] text-[#F2EFE9] dark:text-[#F2EFE9] transition-colors selection:bg-neutral-100 selection:text-neutral-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
