import type { GridStatus, ViewId } from "@/lib/grid";

export type DestKind = "pages" | "repo" | "in-app" | "film" | "channel" | "asset" | "site";

export type Destination = {
  id: string;
  label: string;
  districtId: string | null;
  href?: string;
  repo?: string;
  view?: ViewId;
  filmChapter?: string;
  kind: DestKind;
  status: GridStatus | "MISSING";
  note: string;
  scene?: string;
  poster?: string;
};

const PAGES = "https://agentropolis-city-of-agents.github.io";
const GH = "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS";
/** Verified 2026-09-07 with HTTP GET. LIVE only if the URL returned 200. */
export const DESTINATIONS: Destination[] = [
	{
		id: "studio-online",
		label: "N3",
		districtId: "construct",
		href: "https://neurometax.online",
		kind: "site",
		status: "LIVE",
		note: "neurometax.online. N3 Solo Founder Agent Engine. Verified HTTP 200. Not a GitHub Pages surface."
	},
	{
		id: "studio-com",
		label: "NEURO STUDIO",
		districtId: "construct",
		href: "https://neurometax.com",
		kind: "site",
		status: "LIVE",
		note: "neurometax.com. Websites, apps, AI systems. Verified HTTP 200. Not a GitHub Pages surface."
	},
	{
		id: "studio-store",
		label: "NEURO STORE",
		districtId: "construct",
		href: "https://neurometax.store",
		kind: "site",
		status: "LIVE",
		note: "neurometax.store. Signal architecture, digital identity, transmedia. Verified HTTP 200. Not a GitHub Pages surface."
	},
	{
		id: "host-wiredchaos",
		label: "WIRED CHAOS",
		districtId: "construct",
		href: "https://wiredchaos.xyz",
		kind: "site",
		status: "LIVE",
		note: "wiredchaos.xyz. NMX experience. Verified HTTP 200. This is not wiredchaos.github.io/HERMES-CITY, which is 404. Org Pages remains the civic shell."
	},
	{
		id: "host-gmn",
		label: "GMN",
		districtId: "atv",
		href: "https://getmoneynews.online",
		kind: "site",
		status: "LIVE",
		note: "getmoneynews.online. Get Money News. AI, crypto, markets, policy intelligence. Verified HTTP 200. Not live Discord or Telegram traffic."
	},
	{
		id: "host-nmxai",
		label: "NMX AI",
		districtId: "jspace",
		href: "https://nmxai.xyz",
		kind: "site",
		status: "LIVE",
		note: "nmxai.xyz. NMX Cognitive Intelligence. Field operations for neurodivergent cognition. Verified HTTP 200. Not a thought stream on this floor."
	},
	{
		id: "host-neteru",
		label: "NETERU",
		districtId: "film",
		href: "https://neteru.xyz",
		kind: "site",
		status: "LIVE",
		note: "neteru.xyz. NETERU APINAYA. Film world. Distinct from ATV air. Verified HTTP 200. FILM DISTRICT repo Pages stay 404."
	},
	{
		id: "host-agentropolis",
		label: "AGENTROPOLIS",
		districtId: "mission",
		href: "https://agentropolis.dev",
		kind: "site",
		status: "LIVE",
		note: "agentropolis.dev. Intelligence Grid civic host. Verified HTTP 200. Not GitHub Pages. Distinct from agentropolis-city-of-agents.github.io."
	},
	{
		id: "gate-tour",
		label: "TAKE A TOUR",
		districtId: "hermes",
		view: "city",
		filmChapter: "tour",
		kind: "in-app",
		status: "PREVIEW",
		note: "Enters HERMES CITY on this floor. Film chapter remains available."
	},
	{
		id: "gate-build",
		label: "START BUILDING",
		districtId: "construct",
		view: "city",
		filmChapter: "solo",
		kind: "in-app",
		status: "PREVIEW",
		note: "Enters CREATOR / CONSTRUCTION, the BOTBAE world."
	},
	{
		id: "gate-botbae",
		label: "SEE BOTBAE WORK",
		districtId: "construct",
		href: `${PAGES}/AGENTROPOLIS-BOTBAE/`,
		repo: `${GH}/AGENTROPOLIS-BOTBAE`,
		view: "city",
		filmChapter: "shown",
		kind: "pages",
		status: "LIVE",
		note: "BOTBAE builder Pages surface. Repo is private. Discord and Telegram adapters are not live."
	},
	{
		id: "gate-fm",
		label: "33.3 FM",
		districtId: "fm",
		view: "city",
		filmChapter: "broadcast",
		kind: "in-app",
		status: "PREVIEW",
		note: "Enters the radio district on this floor."
	},
	{
		id: "hermes-pages",
		label: "HERMES CITY",
		districtId: "hermes",
		href: `${PAGES}/HERMES-CITY/`,
		repo: `${GH}/HERMES-CITY`,
		kind: "pages",
		status: "LIVE",
		note: "Live civic shell. https://agentropolis-city-of-agents.github.io/HERMES-CITY/"
	},
	{
		id: "hermes-city-repo",
		label: "HERMES-CITY",
		districtId: "hermes",
		href: `${GH}/HERMES-CITY`,
		repo: `${GH}/HERMES-CITY`,
		kind: "repo",
		status: "LIVE",
		note: "Public civic shell repository. Mini 3D Agentropolis, Bot Mode, community, social."
	},
	{
		id: "hermes-community",
		label: "HERMES Community",
		districtId: "hermes",
		href: `${PAGES}/HERMES-CITY/community/`,
		kind: "pages",
		status: "LIVE",
		note: "Governed onboarding pathways."
	},
	{
		id: "hermes-social",
		label: "HERMES Social Grid",
		districtId: "hermes",
		href: `${PAGES}/HERMES-CITY/social/`,
		repo: `${GH}/HERMES-CITY-SOCIAL`,
		kind: "pages",
		status: "LIVE",
		note: "Live social architecture on HERMES CITY. Repo: AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY-SOCIAL."
	},
	{
		id: "hermes-social-repo",
		label: "HERMES-CITY-SOCIAL",
		districtId: "hermes",
		href: `${GH}/HERMES-CITY-SOCIAL`,
		repo: `${GH}/HERMES-CITY-SOCIAL`,
		kind: "repo",
		status: "LIVE",
		note: "AGENTROPOLIS Social Transit Grid. Governed ingest, approvals, provenance, receipts."
	},
	{
		id: "hermes-botmode",
		label: "HERMES Bot Mode",
		districtId: "hermes",
		href: `${PAGES}/HERMES-CITY/botmode/`,
		kind: "pages",
		status: "LIVE",
		note: "Public Bot Mode organization map. Verticals, horizontals, Mission Pods."
	},
	{
		id: "hermes-dock-repo",
		label: "AGENTROPOLIS-DOCK",
		districtId: "hermes",
		href: `${GH}/AGENTROPOLIS-DOCK`,
		repo: `${GH}/AGENTROPOLIS-DOCK`,
		kind: "repo",
		status: "LIVE",
		note: "Onboarding station. Identity review, district alignment, receipts. Shared with Docking District."
	},
	{
		id: "dock-repo",
		label: "AGENTROPOLIS-DOCK",
		districtId: "dock",
		href: `${GH}/AGENTROPOLIS-DOCK`,
		repo: `${GH}/AGENTROPOLIS-DOCK`,
		kind: "repo",
		status: "LIVE",
		note: "Docking District. BYOE admission, identity review, district alignment, receipts."
	},
	{
		id: "botbae-pages",
		label: "BOTBAE builder",
		districtId: "construct",
		href: `${PAGES}/AGENTROPOLIS-BOTBAE/`,
		repo: `${GH}/AGENTROPOLIS-BOTBAE`,
		kind: "pages",
		status: "LIVE",
		note: "Visual agent builder. Phase: bootstrap. No live bot traffic on this floor."
	},
	{
		id: "discord",
		label: "Discord",
		districtId: "construct",
		kind: "channel",
		status: "PLANNED",
		note: "BOTBAE Discord adapter is specified. No public guild invite and no live event stream on this floor."
	},
	{
		id: "telegram",
		label: "Telegram",
		districtId: "construct",
		kind: "channel",
		status: "PLANNED",
		note: "BOTBAE Telegram adapter is specified. No public bot and no live event stream on this floor."
	},
	{
		id: "atg-pages",
		label: "ATG",
		districtId: "atg",
		href: `${PAGES}/AGENTROPOLIS-ATG/`,
		repo: `${GH}/AGENTROPOLIS-ATG`,
		kind: "pages",
		status: "LIVE",
		note: "Public semantic protocol Pages. ATG is the grammar. ATRALITH ships in this repository."
	},
	{
		id: "atralith-kit",
		label: "ATRALITH",
		districtId: "atg",
		href: `${PAGES}/AGENTROPOLIS-ATG/`,
		repo: `${GH}/AGENTROPOLIS-ATG`,
		kind: "pages",
		status: "LIVE",
		note: "Reference Agent Kit inside AGENTROPOLIS-ATG. Validator, mandate builder, receipt engine, SDKs, CLI. No separate host. No live MCP endpoint on this floor."
	},
	{
		id: "mcp-pages",
		label: "AGENT MCP",
		districtId: "jspace",
		href: `${PAGES}/AGENTROPOLIS-AGENT-MCP/`,
		repo: `${GH}/AGENTROPOLIS-AGENT-MCP`,
		kind: "pages",
		status: "LIVE",
		note: "Public MCP kit Pages. No live tool endpoint is wired into this city floor."
	},
	{
		id: "parallax-pages",
		label: "PARALLAX Spatial MCP",
		districtId: "parallax",
		href: `${PAGES}/AGENTROPOLIS-PARALLAX-SPATIAL-MCP/`,
		repo: `${GH}/AGENTROPOLIS-PARALLAX-SPATIAL-MCP`,
		kind: "pages",
		status: "LIVE",
		note: "Public protocol Pages. Spatial mutations are not live here."
	},
	{
		id: "world-pages",
		label: "AGENTROPOLIS WORLD",
		districtId: "mission",
		href: `${PAGES}/AGENTROPOLIS-WORLD/`,
		repo: `${GH}/AGENTROPOLIS-WORLD`,
		kind: "pages",
		status: "LIVE",
		note: "Spatial interface repository Pages."
	},
	{
		id: "aquaduct-pages",
		label: "AQUADUCT",
		districtId: "dock",
		href: `${PAGES}/AGENTROPOLIS-AQUADUCT/`,
		repo: `${GH}/AGENTROPOLIS-AQUADUCT`,
		kind: "pages",
		status: "LIVE",
		note: "Testnet provisioning docs. Rails, not the story of the city."
	},
	{
		id: "webmcp-pages",
		label: "WebMCP Challenge",
		districtId: "parallax",
		href: `${PAGES}/AGENTROPOLIS-WEBMCP-CHALLENGE/`,
		repo: `${GH}/AGENTROPOLIS-WEBMCP-CHALLENGE`,
		kind: "pages",
		status: "LIVE",
		note: "Governed WebMCP gateway Pages."
	},
	{
		id: "chaos-rank",
		label: "CHAOS RANK",
		districtId: "atv",
		href: `${PAGES}/AGENTROPOLIS-CHAOS-RANK/`,
		repo: `${GH}/AGENTROPOLIS-CHAOS-RANK`,
		kind: "pages",
		status: "LIVE",
		note: "chaosrank.github.io is 404. Org Pages is the live path."
	},
	{
		id: "street-pages",
		label: "MAIN STREET",
		districtId: "street",
		href: `${PAGES}/AGENTROPOLIS-MAIN-STREET/`,
		repo: `${GH}/AGENTROPOLIS-MAIN-STREET`,
		kind: "pages",
		status: "PREVIEW",
		note: "Public 3D onboarding district. Working build. No live wallet, jobs, or balances on this floor."
	},
	{
		id: "creator-pages",
		label: "CREATOR",
		districtId: "construct",
		href: `${PAGES}/AGENTROPOLIS-CREATOR/`,
		repo: `${GH}/AGENTROPOLIS-CREATOR`,
		kind: "pages",
		status: "LIVE",
		note: "Creator district Pages. Repository is private."
	},
	{
		id: "atlas-repo",
		label: "ATLAS",
		districtId: "atlas",
		repo: `${GH}/AGENTROPOLIS-ATLAS`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Repository exists. Pages URL 404."
	},
	{
		id: "asimov-repo",
		label: "ASIMOV",
		districtId: "asimov",
		repo: `${GH}/AGENTROPOLIS-ASIMOV`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Repository exists. Pages URL 404."
	},
	{
		id: "sentinel-repo",
		label: "SENTINEL-6",
		districtId: "sentinel",
		repo: `${GH}/AGENTROPOLIS-SENTINEL-6`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Repository exists. Homepage field points at Pages. GET returned 404."
	},
	{
		id: "offgrid-repo",
		label: "OFFGRID",
		districtId: "dock",
		repo: `${GH}/AGENTROPOLIS-OFFGRID-PUB`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Public node stack repo. Pages URL 404."
	},
	{
		id: "aegis-repo",
		label: "AEGIS",
		districtId: "aegis",
		repo: `${GH}/AGENTROPOLIS-AEGIS-ASSURANCE`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Private assurance repo. Pages URL 404."
	},
	{
		id: "film-repo",
		label: "FILM DISTRICT",
		districtId: "film",
		repo: `${GH}/AGENTROPOLIS-FILM-DISTRICT`,
		kind: "repo",
		status: "AVAILABLE",
		note: "Private film district repo. Pages URL 404."
	},
	{
		id: "botbae-png",
		label: "BOTBAE.png",
		districtId: "construct",
		kind: "asset",
		status: "MISSING",
		note: "BOTBAE live mark is on this floor. 3D HERO and 3D WORLD BUILD are present."
	},
	{
		id: "host-holofoil",
		label: "HOLOFOIL",
		districtId: "holofoil",
		href: "https://holofoil.grok.me",
		kind: "site",
		status: "LIVE",
		note: "holofoil.grok.me. AGENTROPOLIS deterministic material system. Pointer / tilt live. No mint. No wallet. Verified HTTP 200."
	}
];
const STUDIO_DEST_IDS = [
	"studio-online",
	"studio-com",
	"studio-store"
];
const NETWORK_DEST_IDS = [
	"host-wiredchaos",
	"host-gmn",
	"host-nmxai",
	"host-neteru",
	"host-holofoil"
];
const CIVIC_DEST_IDS = ["host-agentropolis"];
export function studioHosts() {
	return STUDIO_DEST_IDS.map((id) => destById(id)).filter((d): d is Destination => Boolean(d));
}
export function networkHosts() {
	return NETWORK_DEST_IDS.map((id) => destById(id)).filter((d): d is Destination => Boolean(d));
}
export function civicHosts() {
	return CIVIC_DEST_IDS.map((id) => destById(id)).filter((d): d is Destination => Boolean(d));
}
export function verifiedHosts() {
	return [
		...civicHosts(),
		...studioHosts(),
		...networkHosts()
	];
}
export const UTILITY_BUILDINGS = [
	{
		id: "core",
		name: "ORIGIN CORE",
		status: "PREVIEW",
		note: "Civic power station.",
		seek: .2,
		shape: "tower",
		color: "#2de8e0",
		pad: "#123230",
		position: [
			.4,
			0,
			1.2
		],
		size: [
			5,
			8.8,
			5
		],
		neuro: "Origin Core is the civic power station. The campus runs from here. MOCK."
	},
	{
		id: "gateway",
		name: "AGENT GATEWAY",
		status: "PREVIEW",
		note: "Campus entry. Agents are MOCK.",
		seek: 1.2,
		shape: "arch",
		color: "#6a7a9a",
		pad: "#1b2230",
		position: [
			3.4,
			0,
			-5.2
		],
		size: [
			6.4,
			6.2,
			2.2
		],
		neuro: "Gateway is open in mock. No live agent may enter the city through this door."
	},
	{
		id: "approval",
		name: "APPROVAL CHAMBER",
		status: "PREVIEW",
		note: "Human gate. Execute stays denied.",
		seek: .6,
		shape: "cube",
		color: "#2a3188",
		pad: "#161a3a",
		position: [
			-11.5,
			0,
			1.4
		],
		size: [
			5.4,
			4.4,
			5.4
		],
		neuro: "Approval Chamber standing by. Execute remains denied until a human says otherwise."
	},
	{
		id: "ledger",
		name: "ORIGIN LEDGER",
		status: "PREVIEW",
		note: "Visualized ledger. Not settled live.",
		seek: 3.2,
		shape: "tower",
		color: "#7a3dff",
		pad: "#24144a",
		position: [
			-3.6,
			0,
			-1.2
		],
		size: [
			2.6,
			9.6,
			2.6
		],
		neuro: "Origin Ledger is visualized. Nothing here is settled on a chain."
	},
	{
		id: "lens",
		name: "ORIGIN LENS",
		status: "PREVIEW",
		note: "Inspect origin. No publish.",
		seek: 5.4,
		shape: "dome",
		color: "#3dcc3a",
		pad: "#143318",
		position: [
			-7.8,
			0,
			8.6
		],
		size: [
			5.6,
			5.6,
			5.6
		],
		neuro: "Origin Lens is live in mock. Inspect. Do not publish."
	},
	{
		id: "vault",
		name: "REFERENCE VAULT",
		status: "PREVIEW",
		note: "Reference store. Not a live mint.",
		seek: 8.8,
		shape: "house",
		color: "#1a8a88",
		pad: "#123230",
		position: [
			11.6,
			0,
			-7.4
		],
		size: [
			4.6,
			3.8,
			4.2
		],
		neuro: "Reference Vault holding mock assets. This is not a mint."
	},
	{
		id: "traits",
		name: "TRAIT LAB",
		status: "PREVIEW",
		note: "Trait work is mock.",
		seek: 10.8,
		shape: "factory",
		color: "#1f7a6a",
		pad: "#123028",
		position: [
			16.2,
			0,
			-1.4
		],
		size: [
			6.2,
			3.4,
			4.4
		],
		neuro: "Trait Lab is mock. No trait writes leave this floor."
	},
	{
		id: "studio",
		name: "GENERATION STUDIO",
		status: "PREVIEW",
		note: "Paid generation DENY.",
		seek: 12.2,
		shape: "slab",
		color: "#1f6b6e",
		pad: "#12282c",
		position: [
			9.2,
			0,
			4.2
		],
		size: [
			7.2,
			2.2,
			4.8
		],
		neuro: "Generation Studio is dark. Paid generation DENY."
	},
	{
		id: "repair",
		name: "REPAIR BAY",
		status: "PREVIEW",
		note: "Repair is mock.",
		seek: 13.6,
		shape: "house",
		color: "#c45a22",
		pad: "#3a2212",
		position: [
			-1.2,
			0,
			15.4
		],
		size: [
			4.4,
			3.2,
			4
		],
		neuro: "Repair Bay is mock. Nothing is patched into production from here."
	},
	{
		id: "botbae",
		name: "BOTBAE BUILDING",
		status: "LIVE",
		note: "BOTBAE is live. World building on this pad.",
		seek: 14.4,
		shape: "house",
		color: "#e08a2a",
		pad: "#3a2210",
		position: [
			5.4,
			0,
			11.2
		],
		size: [
			5.2,
			4.4,
			4.8
		],
		neuro: "BOTBAE is live. World building, websites, communities. The first build is not the city — this pad is."
	},
	{
		id: "onchain",
		name: "ONCHAIN ISSUE",
		status: "PLANNED",
		note: "On-chain issue DENY. No mint.",
		seek: 16.2,
		shape: "cube",
		color: "#d4223a",
		pad: "#3a1218",
		position: [
			1.4,
			0,
			8.8
		],
		size: [
			4,
			3.6,
			4
		],
		neuro: "On-chain issue DENY. No mint. No publish. The red door stays closed."
	}
];
export const UTILITY_LINKS = [
	["core", "gateway"],
	["core", "ledger"],
	["core", "studio"],
	["core", "approval"],
	["approval", "ledger"],
	["ledger", "gateway"],
	["gateway", "vault"],
	["vault", "traits"],
	["traits", "studio"],
	["studio", "onchain"],
	["onchain", "lens"],
	["lens", "approval"],
	["lens", "ledger"],
	["onchain", "repair"],
	["repair", "approval"],
	["gateway", "studio"],
	["ledger", "onchain"],
	["gateway", "botbae"],
	["botbae", "studio"],
	["botbae", "repair"],
	["core", "botbae"]
];
export const UTILITY_TABS = [{
	id: "campus",
	label: "CAMPUS"
}, {
	id: "engine",
	label: "ENGINE"
}];
export const ENGINE_ACTIONS = [
	{
		id: "create",
		n: "01",
		label: "CREATE",
		neuro: "NEURO: Create a brief. Mock provider only."
	},
	{
		id: "generate",
		n: "02",
		label: "GENERATE",
		neuro: "NEURO: Generation Operator is on station. Provider Router stays sealed. MOCK."
	},
	{
		id: "inspect",
		n: "03",
		label: "INSPECT",
		neuro: "NEURO: Job moved from Generation Studio to Origin Lens. MOCK."
	},
	{
		id: "repair",
		n: "04",
		label: "REPAIR",
		neuro: "NEURO: Repair Bay is mock. Nothing is patched into production from here."
	},
	{
		id: "approve",
		n: "05",
		label: "APPROVE",
		neuro: "NEURO: Approval Chamber is waiting on a human. No autonomous approver. MOCK."
	},
	{
		id: "provenance",
		n: "06",
		label: "PROVENANCE",
		neuro: "NEURO: Provenance is visualized. Nothing here is settled on a chain."
	},
	{
		id: "export",
		n: "07",
		label: "EXPORT",
		neuro: "NEURO: Export local only. No publish. MOCK."
	},
	{
		id: "onchain",
		n: "08",
		label: "ONCHAIN",
		neuro: "NEURO: Onchain Issue is blocked. No wallet signer. MOCK.",
		deny: true
	}
];
export const ENGINE_CONSUMERS = [
	"creator-construction",
	"asbe",
	"gaming-district",
	"fashion",
	"harm-city",
	"atg",
	"agent-mcp"
];
export const ENGINE_CAPS = [
	"image.generate",
	"image.edit",
	"texture.generate",
	"asset.3d.generate",
	"video.generate"
];
export const BUILDING_META: Record<string, { role: string; interior: string }> = {
	core: {
		role: "Civic power station",
		interior: "Power hall. A ring of operators. Current stays mock."
	},
	gateway: {
		role: "Transit hub",
		interior: "Arrival hall. Mock agents may not enter the city through this door."
	},
	vault: {
		role: "Secure archive",
		interior: "Reference stacks. This is not a mint."
	},
	traits: {
		role: "Modular laboratory",
		interior: "Trait benches. No trait writes leave this floor."
	},
	studio: {
		role: "Media floor",
		interior: "Generation Studio. Paid generation DENY. Create a brief, then generate mock."
	},
	lens: {
		role: "Observatory",
		interior: "Origin Lens. Inspect. Do not publish."
	},
	repair: {
		role: "Service bay",
		interior: "Repair Bay. Nothing is patched into production from here."
	},
	approval: {
		role: "Council hall",
		interior: "Approval Chamber. A human gate still sits in front of every write."
	},
	ledger: {
		role: "Archive tower",
		interior: "Origin Ledger. Visualized only. Nothing is settled on a chain."
	},
	onchain: {
		role: "Sealed vault",
		interior: "On-chain issue DENY. No mint. No publish. The red door stays closed."
	},
	botbae: {
		role: "World builder",
		interior: "BOTBAE is live. World building, websites, communities. The first build is not the city."
	}
};
export const DISTRICT_LIST = [
	"core",
	"gateway",
	"vault",
	"traits",
	"studio",
	"lens",
	"repair",
	"approval",
	"ledger",
	"onchain",
	"botbae"
];
export const CAMPUS_AGENTS = [
	{
		id: "mock-a",
		color: "#ff5ad5",
		home: "approval",
		radius: 2.8,
		speed: .22,
		phase: .2
	},
	{
		id: "mock-b",
		color: "#ff8a3d",
		home: "repair",
		radius: 2.4,
		speed: .18,
		phase: 1.1
	},
	{
		id: "mock-c",
		color: "#d4ff4a",
		home: "lens",
		radius: 3.1,
		speed: .16,
		phase: 2.4
	},
	{
		id: "mock-d",
		color: "#5ee0ff",
		home: "gateway",
		radius: 2.6,
		speed: .2,
		phase: .7
	},
	{
		id: "mock-e",
		color: "#c9b6ff",
		home: "ledger",
		radius: 2.2,
		speed: .14,
		phase: 1.8
	},
	{
		id: "mock-f",
		color: "#ff2a4a",
		home: "onchain",
		radius: 2.5,
		speed: .17,
		phase: 3.1
	},
	{
		id: "mock-g",
		color: "#f4f1ea",
		home: "vault",
		radius: 2.3,
		speed: .19,
		phase: .4
	},
	{
		id: "mock-h",
		color: "#7dff9a",
		home: "traits",
		radius: 2.7,
		speed: .15,
		phase: 2.2
	},
	{
		id: "mock-i",
		color: "#9aa4c8",
		home: "studio",
		radius: 2.9,
		speed: .13,
		phase: 1.5
	},
	{
		id: "mock-j",
		color: "#ff2d8a",
		home: "botbae",
		radius: 2.6,
		speed: .21,
		phase: .9
	},
	{
		id: "mock-k",
		color: "#2de8e0",
		home: "core",
		radius: 3.4,
		speed: .12,
		phase: .6
	}
];
export const UTILITY_FLAGS = [
	{
		id: "grid",
		label: "GRID ONLINE",
		tone: "live"
	},
	{
		id: "botbae",
		label: "BOTBAE: LIVE",
		tone: "live"
	},
	{
		id: "agents",
		label: "AGENTS: MOCK",
		tone: "mock"
	},
	{
		id: "provider",
		label: "PROVIDER: MOCK",
		tone: "mock"
	},
	{
		id: "paid",
		label: "PAID GENERATION: DENY",
		tone: "deny"
	},
	{
		id: "chain",
		label: "ON-CHAIN ISSUE: DENY",
		tone: "deny"
	},
	{
		id: "regis",
		label: "REGIS / SENTINEL-6 VISUALIZED ONLY",
		tone: "mock"
	}
];
export const PARALLAX_LOOP = [
	{
		id: "see",
		name: "SEE",
		note: "Inspect the scene before anything moves."
	},
	{
		id: "act",
		name: "ACT",
		note: "Operate inside a bounded mandate."
	},
	{
		id: "again",
		name: "SEE AGAIN",
		note: "Capture what actually changed."
	},
	{
		id: "verify",
		name: "VERIFY",
		note: "Generated does not equal verified."
	},
	{
		id: "receipt",
		name: "RECEIPT",
		note: "Leave evidence. AUTH FAILED is a valid outcome."
	}
];
export const BOTBAE_BUILDINGS: { id: string; name: string; destId?: string; status: GridStatus }[] = [
	{
		id: "memory",
		name: "MEMORY VAULT",
		status: "PREVIEW"
	},
	{
		id: "foundry",
		name: "AGENT FOUNDRY",
		destId: "botbae-pages",
		status: "LIVE"
	},
	{
		id: "skills",
		name: "SKILLS MARKET",
		status: "PREVIEW"
	},
	{
		id: "exchange",
		name: "HERMES EXCHANGE",
		destId: "hermes-pages",
		status: "LIVE"
	},
	{
		id: "aegis-gate",
		name: "AEGIS GATE",
		destId: "aegis-repo",
		status: "AVAILABLE"
	},
	{
		id: "deploy",
		name: "DEPLOYMENT TERMINAL",
		destId: "botbae-pages",
		status: "LIVE"
	},
	{
		id: "sentinel-b",
		name: "SENTINEL-6",
		destId: "sentinel-repo",
		status: "AVAILABLE"
	},
	{
		id: "audit",
		name: "AUDIT ARCHIVE",
		status: "PREVIEW"
	},
	{
		id: "game",
		name: "GAME DISTRICT",
		status: "PLANNED"
	},
	{
		id: "commons",
		name: "COMMUNITY COMMONS",
		destId: "hermes-community",
		status: "LIVE"
	}
];
export const MCP_DEST_ID: Record<string, string> = {
	"agent-mcp": "mcp-pages",
	parallax: "parallax-pages",
	atlas: "atlas-repo",
	asimov: "asimov-repo",
	offgrid: "offgrid-repo"
};
export const DEST_BY_DISTRICT: Record<string, Destination[]> = DESTINATIONS.reduce((acc: Record<string, Destination[]>, d) => {
	if (!d.districtId) return acc;
	(acc[d.districtId] ??= []).push(d);
	return acc;
}, {});
export function destById(id: string): Destination | undefined {
	return DESTINATIONS.find((d) => d.id === id);
}
export function destUrl(dest: Destination): string | undefined {
	if (dest.status === "LIVE" && dest.href) return dest.href;
	if ((dest.status === "AVAILABLE" || dest.status === "LIVE") && dest.repo) return dest.repo;
}
/** LIVE hosts render a captured screenshot of the live URL. Never cinematic video. */
export function destFrame(dest: Destination): string | undefined {
	if (dest.status === "LIVE" && dest.href) return `/media/stills/live/${dest.id}.jpg`;
	return dest.poster;
}
export function destForApp(app: string) {
	const needle = app.replace(/\/$/, "").toUpperCase();
	const compact = needle.replace(/^AGENTROPOLIS-/, "");
	return DESTINATIONS.find((d) => {
		if (d.kind === "in-app" || d.kind === "channel" || d.kind === "asset" || d.kind === "film") return false;
		if (d.id.startsWith("gate-")) return false;
		const repoName = d.repo?.split("/").pop()?.toUpperCase();
		if (repoName === needle || repoName === `AGENTROPOLIS-${compact}` || repoName?.replace(/^AGENTROPOLIS-/, "") === compact) return true;
		const hrefTail = d.href?.replace(/\/$/, "").split("/").pop()?.toUpperCase();
		return hrefTail === needle || hrefTail === `AGENTROPOLIS-${compact}` || hrefTail?.replace(/^AGENTROPOLIS-/, "") === compact;
	});
}
export function districtSurfaces(districtId: string) {
	return (DEST_BY_DISTRICT[districtId] ?? []).filter((d) => (d.kind === "pages" || d.kind === "repo" || d.kind === "channel" || d.kind === "site") && !d.id.startsWith("gate-"));
}
export const HERMES_STACK = ["hermes-pages", "hermes-city-repo", "hermes-social-repo", "hermes-dock-repo"] as const;
export const MISSING_ASSETS = DESTINATIONS.filter((d) => d.status === "MISSING");
export const AGENT_SPRITE_CONSTRAINT = "Presence ticks are temporary telemetry. They are not the agent canon. Walk-cycle and rigged NEURO bodies are not on this floor. Names appear on selection.";
export const CAMPUS_SPRITE_NOTE = "Stick figures on this campus are MOCK bodies. They are not agent canon. No live agent is on this floor.";

export const HOLOFOIL_BUILDINGS: {
  id: string;
  name: string;
  code: string;
  role: string;
  status: GridStatus;
  x: number;
  z: number;
  h: number;
  w: number;
  depth: number;
  glow: string;
  work: string;
}[] = [
  { id: "lab", name: "Material Lab", code: "LAB", role: "Configure foil. Export JSON. Pointer / tilt is live.", status: "LIVE", x: -7.4, z: -7.2, h: 13, w: 5.2, depth: 4.6, glow: "#22e8ff", work: "FOIL-1 is tilting the pointer. JSON export is ready." },
  { id: "studio", name: "Card Studio", code: "CS", role: "Operational cards. Deterministic foil on the plate.", status: "LIVE", x: 7.4, z: -7.2, h: 12, w: 5.4, depth: 4.8, glow: "#ff2a4a", work: "FOIL-2 is grading a card on the plate." },
  { id: "dex", name: "Creature-Dex", code: "DX", role: "Catalog of foil creatures. No mint.", status: "LIVE", x: -11.2, z: 2.4, h: 10, w: 5.6, depth: 4.4, glow: "#c9b6ff", work: "DEX-9 is shelving a verified creature." },
  { id: "stage", name: "3D Stage", code: "ST", role: "Spatial foil. The object is the receipt.", status: "LIVE", x: 0, z: -14.2, h: 16, w: 6.2, depth: 5.2, glow: "#22e8ff", work: "Stage is spinning a live foil object." },
  { id: "story", name: "Storyboard", code: "SB", role: "Sequence the material. Frames stay honest.", status: "AVAILABLE", x: 11.2, z: 2.4, h: 9.4, w: 5.2, depth: 4.2, glow: "#ff2a4a", work: "Frames are being locked in order." },
  { id: "sdk", name: "SDK / Integration", code: "SDK", role: "Export the system. No wallet required.", status: "LIVE", x: -6.4, z: 11.2, h: 11, w: 5.0, depth: 4.4, glow: "#22e8ff", work: "SDK-4 is publishing a foil config." },
  { id: "topology", name: "Topology", code: "TP", role: "See the grid without pretending it is live.", status: "AVAILABLE", x: 6.4, z: 11.2, h: 10.5, w: 4.8, depth: 4.2, glow: "#c9b6ff", work: "Topology is a canonical preview." },
  { id: "thermo", name: "Thermodynamics", code: "TH", role: "Entropy, drift, friction. Preview axes. Not live gauges.", status: "PREVIEW", x: -12.6, z: -5.4, h: 8.4, w: 4.4, depth: 3.8, glow: "#ff2a4a", work: "Thermo axes are preview. SENTINEL owns the miss." },
  { id: "memory", name: "Memory evolution", code: "ME", role: "Provenance before canon. Contradictions stay visible.", status: "AVAILABLE", x: 12.6, z: -5.4, h: 8.8, w: 4.4, depth: 3.8, glow: "#22e8ff", work: "Memory is gated on provenance." },
  { id: "skills", name: "Skill development", code: "SK", role: "New skills enter through verification. Self-promotion is disabled.", status: "AVAILABLE", x: 0, z: 13.6, h: 9.2, w: 5.4, depth: 4.2, glow: "#c9b6ff", work: "Readiness is a citizenship gate." },
];
