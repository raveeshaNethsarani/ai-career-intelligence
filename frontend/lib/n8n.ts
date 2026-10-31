import "server-only";

const BASE = process.env.N8N_BASE_URL ?? "http://localhost:5678";

export async function n8nGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/webhook/${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`n8n ${path} responded with ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}
