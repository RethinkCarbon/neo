/**
 * Meta OAuth redirect URI — must match exactly:
 * - `redirect_uri` in the authorize URL (React)
 * - `redirect_uri` in the code→token exchange (Edge Function `meta-auth`)
 * - Meta app settings (if Meta exposes a redirect URI field for your use case)
 *
 * Single source: `${SUPABASE_ORIGIN}/functions/v1/meta-auth`
 * Prefer deriving from `VITE_SUPABASE_URL` so it stays in sync with the Edge Function
 * (which uses `SUPABASE_URL`).
 */
export function getMetaOAuthRedirectUri(): string {
  const explicit = import.meta.env.VITE_META_REDIRECT_URI?.trim();
  if (explicit) return explicit;

  const base = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
  if (!base) {
    throw new Error("Missing VITE_SUPABASE_URL (needed to build Meta OAuth redirect_uri)");
  }
  return `${base}/functions/v1/meta-auth`;
}

const META_SCOPES = [
  "ads_read",
  "business_management",
  "pages_read_engagement",
  "pages_show_list",
] as const;

/** Facebook Login dialog — OAuth 2.0 authorize URL. */
export function buildMetaOAuthAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const appId = params.clientId.trim();
  if (!appId) throw new Error("Missing Meta App ID (VITE_META_APP_ID)");

  const u = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  u.searchParams.set("client_id", appId);
  u.searchParams.set("redirect_uri", params.redirectUri);
  u.searchParams.set("state", params.state);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", META_SCOPES.join(","));
  return u.href;
}
