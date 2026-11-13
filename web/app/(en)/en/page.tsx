import { cacheLife } from "next/cache";
import { Site } from "@/components/Site";
import { en } from "@/content/en";

export default async function Page() {
  "use cache";
  cacheLife("max"); // Contenido estático: solo cambia con un nuevo despliegue.
  return <Site c={en} />;
}
