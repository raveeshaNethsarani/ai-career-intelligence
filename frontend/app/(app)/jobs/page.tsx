import { getJobs } from "@/lib/api";
import { ApiError } from "@/components/career/api-error";
import { JobsExplorer } from "@/components/career/jobs-explorer";
import { PageHeader } from "@/components/career/page-header";

export default async function JobsPage() {
  const res = await getJobs();

  return (
    <>
      <PageHeader title="Jobs" description="Search and filter the jobs collected from Remotive and Arbeitnow." />
      {res.ok ? (
        <JobsExplorer jobs={res.data} />
      ) : (
        <ApiError message={res.error} hint="Check that the n8n workflow '04 - API jobs' is active." />
      )}
    </>
  );
}
