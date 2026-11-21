import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="h-6 w-40 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-14 animate-pulse rounded bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
