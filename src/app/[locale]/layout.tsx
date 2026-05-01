import type { Metadata } from "next";
import { Audiowide, Oxanium, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { DeferredBackground } from "@/components/background/DeferredBackground";
import { MountedProvider } from "@/components/background/MountedContext";
import { NavBar } from "@/components/nav/NavBar";
import { Footer } from "@/components/footer/Footer";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    metadataBase: new URL(process.env.SITE_URL!),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      images: [{ url: "/og.png", width: 2400, height: 1260, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
  };
}

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${audiowide.variable} ${oxanium.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <MountedProvider>
            <DeferredBackground />
            <NavBar />
            {children}
            <Footer />
          </MountedProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
