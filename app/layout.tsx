// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
// import PageTransition from "@/components/page-transition";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { CookieConsent } from "@/components/core/CookieConsent";

// --- METADATA & VIEWPORT ---
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  // SEO
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Social Sharing
  openGraph: {
    url: siteConfig.url,
    type: "website",
    title: {
      default: `${siteConfig.name} - ${siteConfig.title}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Promotional image for ${siteConfig.name}`,
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: {
      default: `${siteConfig.name} - ${siteConfig.title}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },

  // Icons & Manifest
  icons: {
    icon: "/brainy-app-icon.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7C79FF" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
  colorScheme: "dark light",
};

// --- ROOT LAYOUT COMPONENT ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data for enhanced SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
            }),
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background overflow-x-hidden font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* Top-loading progress bar for instant navigation feedback */}
            <NextTopLoader color="#7C79FF" height={3} showSpinner={false} />

            {/* Smooth page transitions */}
            <div>{children}</div>
            <CookieConsent />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
