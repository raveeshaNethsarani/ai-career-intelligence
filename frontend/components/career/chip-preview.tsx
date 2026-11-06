import { Pill } from "@/components/career/pill";

export function ChipPreview({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const suspicious = items.some((i) => i.trim().split(/\s+/).length >= 4);
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <Pill key={i} tone="info">
            {i}
          </Pill>
        ))}
      </div>
      {suspicious ? (
        <p className="text-xs text-[#D08C0B]">
          One item has many words. Separate each skill with a comma, for example: python, sql, n8n.
        </p>
      ) : null}
    </div>
  );
}
