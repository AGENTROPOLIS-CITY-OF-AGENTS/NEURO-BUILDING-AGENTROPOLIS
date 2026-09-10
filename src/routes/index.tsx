import { createFileRoute } from "@tanstack/react-router";
import { CityOS } from "@/components/city-os";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CityOS />;
}