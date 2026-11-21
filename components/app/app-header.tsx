"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/browser";

/**
 * App header (spec §2.3): sign out and return to the login page.
 */
export function AppHeader() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <span className="font-heading font-bold uppercase tracking-wide">OhmySpec</span>
      <Button variant="ghost" onClick={handleSignOut}>
        Log out
      </Button>
    </header>
  );
}
