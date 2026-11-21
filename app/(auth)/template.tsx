/**
 * Auth template — remounts on every navigation inside the auth group, so
 * the clipboard "lands on the sheet" animation replays for both
 * login → signup and signup → login. Backdrop stays in the layout.
 * auth.css ships with AuthBackdrop/ClipboardCard, both always mounted here.
 */
export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return <div className="auth-enter w-full max-w-sm">{children}</div>;
}
