import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Nav — bilah navigasi landing: wordmark OhmySpec + CTA.
 * Sengaja minimal: landing ini satu halaman, tautan section via anchor.
 */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-sm">
      <nav className="wrap flex h-16 items-center justify-between">
        {/* min-h 44px: wordmark tetap tap target penuh di mobile */}
        <Link
          href="/"
          className="flex min-h-[44px] items-center font-heading text-xl font-semibold tracking-wide text-foreground"
        >
          Ohmy<span className="text-primary">Spec</span>
        </Link>
        <div className="flex items-center gap-6">
          {/* Anchor ke section (halaman satu-scroll) */}
          <a
            href="#ghosts"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            The Haunts
          </a>
          <a
            href="#how"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Ritual
          </a>
          {/* h-11: tap target 44px di mobile (gate tap-size) */}
          <Button
            asChild
            className="h-11 px-5 shadow-[0_0_18px_rgba(232,180,74,0.35)]"
          >
            <a href="#summon">Summon the workspace</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
