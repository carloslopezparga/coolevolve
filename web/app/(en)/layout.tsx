import type { ReactNode } from "react";
import "../globals.css";
import { Shell } from "@/components/Shell";
import { en } from "@/content/en";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(en);
export { viewport } from "@/lib/metadata";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Shell lang="en">{children}</Shell>;
}
