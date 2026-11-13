import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: `${SITE_URL}/`, en: `${SITE_URL}/en` };
  return [
    { url: `${SITE_URL}/`, alternates: { languages } },
    { url: `${SITE_URL}/en`, alternates: { languages } },
  ];
}
