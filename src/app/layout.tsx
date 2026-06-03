import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { MainLayout } from "@/components/MainLayout";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "MySavingsPlan",
  description: "Quản lý tài chính cá nhân thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          <SettingsProvider>
            <MainLayout>{children}</MainLayout>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
