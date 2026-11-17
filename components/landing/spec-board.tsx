"use client";

import { useEffect, useReducer, useRef } from "react";
import { Check } from "lucide-react";

/**
 * SpecBoard — mock UI OhmySpec yang beranimasi sebagai "video demo":
 * user mengetik pertanyaan ke assistant (typewriter), assistant menjawab,
 * lalu AI menuliskan isi dokumen spec baris demi baris, diff preview muncul,
 * tombol Apply menyala dan diff diterapkan. Lalu loop mengulang.
 *
 * Murni state machine + requestAnimationFrame-free (pakai timer), tanpa
 * library animasi. Menghormati prefers-reduced-motion: langsung tampil penuh.
 */

// ─── Skrip demo ────────────────────────────────────────────────────────────────
const QUESTION = "What did we decide about auth in the payments spec?";
const ANSWER = "Payments reuses this session model.";

// Baris dokumen yang "diketik" AI. type: heading | para | check | check-redline
type DocLine =
  | { kind: "h1"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "para"; text: string }
  | { kind: "check"; text: string; redline?: boolean };

const DOC_LINES: DocLine[] = [
  { kind: "h1", text: "Spec · Auth service" },
  { kind: "h2", text: "Session model" },
  {
    kind: "para",
    text: "Sessions are signed JWTs issued by Supabase Auth and rotated every 60 minutes.",
  },
  { kind: "h2", text: "Acceptance criteria" },
  { kind: "check", text: "Expired tokens return 401" },
  {
    kind: "check",
    text: "Refresh happens on every request",
    redline: true,
  },
  { kind: "check", text: "Revoked sessions stop working within one request" },
];

// Baris #5 (index 5) adalah baris yang akan di-diff & di-apply.
const DIFF_INDEX = 5;
const DIFF_NEW = "Refresh rotates the token after 5 minutes of activity";

// ─── Timing (ms) ────────────────────────────────────────────────────────────────
const CHAR_Q = 34; // kecepatan ketik user
const CHAR_A = 26; // kecepatan ketik assistant
const CHAR_DOC = 16; // kecepatan ketik dokumen
const PAUSE_SHORT = 420;
const PAUSE_MED = 900;
const PAUSE_LONG = 1600;

// ─── State machine ──────────────────────────────────────────────────────────────
type Phase =
  | "idle"
  | "typing-question"
  | "thinking"
  | "typing-answer"
  | "pause-before-doc"
  | "typing-doc"
  | "pause-before-diff"
  | "show-diff"
  | "applying"
  | "applied"
  | "hold";

interface State {
  phase: Phase;
  qChars: number; // berapa karakter pertanyaan sudah tampil
  aChars: number; // berapa karakter jawaban sudah tampil
  docLine: number; // baris dokumen yang sedang diketik (index)
  docChars: number; // karakter di baris aktif
  applied: boolean; // apakah diff sudah diterapkan
}

const INITIAL: State = {
  phase: "idle",
  qChars: 0,
  aChars: 0,
  docLine: 0,
  docChars: 0,
  applied: false,
};

type Action =
  | { type: "reset" }
  | { type: "set"; patch: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return { ...INITIAL, phase: "typing-question" };
    case "set":
      return { ...state, ...action.patch };
  }
}

// Apakah suatu baris dokumen "aktif terlihat" (sudah selesai diketik penuh)
function lineFullyTyped(state: State, index: number) {
  return state.docLine > index;
}

export function SpecBoard() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const rootRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const started = useRef(false);

  // Mulai sekuens saat board masuk viewport.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Tampilkan keadaan akhir langsung (dokumen penuh, diff ter-apply).
      dispatch({
        type: "set",
        patch: {
          phase: "applied",
          qChars: QUESTION.length,
          aChars: ANSWER.length,
          docLine: DOC_LINES.length,
          docChars: 0,
          applied: true,
        },
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      if (!started.current) {
        started.current = true;
        dispatch({ type: "reset" });
      }
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          dispatch({ type: "reset" });
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mesin waktu: setiap perubahan phase/progress menjadwalkan langkah berikutnya.
  useEffect(() => {
    window.clearTimeout(timer.current);
    const after = (ms: number, patch: Partial<State>) => {
      timer.current = window.setTimeout(() => dispatch({ type: "set", patch }), ms);
    };

    switch (state.phase) {
      case "typing-question": {
        if (state.qChars < QUESTION.length) {
          after(CHAR_Q, { qChars: state.qChars + 1 });
        } else {
          after(PAUSE_SHORT, { phase: "thinking" });
        }
        break;
      }
      case "thinking": {
        after(PAUSE_MED, { phase: "typing-answer" });
        break;
      }
      case "typing-answer": {
        if (state.aChars < ANSWER.length) {
          after(CHAR_A, { aChars: state.aChars + 1 });
        } else {
          after(PAUSE_SHORT, { phase: "pause-before-doc" });
        }
        break;
      }
      case "pause-before-doc": {
        after(PAUSE_MED, { phase: "typing-doc" });
        break;
      }
      case "typing-doc": {
        const line = DOC_LINES[state.docLine];
        if (!line) {
          after(PAUSE_SHORT, { phase: "pause-before-diff" });
          break;
        }
        if (state.docChars < line.text.length) {
          after(CHAR_DOC, { docChars: state.docChars + 1 });
        } else {
          // baris selesai → pindah ke baris berikutnya
          if (state.docLine + 1 < DOC_LINES.length) {
            after(PAUSE_SHORT / 2, {
              docLine: state.docLine + 1,
              docChars: 0,
            });
          } else {
            after(PAUSE_SHORT, {
              docLine: state.docLine + 1,
              docChars: 0,
              phase: "pause-before-diff",
            });
          }
        }
        break;
      }
      case "pause-before-diff": {
        after(PAUSE_MED, { phase: "show-diff" });
        break;
      }
      case "show-diff": {
        after(PAUSE_LONG, { phase: "applying" });
        break;
      }
      case "applying": {
        after(PAUSE_SHORT, { phase: "applied", applied: true });
        break;
      }
      case "applied": {
        after(PAUSE_LONG * 1.6, { phase: "hold" });
        break;
      }
      case "hold": {
        // reset dan ulangi dari awal
        after(PAUSE_LONG, {
          phase: "typing-question",
          qChars: 0,
          aChars: 0,
          docLine: 0,
          docChars: 0,
          applied: false,
        });
        break;
      }
    }

    return () => window.clearTimeout(timer.current);
  }, [state]);

  // ── Derivasi tampilan ────────────────────────────────────────────────────────
  const qText = QUESTION.slice(0, state.qChars);
  const qTyping = state.phase === "typing-question" && state.qChars < QUESTION.length;

  const showAnswer = state.aChars > 0 || ["typing-answer", "pause-before-doc", "typing-doc", "pause-before-diff", "show-diff", "applying", "applied", "hold"].includes(state.phase);
  const aText = ANSWER.slice(0, state.aChars);
  const aTyping = state.phase === "typing-answer" && state.aChars < ANSWER.length;

  const docStarted = ["typing-doc", "pause-before-diff", "show-diff", "applying", "applied", "hold"].includes(state.phase);
  const diffVisible = ["show-diff", "applying"].includes(state.phase);
  const applying = state.phase === "applying";

  const saved = ["idle", "typing-question", "thinking", "typing-answer"].includes(state.phase)
    ? false
    : true;

  // Teks baris dokumen aktif (sedang diketik)
  function docLineText(index: number, line: DocLine): string {
    if (state.applied && index === DIFF_INDEX) return DIFF_NEW;
    if (lineFullyTyped(state, index)) return line.text;
    if (state.docLine === index) return line.text.slice(0, state.docChars);
    return "";
  }
  function docLineVisible(index: number): boolean {
    if (!docStarted) return false;
    return state.docLine >= index;
  }

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-sm border border-primary/40 bg-[var(--sheet)] shadow-[6px_6px_0_rgba(31,45,230,0.12)]"
    >
      {/* Bar jendela: nama file + status autosave */}
      <div className="flex items-center gap-2 border-b border-primary/25 px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.06em] text-foreground">
          auth-service.spec.md
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full transition-colors ${saved ? "bg-emerald-600" : "bg-[var(--hard-hat)]"}`}
          />
          {saved ? "saved" : "editing"}
        </span>
      </div>

      <div className="grid sm:grid-cols-[1.35fr_1fr]">
        {/* Dokumen — diketik AI baris demi baris */}
        <div className="min-h-[232px] space-y-2.5 px-4 py-4 font-mono text-[11.5px] leading-relaxed text-foreground/85">
          {DOC_LINES.map((line, i) => {
            if (!docLineVisible(i)) return null;
            const text = docLineText(i, line);
            const typingHere = docStarted && state.docLine === i && state.phase === "typing-doc";
            const cursor = typingHere ? <span className="sb-caret" aria-hidden /> : null;

            if (line.kind === "h1") {
              return (
                <p key={i} className="text-[10px] uppercase tracking-[0.16em] text-primary">
                  # {text}
                  {cursor}
                </p>
              );
            }
            if (line.kind === "h2") {
              return (
                <p key={i} className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span aria-hidden className="font-mono text-primary">H2</span>
                  <span>
                    {text}
                    {cursor}
                  </span>
                </p>
              );
            }
            if (line.kind === "para") {
              return (
                <p key={i}>
                  {text}
                  {cursor}
                </p>
              );
            }
            // check
            const isDiffLine = i === DIFF_INDEX;
            const redTone = isDiffLine && !state.applied;
            return (
              <div key={i} className="flex items-start gap-2">
                <Check aria-hidden className="mt-[3px] h-3 w-3 shrink-0 text-primary" />
                <span className={redTone ? "text-[var(--redline)]" : undefined}>
                  {text}
                  {cursor}
                </span>
              </div>
            );
          })}
          {/* caret awal saat dokumen belum ada barisnya */}
          {docStarted && state.docLine === 0 && state.docChars === 0 && (
            <span className="sb-caret" aria-hidden />
          )}
        </div>

        {/* Panel assistant */}
        <div className="border-t border-primary/25 px-4 py-4 sm:border-l sm:border-t-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Assistant
          </p>

          {/* Bubble pertanyaan user */}
          <p className="mt-3 min-h-[2.4em] rounded-sm bg-[var(--sheet-sunk)] px-2.5 py-2 text-[11px] leading-relaxed text-foreground/85">
            {qText}
            {qTyping && <span className="sb-caret" aria-hidden />}
          </p>

          {/* Indikator "thinking" */}
          {state.phase === "thinking" && (
            <p className="mt-2 flex items-center gap-1 pl-2.5 text-[11px] text-muted-foreground">
              <span className="sb-dot" />
              <span className="sb-dot" style={{ animationDelay: "0.18s" }} />
              <span className="sb-dot" style={{ animationDelay: "0.36s" }} />
            </p>
          )}

          {/* Jawaban assistant */}
          {showAnswer && (
            <p className="mt-2 min-h-[2.4em] border-l-2 border-primary pl-2.5 text-[11px] leading-relaxed text-foreground/90">
              {aText}
              {aTyping && <span className="sb-caret" aria-hidden />}
              {!aTyping && state.aChars >= ANSWER.length && (
                <>
                  {" "}
                  <span className="font-mono text-[10px] text-primary">
                    payments.spec.md §3
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Diff preview — muncul lalu diterapkan */}
      <div
        className={`grid border-t border-primary/25 transition-all duration-300 ${
          diffVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          gridTemplateRows: diffVisible ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <p className="bg-[var(--redline)]/10 px-4 py-1.5 font-mono text-[11px] text-[var(--redline)]">
            − Refresh happens on every request
          </p>
          <p className="bg-primary/[0.07] px-4 py-1.5 font-mono text-[11px] text-primary">
            + Refresh rotates the token after 5 minutes of activity
          </p>
          <div className="flex items-center gap-2 px-4 py-2.5">
            <span
              className={`flex h-7 items-center rounded-sm px-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] transition-all ${
                applying
                  ? "scale-95 bg-[var(--hard-hat)]/80 text-[var(--graphite)] ring-2 ring-[var(--graphite)]/40"
                  : "bg-[var(--hard-hat)] text-[var(--graphite)]"
              }`}
            >
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
    </div>
  );
}
