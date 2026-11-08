import { getJobs } from "@/lib/api";
import { PageHeader } from "@/components/career/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const n8n = await getJobs();

  return (
    <>
      <PageHeader title="Settings" description="Read-only overview of how this app is wired. No secrets are shown here." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>Status checked when this page loads.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>n8n and PostgreSQL</span>
              <Badge variant={n8n.ok ? "secondary" : "destructive"}>{n8n.ok ? "Connected" : "Unreachable"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Ollama (local AI)</span>
              <Badge variant="secondary">qwen2.5:3b, local</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data sources</CardTitle>
            <CardDescription>Terms we follow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Remotive</p>
              <p className="text-muted-foreground">
                Each job links back to its Remotive page. Fetched once a day (their limit is 4 requests a day). Listings are
                delayed by 24 hours. Remotive jobs are never sent to third-party sites.
              </p>
            </div>
            <div>
              <p className="font-medium">Arbeitnow</p>
              <p className="text-muted-foreground">
                Public job board API. Only remote jobs are kept. Each job links back to Arbeitnow.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Everything runs on this machine. Jobs and your profile are stored in a local PostgreSQL database.</p>
            <p>The AI model runs locally with Ollama, so your profile is not sent to any cloud service.</p>
            <p>Match scores are estimates to help you prioritise. They are not a guarantee of any outcome.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
