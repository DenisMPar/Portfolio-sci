import type { MetadataRoute } from "next";

const BASE_URL = process.env.SITE_URL!;
const locales = ["en", "es"];
const routes = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/skills", priority: 0.8, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
  );
}
