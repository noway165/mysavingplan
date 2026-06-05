import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { MainLayout } from "@/components/MainLayout";
import { SettingsProvider } from "@/context/SettingsContext";

const jetbrains = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-jetbrains" });
const spaceMono = Space_Mono({ subsets: ["latin", "vietnamese"], weight: ["400", "700"], variable: "--font-spacemono" });

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
      <body className={`${jetbrains.variable} ${spaceMono.variable} font-sans bg-background text-foreground`}>
        <AuthProvider>
          <SettingsProvider>
            <MainLayout>{children}</MainLayout>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
