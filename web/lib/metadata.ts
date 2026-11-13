import type { Metadata, Viewport } from "next";
import type { Content } from "@/content/types";
import { SITE_URL } from "./site";

export function buildMetadata(c: Content): Metadata {
  const path = c.locale === "es" ? "/" : "/en";
  return {
    metadataBase: new URL(SITE_URL),
    title: c.meta.title,
    description: c.meta.description,
    alternates: {
      canonical: path,
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: "CoolEvolve",
      title: c.meta.title,
      description: c.meta.description,
      locale: c.locale === "es" ? "es_ES" : "en_US",
      alternateLocale: c.locale === "es" ? ["en_US"] : ["es_ES"],
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
    },
    authors: [{ name: c.author.name, url: c.author.links[0]?.href }],
  };
}

export const viewport: Viewport = {
  themeColor: "#070B12",
  colorScheme: "dark",
};
