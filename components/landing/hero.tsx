import { Button } from "@/components/ui/button";

/**
 * Hero — layar pertama: judul + CTA di atas kertas gambar.
 */
export function Hero() {
  return (
    <section
      id="start"
      className="relative flex min-h-[calc(100svh-4rem)] items-center py-20"
    >
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="type-label text-primary">SHT A-101 · SPEC WORKSPACE</p>
          <h1 className="type-display mt-5 text-[clamp(2.75rem,6vw,4.75rem)]">
            Spec-driven development, built to plan.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            OhmySpec is where small teams author, refine, and dispatch specs
            to a coding agent.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-[var(--hard-hat)] px-6 text-[var(--graphite)] hover:bg-[var(--hard-hat)]/85"
            >
              <a href="#start">Start a project</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <a href="#tools">See the tools</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
