import type { Metadata } from "next";
import { Audiowide, Oxanium, Geist_Mono } from "next/font/google";
import { DeferredBackground } from "@/components/background/DeferredBackground";
import { BackgroundReadyProvider } from "@/components/background/BackgroundReadyContext";
import { NavBar } from "@/components/nav/NavBar";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const audiowide = Audiowide({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL!),
  title: "Denis — Frontend Engineer",
  description:
    "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
  openGraph: {
    title: "Denis — Frontend Engineer",
    description:
      "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.png", width: 2400, height: 1260, alt: "Denis — Frontend Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Denis — Frontend Engineer",
    description:
      "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Denis Parada",
  jobTitle: "Frontend Engineer",
  url: process.env.SITE_URL!,
  image: `${process.env.SITE_URL!}/og.png`,
  sameAs: [
    "https://github.com/DenisMPar",
    "https://www.linkedin.com/in/denismpar",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Tailwind CSS",
    "Clean Architecture",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${audiowide.variable} ${oxanium.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BackgroundReadyProvider>
          <DeferredBackground />
          <NavBar />
          {children}
          <Footer />
        </BackgroundReadyProvider>
      </body>
    </html>
  );
}
