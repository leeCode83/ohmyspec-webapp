/**
 * ClipboardCard — the auth form mounted on a 3D clipboard: wood board,
 * steel clip, stacked sheets, and the paper carrying the form as checklist
 * rows. Purely presentational; state and submission live in the forms.
 */
import "./auth.css";

/**
 * @param kicker Mono sheet label above the title, e.g. "FORM A-01".
 * @param title Page heading (h1).
 * @param subtitle Supporting line under the title.
 * @param footer Bottom strip content (switcher link), already animated.
 * @param stamp Small rotated mono stamp printed on the paper.
 */
export function ClipboardCard({
  kicker,
  title,
  subtitle,
  footer,
  stamp,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  stamp: string;
  children: React.ReactNode;
}) {
  return (
    <div className="clip-scene w-full max-w-sm">
      <article className="clip-board">
        <div className="clip-under" aria-hidden />
        <div className="clip-under" aria-hidden />
        <div className="clip-paper">
          <span className="clip-metal" aria-hidden />
          <header className="clip-head">
            <p className="type-label text-[var(--cobalt)]">{kicker}</p>
            <h1 className="type-display mt-1.5 text-[1.75rem] leading-tight text-[var(--graphite)]">
              {title}
            </h1>
            <p className="mt-1.5 text-[0.9375rem] font-medium text-muted-foreground">
              {subtitle}
            </p>
          </header>
          {children}
          <span className="clip-stamp">{stamp}</span>
        </div>
      </article>
      <div className="clip-foot" style={{ "--row": 5 } as React.CSSProperties}>
        {footer}
      </div>
    </div>
  );
}

/**
 * One checklist row: redline checkbox + mono label + ruled input line.
 * `ok` ticks the box (draws the check) when the field is valid.
 */
export function ClipRow({
  label,
  htmlFor,
  ok,
  index,
  children,
}: {
  label: string;
  htmlFor: string;
  ok: boolean;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <div className="clip-row" data-ok={ok} style={{ "--row": index } as React.CSSProperties}>
      <span className="clip-check" aria-hidden>
        <svg viewBox="0 0 24 24">
          <path d="M4.5 12.5l5 5L19.5 7" />
        </svg>
      </span>
      <div>
        <label className="clip-label" htmlFor={htmlFor}>
          {label}
        </label>
        {children}
      </div>
    </div>
  );
}
