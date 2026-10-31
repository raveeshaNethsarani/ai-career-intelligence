import type { ProfileInput } from "@/lib/types";

const MAX_ITEMS = 50;
const MAX_LEN = 60;
const MODES = ["remote", "hybrid", "onsite"];

function cleanList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") return null;
    const s = item.trim();
    if (!s) continue;
    if (s.length > MAX_LEN) return null;
    if (!out.includes(s)) out.push(s);
  }
  return out.length <= MAX_ITEMS ? out : null;
}

export type ParseResult = { ok: true; value: ProfileInput } | { ok: false; error: string };

export function parseProfileInput(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.display_name === "string" ? b.display_name.trim() : "";
  if (!name || name.length > 80) return { ok: false, error: "Name is required (max 80 characters)" };

  const years = Number(b.experience_years);
  if (!Number.isFinite(years) || years < 0 || years > 60) {
    return { ok: false, error: "Experience must be between 0 and 60" };
  }

  const target_roles = cleanList(b.target_roles);
  const skills = cleanList(b.skills);
  const must_have = cleanList(b.must_have);
  const avoid_keywords = cleanList(b.avoid_keywords);
  const preferred_locations = cleanList(b.preferred_locations);
  const work_modes = cleanList(b.work_modes);

  if (!target_roles || !skills || !must_have || !avoid_keywords || !preferred_locations || !work_modes) {
    return { ok: false, error: `Each list must have at most ${MAX_ITEMS} items of up to ${MAX_LEN} characters` };
  }
  if (!work_modes.every((m) => MODES.includes(m))) {
    return { ok: false, error: "Unknown work mode" };
  }

  return {
    ok: true,
    value: {
      display_name: name,
      experience_years: years,
      target_roles,
      skills,
      must_have,
      avoid_keywords,
      preferred_locations,
      work_modes,
    },
  };
}
