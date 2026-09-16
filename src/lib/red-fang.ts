export type RedFangChainCode = "doge" | "sol" | "eth" | "hood";

export type RedFangPersona = {
  chainCode: RedFangChainCode;
  chainName: string;
  station: string;
  displayName: string;
  personaId: string;
  canonUri: string;
  externalContext?: string;
};

export const RED_FANG = {
  id: "red-fang",
  name: "DJ RED FANG",
  scope: "systemwide" as const,
  homeDistrict: "AGENTROPOLIS-DISTRICT-33",
  network: "33.3FM",
  rule: "One canonical identity with bounded chain-specific persona overlays.",
  personas: [
    {
      chainCode: "doge",
      chainName: "DOGECHAIN",
      station: "33.3FM DOGECHAIN",
      displayName: "DJ RED FANG · 33.3FM DOGECHAIN",
      personaId: "red-fang::33.3fm::doge",
      canonUri: "agentropolis://district-33/red-fang/doge",
    },
    {
      chainCode: "sol",
      chainName: "SOLCHAIN",
      station: "33.3FM SOLCHAIN",
      displayName: "DJ RED FANG · 33.3FM SOLCHAIN",
      personaId: "red-fang::33.3fm::sol",
      canonUri: "agentropolis://district-33/red-fang/sol",
    },
    {
      chainCode: "eth",
      chainName: "ETHCHAIN",
      station: "33.3FM ETHCHAIN",
      displayName: "DJ RED FANG · 33.3FM ETHCHAIN",
      personaId: "red-fang::33.3fm::eth",
      canonUri: "agentropolis://district-33/red-fang/eth",
    },
    {
      chainCode: "hood",
      chainName: "HOODCHAIN",
      station: "33.3FM HOODCHAIN",
      displayName: "DJ RED FANG · 33.3FM HOODCHAIN",
      personaId: "red-fang::33.3fm::hood",
      canonUri: "agentropolis://district-33/red-fang/hood",
      externalContext: "Robinhood-oriented lane; internal AGENTROPOLIS label only",
    },
  ] satisfies RedFangPersona[],
};

export const RED_FANG_PERSONA_BY_CHAIN = Object.fromEntries(
  RED_FANG.personas.map((persona) => [persona.chainCode, persona]),
) as Record<RedFangChainCode, RedFangPersona>;
