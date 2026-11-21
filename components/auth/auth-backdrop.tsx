/**
 * AuthBackdrop — the blueprint sheet the auth forms sit on: floating iso
 * tool assets (same figures as the landing's tool bento, rendered static),
 * a marching plotter trace, registration crosses and a dimension callout.
 * Purely decorative and pointer-transparent; zero client JS.
 */
import "./auth.css";
import { IsoPencil } from "@/components/figures/tools/pencil";
import { IsoTape } from "@/components/figures/tools/tape";
import { IsoWrench } from "@/components/figures/tools/wrench";
import { IsoLevel } from "@/components/figures/tools/level";
import { P } from "@/components/figures/tools/view";

const TOOLS = [
  { name: "pencil", cls: "iso auth-fig auth-drift tool-pencil-ghost", Fig: IsoPencil, label: "A red pencil" },
  { name: "tape", cls: "iso auth-fig auth-drift tool-tape-ghost", Fig: IsoTape, label: "A tape measure" },
  { name: "wrench", cls: "iso auth-fig auth-drift tool-wrench-ghost", Fig: IsoWrench, label: "An open-end wrench" },
  { name: "level", cls: "iso auth-fig auth-drift tool-level-ghost", Fig: IsoLevel, label: "A spirit level" },
] as const;

export function AuthBackdrop() {
  return (
    <div aria-hidden className="auth-backdrop">
      <svg className="auth-trace" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M -40 210 H 340 V 430 H 1080 V 180 H 1480" />
        <path d="M -40 700 H 260 V 520 H 1180 V 760 H 1480" />
      </svg>
      {TOOLS.map(({ name, cls, Fig, label }) => (
        <div key={name} className={cls}>
          <svg viewBox="0 0 200 200" role="img" aria-label={label} focusable="false">
            <Fig p={P} />
          </svg>
        </div>
      ))}
      <span className="auth-cross" style={{ top: "18%", left: "30%" }} />
      <span className="auth-cross" style={{ top: "64%", left: "18%" }} />
      <span className="auth-cross" style={{ top: "26%", right: "26%" }} />
      <span className="auth-cross" style={{ bottom: "20%", right: "32%" }} />
      <div className="auth-dim type-label" style={{ top: "4.5%", left: "10%", right: "10%" }}>
        <i />
        <span>OHMYSPEC · AUTH SHEET A-01 · SCALE 1:1</span>
        <i />
      </div>
    </div>
  );
}
