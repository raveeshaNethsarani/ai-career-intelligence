import { TriangleAlert } from "lucide-react";

export function ApiError({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium text-destructive">Could not load data</p>
        <p className="text-muted-foreground">{message}</p>
        {hint ? <p className="text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
