import type { ReactNode } from "react";
import "../globals.css";
import { Shell } from "@/components/Shell";
import { es } from "@/content/es";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(es);
export { viewport } from "@/lib/metadata";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Shell lang="es">{children}</Shell>;
}
