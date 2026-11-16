/**
 * SpecMock — mock editor OhmySpec untuk section Features (HTML murni,
 * tanpa state). Menunjukkan produk yang sebenarnya dijual: dokumen spec,
 * side panel AI, dan diff preview yang menunggu persetujuan. Semua teks
 * diambil dari alur PRD (diff-preview, soft lock, template), bukan karangan.
 */
export function SpecMock() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-xl border border-border/60 bg-[#0d1824] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
    >
      {/* Bar jendela: tiga titik + nama file */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-[#0a121b] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#b03a3a]/80" />
        <span className="h-2 w-2 rounded-full bg-[#e8b44a]/70" />
        <span className="h-2 w-2 rounded-full bg-[#6b7c8f]/70" />
        <span className="ml-3 truncate font-mono text-[11px] text-muted-foreground">
          auth-service.spec.md
        </span>
        <span className="ml-auto rounded border border-primary/30 px-1.5 py-0.5 text-[10px] text-primary">
          ● editing
        </span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1.4fr_1fr]">
        {/* Dokumen */}
        <div className="space-y-2.5 p-5 font-mono text-[11.5px] leading-relaxed text-foreground/85">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80">
            # Spec · Auth service
          </p>
          <p>
            <span className="text-[#7b8ea3]">##</span> Session model
          </p>
          <p>
            Sessions are signed JWTs issued by Supabase Auth, rotated every
            60 minutes.
          </p>
          <p>
            <span className="text-[#7b8ea3]">##</span> Acceptance criteria
          </p>
          <ul className="space-y-1 pl-4">
            <li className="list-disc">Expired tokens return 401</li>
            <li className="list-disc">Refresh happens on every request</li>
          </ul>
          {/* Diff preview: baris dihapus + baris ditambahkan */}
          <div className="mt-3 overflow-hidden rounded-md border border-border/50">
            <p className="bg-[#b03a3a]/15 px-3 py-1.5 text-[#e39a9a]">
              - Refresh happens on every request
            </p>
            <p className="bg-primary/10 px-3 py-1.5 text-primary">
              + Refresh rotates the token after every 5 minutes of activity
            </p>
            <div className="flex items-center gap-2 bg-[#0a121b] px-3 py-2">
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-background">
                Apply
              </span>
              <span className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                Reject
              </span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                proposed by Tuyul
              </span>
            </div>
          </div>
        </div>

        {/* Side panel chat */}
        <div className="hidden border-l border-border/50 bg-[#0a121b] p-4 sm:block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Assistant
          </p>
          <div className="mt-3 space-y-2 text-[11px] leading-relaxed">
            <p className="rounded-md bg-secondary/60 px-2.5 py-2 text-foreground/85">
              What did we decide about auth in the payments spec?
            </p>
            <p className="rounded-md border border-border/50 px-2.5 py-2 text-foreground/90">
              Payments reuses this session model.{" "}
              <span className="text-primary">payments.spec.md §3</span>
            </p>
          </div>
          <p className="mt-4 border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
            workspace knowledge · local embeddings
          </p>
        </div>
      </div>
    </div>
  );
}
