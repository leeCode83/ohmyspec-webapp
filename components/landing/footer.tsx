import Link from "next/link";

/**
 * Footer — penutup halaman: wordmark + tagline, dua kolom tautan, dan satu
 * baris kredit. Bar bawah memakai label mono, seolah strip isian pada
 * lembar gambar.
 */
const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "The tools", href: "#tools" },
      { label: "Process", href: "#process" },
      { label: "Start a project", href: "#start" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/leeCode83/ohmyspec-webapp" },
      { label: "MIT License", href: "https://opensource.org/license/mit" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--sheet-sunk)] px-6 pb-10 pt-14 md:px-10">
      <div className="wrap grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-heading text-xl font-extrabold tracking-tight">
            Ohmy<span className="text-primary">Spec</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            One drawing table for the specs your team writes before it
            builds.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="type-label text-muted-foreground">{col.heading}</h3>
            <ul className="mt-3 space-y-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center text-sm text-foreground/85 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap mt-10 flex flex-col gap-2 border-t border-border pt-5 font-mono text-[11px] tracking-[0.04em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 OhmySpec. Every spec gets its closure.</p>
        <p>Set in Manrope &amp; Geist Mono · Drawings by OhmySpec</p>
      </div>
    </footer>
  );
}
