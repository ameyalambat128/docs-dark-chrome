import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://darkdocs.ameyalambat.com";
const socialImageUrl = `${siteUrl}/og.png?v=2`;
const screenshotUrl = `${siteUrl}/hero-alt.png`;
const today = new Date().toISOString().split("T")[0];

export const metadata: Metadata = {
  title: {
    default: "Dark Docs 2.0 | Dark Theme for Google Docs",
    template: "%s | Dark Docs 2.0",
  },
  description:
    "Dark Docs 2.0 is a browser extension that brings a high-contrast dark theme to Google Docs for more comfortable writing and reading in Chrome, Firefox, Edge, and Opera.",
  keywords: [
    "Google Docs dark theme",
    "dark mode extension",
    "Google Docs extension",
    "dark theme Chrome extension",
    "productivity tools",
    "eye strain reduction",
    "dark mode Google Docs",
    "writing tools",
    "browser extension",
    "Google Workspace dark mode",
    "document editor dark theme",
    "free Chrome extension",
    "Google Docs night mode",
    "dark UI extension",
  ],
  authors: [{ name: "Ameya Lambat", url: "https://ameyalambat.com" }],
  creator: "Ameya Lambat",
  publisher: "Dark Docs 2.0",
  category: "Browser Extension",
  classification: "Productivity Tool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Dark Docs 2.0 | Dark Theme for Google Docs",
    description:
      "Dark Docs 2.0 brings a polished dark theme to Google Docs with stronger contrast and a more comfortable reading experience.",
    url: siteUrl,
    siteName: "Dark Docs 2.0",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Dark Docs 2.0 preview showing Google Docs in dark mode",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ameyalambat",
    creator: "@ameyalambat",
    title: "Dark Docs 2.0 | Dark Theme for Google Docs",
    description:
      "Dark Docs 2.0 adds a polished dark theme to Google Docs for easier reading, better contrast, and a more comfortable writing setup.",
    images: [socialImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Dark Docs 2.0",
  description:
    "Dark Docs 2.0 is a browser extension that adds a high-contrast dark theme to Google Docs for a more comfortable writing and reading experience.",
  url: siteUrl,
  applicationCategory: "BrowserExtension",
  operatingSystem: "Chrome, Firefox, Edge, Opera",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Person",
    name: "Ameya Lambat",
    url: "https://ameyalambat.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Dark Docs 2.0",
    url: siteUrl,
  },
  datePublished: "2024-01-01",
  dateModified: today,
  keywords:
    "Google Docs dark theme, dark mode extension, productivity tools, eye strain reduction",
  screenshot: screenshotUrl,
  downloadUrl:
    "https://chromewebstore.google.com/detail/docs-dark-20/djmmkojigpkdagglmjjdjiddopgdchcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Add JSON-LD to your page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
