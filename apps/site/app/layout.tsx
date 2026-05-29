import type { Metadata } from "next";
import { IBM_Plex_Mono, Geist } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const TITLE = "Lucide Motion — Animated React icons for every Lucide icon";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: TITLE,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "aashuu" }],
  creator: "aashuu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: TITLE,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: "en_US",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — animated React icons`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", plexMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen">
        <RootProvider theme={{ disableTransitionOnChange: true }}>
          <SiteNav />
          {children}
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
