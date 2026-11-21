import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Nav — bilah navigasi landing: wordmark OhmySpec + CTA.
 * Gaya: garis tipis kertas gambar, satu tombol hard-hat.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <nav className="wrap flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex min-h-[44px] items-center font-heading text-xl font-extrabold tracking-tight text-foreground"
        >
          Ohmy<span className="text-primary">Spec</span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#tools"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            The tools
          </a>
          <a
            href="#process"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Process
          </a>
          <Button
            asChild
            className="h-11 bg-[var(--hard-hat)] px-5 text-[var(--graphite)] hover:bg-[var(--hard-hat)]/85"
          >
            <Link href="/auth/signup">Start a project</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
