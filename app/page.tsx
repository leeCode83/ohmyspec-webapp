import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import LandingView from "@/components/landing/landing-view";
import { AppHeader } from "@/components/app/app-header";
import { createClient } from "@/lib/supabase/server";
import { getMyWorkspaces } from "@/lib/workspaces/queries";

/**
 * Hybrid "/" (user decision): anonymous visitors get the marketing landing;
 * authenticated users get the dashboard (spec §2.6) — or a bounce to
 * onboarding when they have no workspace. Landing markup lives in
 * components/landing/landing-view.tsx, unchanged.
 */
export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingView />;
  }

  const workspaces = await getMyWorkspaces();
  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 font-heading text-2xl font-bold">Your workspaces</h1>
        <DashboardView workspaces={workspaces} />
      </main>
    </>
  );
}
