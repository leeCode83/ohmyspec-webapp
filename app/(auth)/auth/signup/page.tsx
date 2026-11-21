import { Suspense } from "react";
import { ClipboardCard } from "@/components/auth/clipboard-card";
import { SignupForm } from "@/components/auth/signup-form";
import { safeNextPath } from "@/lib/auth/redirect";

/**
 * Signup page (spec §2.1). The ?next value is validated once, here, via
 * the shared helper; the form receives the already-safe path or null.
 */
export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <Suspense fallback={<SignupCardSkeleton />}>
      <SignupSection searchParams={searchParams} />
    </Suspense>
  );
}

async function SignupSection({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <SignupForm next={safeNextPath(next)} />;
}

function SignupCardSkeleton() {
  return (
    <ClipboardCard
      kicker="FORM A-02 — CREW"
      title="Join the crew"
      subtitle="Create an account and start closing specs."
      stamp="REV. A · NEW"
      footer={<span className="opacity-40">Already have an account? Log in</span>}
    >
      <div className="mt-2 space-y-3" aria-hidden>
        <div className="clip-skeleton-row" />
        <div className="clip-skeleton-row" />
        <div className="clip-skeleton-row h-24" />
        <div className="clip-skeleton-row h-11" />
      </div>
    </ClipboardCard>
  );
}
