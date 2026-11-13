import { cacheLife } from "next/cache";
import { Site } from "@/components/Site";
import { es } from "@/content/es";

export default async function Page() {
  "use cache";
  cacheLife("max"); // Contenido estático: solo cambia con un nuevo despliegue.
  return <Site c={es} />;
}
