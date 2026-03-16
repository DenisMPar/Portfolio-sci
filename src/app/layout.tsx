import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackgroundClient } from "@/components/background/BackgroundClient";
import { NavBar } from "@/components/nav/NavBar";
import { Footer } from "@/components/footer/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Denis — Full-Stack Developer",
  description: "Portfolio of Denis, a full-stack developer specializing in React, Next.js, and Node.js.",
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
      >
        <BackgroundClient />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
