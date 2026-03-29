export type PlatformId = "Meta Ads" | "Google Ads" | "TikTok Ads" | "Snapchat Ads" | "X Ads";

export const AD_PLATFORMS: {
  id: PlatformId;
  short: string;
  color: string;
}[] = [
  { id: "Meta Ads", short: "Meta", color: "#1877f2" },
  { id: "Google Ads", short: "Google", color: "#4285f4" },
  { id: "TikTok Ads", short: "TikTok", color: "#fe2c55" },
  { id: "Snapchat Ads", short: "Snap", color: "#e6e600" },
  { id: "X Ads", short: "X", color: "#a1a1aa" },
];

export const platformColorByLabel: Record<string, string> = Object.fromEntries(
  [
    ...AD_PLATFORMS.map((p) => [p.id, p.color] as const),
    ["Google", "#4285f4"],
    ["Meta", "#1877f2"],
    ["TikTok", "#fe2c55"],
    ["Snap", "#d4d400"],
    ["Snapchat", "#d4d400"],
    ["Snapchat Ads", "#d4d400"],
    ["X", "#a1a1aa"],
  ],
);
