This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Demo walkthrough (M1 auth & workspaces)

This 12-step manual checklist doubles as the demo script for M1. Run the app
(`npm run dev`) with the local Supabase stack up (`npx supabase status`), then
walk the steps in order. Steps 1–5 use three identities: user A
(e.g. `alpha@test.dev`), user B (`beta@test.dev`), user C (`gamma@test.dev`).

1. **Signup with weak password.** Go to `/signup`, type a weak password
   (e.g. `weak`). The checklist shows unmet rules and the submit button stays
   blocked. With a valid one (e.g. `Str0ng!Pass`) the form submits and lands
   on onboarding.
2. **Onboarding: create.** On `/onboarding`, choose "Create your first
   workspace", name it "Alpha". The dashboard shows the workspace with an
   Owner badge.
3. **Invite + sign out.** Open the Alpha workspace, use the invite panel and
   click Copy (the copy button works and the read-only field shows the link).
   Note the invite code (the last path segment, `/join/<code>`). Sign out.
4. **Second user joins via link.** Open the invite URL `/join/<code>` while
   signed out. The workspace name is shown with "Sign up to join". Sign up as
   user B, get returned to the join page, click Join. You land in `/w/[id]`.
5. **Onboarding skip-path.** Sign up a fresh user C. During onboarding, paste
   the same invite code into the join field instead of creating a workspace.
   Joining enters the app directly.
6. **Member leaves.** As member B, open the workspace, use Leave and confirm
   in the dialog. You return to the dashboard and the workspace is gone from
   your list.
7. **Owner removes member.** As owner A, open the Alpha workspace members
   list, remove user C and confirm. The member list updates (C is gone).
8. **Regenerate invite.** As owner A, regenerate the invite code. The old
   link from step 3 now renders the generic invalid state at
   `/join/<oldcode>`.
9. **Rename visibility.** As owner A, rename the workspace from the workspace
   page. A non-owner member view shows no rename control. (Do this check
   while B or C is still a member, before steps 6/7, if running the steps in
   a different order.)
10. **Delete workspace.** As owner A, use the danger zone to delete the
    workspace with confirm. It disappears everywhere and the owner is
    returned to onboarding (zero workspaces).
11. **Member cap.** As A, create a new workspace, then fill it to 10 members
    (e.g. insert 9 filler members directly in the local Postgres against port
    54322, simulating prior joins). Attempt the 11th join via the UI with a
    fresh user: the "workspace is full" message appears.
12. **Anonymous bounce.** An anonymous visitor hitting `/` sees the landing
    page; hitting `/w/x` is bounced to the login page (verifiable with
    `curl -I` / the redirect response).

No E2E dependencies; automated proof lives in the pgTAP suite (backend plan)
plus the vitest unit suite for the pure auth logic in `lib/auth`.
