/**
 * Turns Supabase `functions.invoke` errors into readable text for toasts.
 */
export async function describeFunctionsInvokeError(error: unknown): Promise<string> {
  if (!error || typeof error !== "object") return String(error);

  const e = error as { name?: string; message?: string; context?: unknown };

  if (e.name === "FunctionsFetchError") {
    const c = e.context;
    if (c instanceof Error) return `${e.message} (${c.message}). Check network, VPN, or ad blockers.`;
    if (typeof c === "object" && c !== null && "message" in c) {
      return `${e.message} (${String((c as { message: string }).message)}).`;
    }
    return e.message ?? "Network error calling the Edge Function.";
  }

  if (e.name === "FunctionsHttpError" && e.context instanceof Response) {
    const res = e.context;
    let body = "";
    try {
      body = (await res.clone().text()).slice(0, 280);
    } catch {
      /* ignore */
    }

    if (res.status === 404) {
      return `Function not deployed (404). In your project folder run: supabase functions deploy meta-auth — or deploy "meta-auth" from the Supabase Dashboard. ${body ? `(${body})` : ""}`;
    }

    return `${e.message} HTTP ${res.status}${body ? `: ${body}` : ""}`;
  }

  if (e.name === "FunctionsRelayError") {
    return `${e.message}. Try again or check Supabase status.`;
  }

  return e.message ?? String(error);
}
