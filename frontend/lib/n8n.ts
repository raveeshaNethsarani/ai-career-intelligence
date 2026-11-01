import "server-only";

const BASE = process.env.N8N_BASE_URL ?? "http://localhost:5678";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/webhook/${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    ...init,
  });
  if (!res.ok) {
    throw new Error(`n8n ${path} responded with ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}

export function n8nGet<T>(path: string) {
  return call<T>(path);
}

export function n8nPost<T>(path: string, body: unknown) {
  return call<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
