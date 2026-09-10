import { destFrame, districtSurfaces } from "@/lib/destinations";
import { DISTRICT_BY_ID } from "@/lib/grid";

const DISTRICT_STILL: Record<string, string> = {
  mission: "/media/stills/live/host-agentropolis.jpg",
  hermes: "/media/stills/live/hermes-pages.jpg",
  dock: "/media/stills/live/hermes-community.jpg",
  buzz: "/media/stills/live/hermes-social.jpg",
  construct: "/media/stills/live/botbae-pages.jpg",
  parallax: "/media/stills/live/parallax-pages.jpg",
  atg: "/media/stills/live/atg-pages.jpg",
  street: "/media/stills/street-bridge.jpg",
  utility: "/media/stills/origin-ios.jpg",
  atv: "/media/stills/live/creator-pages.jpg",
  jspace: "/media/stills/jspace-pad.jpg",
  atlas: "/media/stills/live/aquaduct-pages.jpg",
  holofoil: "/media/stills/octane/foil-plaza.jpg",
  fm: "/media/stills/live/host-wiredchaos.jpg",
};

export function stillForDistrict(districtId: string): string {
  const pinned = DISTRICT_STILL[districtId];
  if (pinned) return pinned;
  const live = districtSurfaces(districtId).find((d) => d.status === "LIVE" && destFrame(d));
  if (live) return destFrame(live) ?? "/media/stills/octane/hero.jpg";
  const d = DISTRICT_BY_ID[districtId];
  return d?.poster ?? "/media/stills/octane/hero.jpg";
}
