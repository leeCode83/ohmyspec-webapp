import { Check } from "lucide-react";

/**
 * SpecBoard — mock UI OhmySpec yang sebenarnya: dokumen spec di kiri,
 * panel assistant di kanan, diff preview menunggu persetujuan di bawah.
 * Isinya diambil dari alur PRD (autosave, soft lock, diff-preview, RAG),
 * bukan karangan. HTML murni, tanpa state; preview read-only.
 */
const ACCEPTANCE = [
  "Expired tokens return 401",
  "Refresh rotates the token after 5 minutes of activity",
  "Revoked sessions stop working within one request",
];

export function SpecBoard() {
  return (
    <div className="overflow-hidden rounded-sm border border-primary/40 bg-[var(--sheet)] shadow-[6px_6px_0_rgba(31,45,230,0.12)]">
      {/* Bar jendela: nama file + status autosave */}
      <div className="flex items-center gap-2 border-b border-primary/25 px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.06em] text-foreground">
          auth-service.spec.md
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          saved
        </span>
      </div>

      <div className="grid sm:grid-cols-[1.35fr_1fr]">
        {/* Dokumen */}
        <div className="space-y-2.5 px-4 py-4 font-mono text-[11.5px] leading-relaxed text-foreground/85">
          <p className="text-[10px] uppercase tracking-[0.16em] text-primary">
            # Spec · Auth service
          </p>
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <span aria-hidden className="font-mono text-primary">
              H2
            </span>
            Session model
          </p>
          <p>
            Sessions are signed JWTs issued by Supabase Auth and rotated
            every 60 minutes.
          </p>
          <p className="flex items-center gap-1.5 font-semibold text-foreground">
            <span aria-hidden className="font-mono text-primary">
              H2
            </span>
            Acceptance criteria
          </p>
          <ul className="space-y-1">
            {ACCEPTANCE.map((line, i) => (
              <li key={line} className="flex items-start gap-2">
                <Check
                  aria-hidden
                  className="mt-[3px] h-3 w-3 shrink-0 text-primary"
                />
                <span className={i === 1 ? "text-[var(--redline)]" : undefined}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Panel assistant: jawaban dari dokumen lain di workspace */}
        <div className="border-t border-primary/25 px-4 py-4 sm:border-l sm:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Assistant
          </p>
          <p className="mt-3 rounded-sm bg-[var(--sheet-sunk)] px-2.5 py-2 text-[11px] leading-relaxed text-foreground/85">
            What did we decide about auth in the payments spec?
          </p>
          <p className="mt-2 border-l-2 border-primary pl-2.5 text-[11px] leading-relaxed text-foreground/90">
            Payments reuses this session model.{" "}
            <span className="font-mono text-[10px] text-primary">
              payments.spec.md §3
            </span>
          </p>
        </div>
      </div>

      {/* Diff preview: menunggu persetujuan */}
      <div className="border-t border-primary/25">
        <p className="bg-[var(--redline)]/10 px-4 py-1.5 font-mono text-[11px] text-[var(--redline)]">
          − Refresh happens on every request
        </p>
        <p className="bg-primary/[0.07] px-4 py-1.5 font-mono text-[11px] text-primary">
          + Refresh rotates the token after every 5 minutes of activity
        </p>
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="flex h-7 items-center rounded-sm bg-[var(--hard-hat)] px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--graphite)]">
            Apply
          </span>
          <span className="flex h-7 items-center rounded-sm border border-border px-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Reject
          </span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            proposed by assistant
          </span>
        </div>
      </div>
    </div>
  );
}
