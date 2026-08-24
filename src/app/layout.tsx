import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { profile, siteUrl } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const title = "Ravinder Varkali | Senior Staff / Principal Software Engineer";
const description =
  "Personal engineering portfolio focused on distributed systems, cloud platforms, platform engineering, applied AI, observability, reliability, security, and technical leadership.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Ravinder Varkali Engineering Portfolio",
    type: "profile",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Abstract distributed systems architecture visual"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role,
    sameAs: [profile.github, profile.linkedin],
    knowsAbout: [
      "Distributed Systems",
      "Cloud Platforms",
      "Platform Engineering",
      "Applied AI",
      "Observability",
      "Reliability Engineering",
      "Security",
      "Technical Leadership"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-ink-950 font-sans text-slate-100 antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
