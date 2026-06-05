import type { Metadata, Viewport } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { MainLayout } from "@/components/MainLayout";
import { SettingsProvider } from "@/context/SettingsContext";

const vt323 = VT323({ subsets: ["latin", "vietnamese"], weight: ["400"], variable: "--font-vt323" });

export const metadata: Metadata = {
  title: "MySavingsPlan",
  description: "Quản lý tài chính cá nhân thông minh",
};

export const viewport: Viewport = {
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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${vt323.variable} font-sans bg-background text-foreground`}>
        <AuthProvider>
          <SettingsProvider>
            <MainLayout>{children}</MainLayout>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
