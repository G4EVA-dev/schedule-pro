import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SchedulePro - Advanced Scheduling Platform",
  description: "Transform your business with smart scheduling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ConvexClientProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="schedulepro-theme">
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}