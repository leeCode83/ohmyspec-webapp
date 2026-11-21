import { LoginForm } from "@/components/auth/login-form";

/**
 * Login page (spec §2.2).
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={next ?? null} />;
}
