import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { getMyWorkspaces } from "@/lib/workspaces/queries";

/**
 * Gate for the authenticated area (spec §1): zero workspaces → onboarding.
 * This is UX routing, not authorization — RLS remains the sole
 * authorization layer. proxy.ts already ensured the visitor is
 * authenticated, so this layout never queries auth state itself.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const workspaces = await getMyWorkspaces();
  if (workspaces.length === 0) {
    redirect("/onboarding");
  }
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
