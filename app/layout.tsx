import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });


const baseUrl = process.env.NEXT_PUBLIC_APP_URL 

export const metadata: Metadata = {
  title: "SchedulePro - Advanced Scheduling Platform",
  description: "Transform your business with smart scheduling. Streamline appointments, manage clients, and grow your business with our powerful scheduling software.",
  keywords: "scheduling software, appointment booking, business management, calendar sync, client management, staff scheduling, online booking",
  authors: [{ name: "SchedulePro Team" }],
  creator: "SchedulePro",
  publisher: "SchedulePro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SchedulePro - Advanced Scheduling Platform",
    description: "Transform your business with smart scheduling. Streamline appointments, manage clients, and grow your business.",
    url: baseUrl,
    siteName: 'SchedulePro',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'SchedulePro - Advanced Scheduling Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SchedulePro - Advanced Scheduling Platform",
    description: "Transform your business with smart scheduling. Streamline appointments, manage clients, and grow your business.",
    images: ['/placeholder-logo.png'],
    creator: '@schedulepro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/favicon_io/favicon.ico',
      },
    ],
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon_io/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon_io/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon_io/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon_io/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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