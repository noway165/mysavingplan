import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { MainLayout } from "@/components/MainLayout";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: "--font-playfair" });

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
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground`}>
        <AuthProvider>
          <SettingsProvider>
            <MainLayout>{children}</MainLayout>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
