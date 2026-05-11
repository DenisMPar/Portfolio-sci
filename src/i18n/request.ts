import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }
  const messageLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
    en: () => import("../../messages/en.json"),
    es: () => import("../../messages/es.json"),
  };
  const loader = messageLoaders[locale] ?? messageLoaders[routing.defaultLocale];
  return {
    locale,
    messages: (await loader()).default,
  };
});
