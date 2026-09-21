# AGENTS.md

Guidelines for anyone (human or AI) building features in this repo.

Musty's Map ships to the iOS App Store. Every feature must be able to pass App Review.
Apple rejects on the *shipped behavior*, not on intent — so these constraints belong in the
design of each feature, not in a cleanup pass before submission.

Source: [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
(pulled 2026-09-21). Section numbers below map to that document.

---

## Check before every feature

Run this list against anything you build. Most items are one line of work at design time
and a rewrite if deferred.

- [ ] Does it accept content from users? → see **UGC** below. This is our highest rejection risk.
- [ ] Does it read location, photos, camera, or contacts? → see **Permissions & privacy**.
- [ ] Does it add a login, account, or profile? → see **Accounts**.
- [ ] Does it collect a new field? → is it required for the task, and is it in the privacy policy?
- [ ] Does it gate app functionality behind a permission, login, push, or a rating prompt? → not allowed.
- [ ] Can a reviewer reach it in a fresh install with no data? → if not, it needs review notes or seed data.
- [ ] Does it use Cal Poly names, logos, or dining brands? → see **IP**.

---

## UGC — reports, photos, free-food posts (1.2)

Our core loop is user-submitted reports. Apple treats that as user-generated content, and
**1.2 is the single most common reason apps like ours get rejected.** All four of these must
exist in the app before we submit — not on a roadmap:

1. **Filtering** — a method for filtering objectionable material *from being posted*. Server-side
   check on any free-text or photo field before it becomes visible to others.
2. **Reporting** — an in-app mechanism to report offensive content, plus timely response to those
   reports. The button has to be reachable from the content itself.
3. **Blocking** — the ability to block an abusive user. A blocked user's content must disappear
   for the blocker.
4. **Published contact info** — reachable from inside the app and from the Support URL (1.5).

Implications for our design:

- Any new free-text field (report notes, event descriptions, display names) inherits all four
  requirements. Prefer structured input — enums, pickers, presets — over free text. A busyness
  level or wait-time bucket carries no moderation burden; a comment box does.
- If we add photo attachments to reports, that is UGC too. It needs the same filtering, reporting,
  and blocking path, and it raises the moderation bar substantially.
- We are responsible for removing violating content. "Flag-based, no launch moderation" is not a
  viable answer for text or photos.
- Apps whose UGC becomes primarily bullying, threats, or objectification of real people ("hot-or-not"
  voting) can be removed without notice. Keep ratings pointed at *places*, never at people or staff.

## Permissions & privacy (5.1)

- **Purpose strings must clearly and completely describe the use** (5.1.1 ii). Update
  `app.json` → `ios.infoPlist` whenever a feature changes *why* we read a resource. A stale
  purpose string is a rejection.
- **Data minimization** (5.1.1 iii) — only request data relevant to core functionality, only
  collect what the task needs. We do not need background location, precise history, or a
  persistent location trail to show a campus map.
- **Location only when directly relevant** (5.1.5). Notify and get consent before collecting,
  transmitting, or using location. Explain the purpose in-app, not just in the OS prompt.
- **Respect refusal** (5.1.1 iv) — never manipulate, trick, or nag into granting access. If
  location is denied, the map must still work: default to a campus-center view and let the user
  pick a location manually.
- **Never gate the app on a system permission** (5.1.2 i) — we may not require location, push
  notifications, or tracking in order to use functionality or content. Free-food push is opt-in
  and the feed works without it.
- **Privacy policy** (5.1.1 i) — linked in App Store Connect *and* easily accessible in-app. It
  must state what we collect, how, every use, third parties (Supabase counts), retention/deletion
  policy, and how a user revokes consent or requests deletion. Update it in the same PR that adds
  a collected field.
- **No repurposing** (5.1.2 ii) — data collected for live status may not later feed historical
  patterns, a predictive model, or analytics without fresh consent.
- **No de-anonymizing** (5.1.2 iii) — if we describe reports as anonymous or aggregated, we may
  not build or enable profiles from them. That constrains how much we can expose about a reporter.
- **Tracking** requires App Tracking Transparency permission (5.1.2 i). Simplest path: don't track.
- **Minors** (5.1.4) — some Cal Poly students are under 18. Any feature collecting personal info
  from a minor needs a privacy policy and compliance with COPPA/GDPR. Avoid third-party analytics
  and ads.

## Accounts (5.1.1 v, 4.8)

- **A guest mode is required.** Apple's rule is that if the app doesn't have significant
  account-based features, people must be able to use it without a login. Reading the map, viewing
  pin status, and browsing the free-food feed must all work for a signed-out user, regardless of
  what we pick for reporting. Treat the signed-out path as a first-class state in every screen —
  not a locked door with a sign-in wall behind it.
- **Guest access is least-privilege.** A guest gets read-only access to public, already-aggregated
  data and nothing more. No guest may read another user's identity, raw report history, or any
  row not required to render the map. Enforce this in Supabase RLS policies on the `anon` role
  rather than in client code — the client is not a trust boundary. When adding a table or column,
  the default for `anon` is no access; grant the narrowest read that makes the feature work, and
  never grant write access to a guest beyond what an anti-spam design explicitly allows.
- **If we support account creation, we must offer account deletion inside the app.** Not by email,
  not by web form — in-app, and it must actually delete.
- Don't require personal info to function unless directly relevant to core functionality or
  required by law. A Cal Poly email requirement needs to be justified as anti-spam, and it must
  not gate read-only use.
- **If we add Google/Facebook/social login, we must also offer an equivalent option** that limits
  collection to name + email, lets the user hide their email, and doesn't collect app interactions
  for ads (4.8) — in practice, Sign in with Apple. Not required if we use only our own
  (Supabase email/password) sign-in.
- Never store social credentials or tokens off-device (5.1.1 v).

## Completeness & metadata (2.1, 2.3)

- Submissions must be final: no placeholder text, no dead URLs, no empty screens (2.1 a).
- **Provide a working demo account and keep the backend on** for review. Supabase must be live
  and seeded — a reviewer opening an empty map at 2am sees a broken app, which also risks 4.2.
- Describe every new feature specifically in the Notes for Review. Generic descriptions are
  rejected, and hidden/undocumented features are a violation (2.3.1 a).
- Screenshots show the app in use — not the splash or login screen (2.3.3).
- Answer age-rating questions honestly (2.3.6). UGC affects the rating.
- App name ≤ 30 characters; no keyword stuffing with trademarks (2.3.7).

## Minimum functionality (4.2)

The app must be more than a repackaged website or a static list. Our defense is live,
crowd-sourced status — which means the **cold-start problem is an App Review problem, not just a
product problem.** A map of pins all reading "unknown" can read as non-functional.

## IP and Cal Poly branding (5.2)

- Don't use trademarks, logos, or copyrighted material without permission — this includes Cal Poly
  marks, dining brand logos, and campus photography.
- The app may not appear to be an official Cal Poly app unless it is one. Be explicit that it's
  student-run, unaffiliated.
- Apps should be submitted by the entity that owns the rights.

## Technical (2.4, 2.5)

- Don't drain battery, overheat the device, or run unrelated background work (2.4.2). Relevant to
  location polling and map refresh intervals — poll on demand, not continuously.
- Public APIs only, must run on the currently shipping OS (2.5.1).
- No downloading or executing code that changes app features (2.5.2). OTA updates must stay within
  Expo's allowed bounds — JS bundle updates to existing functionality, not new behavior smuggled in.
- Explicit consent plus a clear visual/audible indicator when recording user activity, including
  camera or microphone (2.5.14).

## Never

- Force users to rate, review, or download another app to access functionality (3.2.2 x).
- Offer rewards or compensation for enabling push, location, or tracking (5.1.2 i).
- Ship hidden or dormant features intended to activate after review (2.3.1 a).
- Compile personal information about people from sources other than the user themselves,
  even public ones (5.1.1 viii).
