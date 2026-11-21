import { redirect } from "next/navigation";
import { OnboardingForms } from "@/components/auth/onboarding-forms";
import { getMyWorkspaces } from "@/lib/workspaces/queries";

export const instant = false; // blocking route: reads RLS-scoped workspaces (cookies) per request

/**
 * Mandatory onboarding (spec §2.4): authenticated users WITH a workspace
 * are bounced to the dashboard; without one they cannot pass into (app)
 * routes. proxy.ts already ensured the visitor is authenticated.
 */
export default async function OnboardingPage() {
  const workspaces = await getMyWorkspaces();
  if (workspaces.length > 0) {
    redirect("/");
  }
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 font-heading text-2xl font-bold">Welcome to OhmySpec</h1>
      <OnboardingForms />
    </main>
  );
}
