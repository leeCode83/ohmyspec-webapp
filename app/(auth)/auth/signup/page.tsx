import { SignupForm } from "@/components/auth/signup-form";
import { safeNextPath } from "@/lib/auth/redirect";

/**
 * Signup page (spec §2.1). The ?next value is validated once, here, via
 * the shared helper; the form receives the already-safe path or null.
 */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <SignupForm next={safeNextPath(next)} />;
}
