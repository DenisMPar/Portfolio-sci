import type { Metadata } from "next";
import { Audiowide, Electrolize, Geist_Mono } from "next/font/google";
import { BackgroundClient } from "@/components/background/BackgroundClient";
import { BackgroundReadyProvider } from "@/components/background/BackgroundReadyContext";
import { GlobalLoader } from "@/components/GlobalLoader";
import { NavBar } from "@/components/nav/NavBar";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const audiowide = Audiowide({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const electrolize = Electrolize({
  variable: "--font-body",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://example.com"),
  title: "Denis — Frontend Engineer",
  description:
    "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
  openGraph: {
    title: "Denis — Frontend Engineer",
    description:
      "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Denis — Frontend Engineer",
    description:
      "Portfolio of Denis, a frontend engineer specializing in React, Next.js, and TypeScript.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${audiowide.variable} ${electrolize.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundReadyProvider>
          <GlobalLoader />
          <BackgroundClient />
          <NavBar />
          {children}
          <Footer />
        </BackgroundReadyProvider>
      </body>
    </html>
  );
}
