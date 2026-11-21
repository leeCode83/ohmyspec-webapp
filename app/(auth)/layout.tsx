import Link from "next/link";
import { AuthBackdrop } from "@/components/auth/auth-backdrop";

/**
 * Chrome for the anonymous auth pages: the clipboard form floats on the
 * live blueprint sheet, with a wordmark home link and a mono sheet footer.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <AuthBackdrop />
      <header className="relative z-10 px-6 pt-6 md:px-10">
        <Link
          href="/"
          className="inline-flex items-baseline gap-1.5 text-lg font-extrabold tracking-tight text-[var(--graphite)]"
        >
          OhmySpec
          <span aria-hidden className="inline-block h-2 w-2 translate-y-[-1px] rounded-[2px] bg-[var(--hard-hat)]" />
        </Link>
      </header>
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-5 md:py-8">
        {children}
      </div>
      <footer className="relative z-10 pb-5 text-center">
        <p className="type-label text-[color-mix(in_srgb,var(--dim-ink)_70%,transparent)]">
          SPEC-DRIVEN DEVELOPMENT — DRAWN, CHECKED, SHIPPED
        </p>
      </footer>
    </main>
  );
}
