import { getProfile } from "@/lib/api";
import { ApiError } from "@/components/career/api-error";
import { PageHeader } from "@/components/career/page-header";
import { ProfileForm } from "@/components/career/profile-form";

export default async function ProfilePage() {
  const res = await getProfile();

  return (
    <>
      <PageHeader
        title="My profile"
        description="Your skills and preferences. The matching workflow compares every job against this."
      />
      {res.ok ? (
        <ProfileForm initial={res.data} />
      ) : (
        <ApiError
          message={res.error}
          hint="Check that the n8n workflows '06 - API profile get' and '07 - API profile save' are active."
        />
      )}
    </>
  );
}
