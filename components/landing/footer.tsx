import Link from "next/link";

/**
 * Footer — penutup halaman: wordmark + tagline, kolom link, credit font,
 * dan copyright dengan tagline horor kecil. Statik, tanpa state.
 */
const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "The Haunts", href: "#ghosts" },
      { label: "Ritual", href: "#how" },
      { label: "Summon the workspace", href: "#summon" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/leeCode83/ohmyspec-webapp" },
      { label: "PRD", href: "https://github.com/leeCode83" },
      { label: "MIT License", href: "https://opensource.org/license/mit" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-[#030609] px-6 pb-10 pt-16 md:px-10">
      <div className="wrap grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-heading text-xl font-semibold tracking-wide text-foreground">
            Ohmy<span className="text-primary">Spec</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Author, refine, and dispatch specs before they come back for
            you.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {col.heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {/* min-h 44px: tap target mobile (gate tap-size) */}
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap mt-14 flex flex-col gap-2 border-t border-border/30 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 OhmySpec, tulis spec-nya sebelum ia menulis dirinya
          sendiri.
        </p>
        {/* Credit font (satu baris, sesuai aturan kredit) */}
        <p>
          Set in Fraunces &amp; Geist · Siluet horor hand-drawn untuk
          OhmySpec
        </p>
      </div>
    </footer>
  );
}
