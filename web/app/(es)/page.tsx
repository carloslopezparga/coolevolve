import { Site } from "@/components/Site";
import { es } from "@/content/es";

export default async function Page() {
  "use cache";
  return <Site c={es} />;
}
