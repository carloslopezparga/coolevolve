import { es } from "@/content/es";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = es.meta.ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(es);
}
