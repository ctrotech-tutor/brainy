import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"; // We will create this next
import "./globals.css";

export const metadata: Metadata = {
  // Setting a base URL for consistent social sharing links
  metadataBase: new URL("https://brainy-quiz-app.com" ), // Replace with your actual domain
  title: {
    default: "Brainy - Master Your Courses with Smart Quizzes",
    template: "%s | Brainy",
  },
  description:
    "Brainy transforms university learning through intelligent assessments, real-time analytics, and personalized feedback.",
  openGraph: {
    title: "Brainy - Master Your Courses with Smart Quizzes",
    description:
      "The ultimate quiz platform for students and tutors who demand excellence.",
    url: "https://brainy-quiz-app.com", // Replace with your actual domain
    siteName: "Brainy",
    images: [
      {
        url: "/og-image.png", // An attractive image for social sharing
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brainy - Master Your Courses with Smart Quizzes",
    description:
      "The ultimate quiz platform for students and tutors who demand excellence.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light )", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
