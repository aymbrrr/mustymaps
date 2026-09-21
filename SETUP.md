# Setup

Dev environment for Musty's Map. No Mac required — Expo Go runs on any phone.

Repo layout:

```
mustymaps/
  supabase/migrations/   database schema + campus seed data
  packages/frontend/     Expo app
  packages/backend/      reserved, empty for now
```

---

## Prerequisites

- Node 20+
- Git
- **Expo Go** app on your phone (App Store / Play Store)
- Phone and laptop on the same Wi-Fi

Only if you're changing the database:

- Supabase CLI — `brew install supabase/tap/supabase`

---

## One-Time — Project Owner Only

1. Create a Supabase **organization** (free tier), then a project inside it
2. Invite every teammate to the org as a Member
3. Project Settings → API → copy the **Project URL** and **anon key**
4. Share both in the team Discord — never commit them
5. Auth → Providers → Email → **disable "Confirm email"** (dev only)
6. Push the schema from the repo root:

   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```

   This creates the `locations` / `reports` / `profiles` tables, the
   `location_live_status` view, and seeds the campus locations.

---

## Every Developer

```bash
git clone https://github.com/aymbrrr/mustymaps.git
cd mustymaps/packages/frontend
npm install
cp .env.example .env
```

Fill in `.env` with the values from Discord:

```
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

---

## Running the App with Expo Go

From `packages/frontend`:

```bash
npm start
```

Metro starts and prints a **QR code** in your terminal, plus a URL like
`exp://192.168.1.42:8081`.

**On iPhone**

1. Open the built-in **Camera** app (not Expo Go)
2. Point it at the QR code in your terminal
3. Tap the "Open in Expo Go" banner that appears

**On Android**

1. Open the **Expo Go** app
2. Tap **Scan QR code** on the Home tab
3. Point it at the QR code in your terminal

The app downloads the JS bundle and launches. Leave the terminal running —
saving a file hot-reloads the app on your phone.

**Useful keys while Metro is running**

| Key | Does |
|---|---|
| `r` | Reload the app |
| `j` | Open debugger |
| `m` | Toggle the dev menu on device |
| `?` | Show all commands |
| `Ctrl+C` | Stop the server |

**If the QR code won't connect**

The default mode needs your phone and laptop on the same network. Campus Wi-Fi
often blocks device-to-device traffic. Use tunnel mode instead — slower, but
works on any network:

```bash
npm run start:tunnel
```

Then scan the new QR code the same way.

---

## Database Changes

Migrations in `supabase/migrations/` are the source of truth. We share one dev
database — a bad migration breaks everyone.

- Never edit a migration that's already pushed. Add a new numbered file.
- Announce in Discord before running `supabase db push`
- The staleness and cooldown windows are SQL functions (`status_window()`,
  `report_cooldown()`) defined once in `001_initial_schema.sql` — change them
  there, not in scattered queries
- If you change tables, regenerate the client types:

  ```bash
  cd packages/frontend
  npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts
  ```

---

## Checks Before Pushing

From `packages/frontend`:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

From the repo root:

```bash
npm run format      # prettier
```

---

## Rules

- `.env` is gitignored — keep it that way
- Never commit real keys, including in `.env.example`
- `node_modules/` and `.expo/` are gitignored

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Changed `.env` and nothing happened | Restart with `npx expo start --clear` |
| Phone can't reach the dev server | Same Wi-Fi, or use `npm run start:tunnel` |
| Hermes / URL protocol error on launch | `expo-sqlite/localStorage/install` must stay the first import in `App.tsx` |
| Map is empty | Schema not pushed, or `.env` is wrong. Check Supabase → Table Editor → `locations` has rows |
| Every pin is grey | Expected with no data — grey means no reports in the last 90 minutes |
| "You already reported this spot recently" | Working as intended, 10-minute cooldown per user per location |
| Location always fails in simulator | Test GPS on a physical device |
| Dependency version errors | `npx expo install --fix` — don't manually bump pinned versions |
