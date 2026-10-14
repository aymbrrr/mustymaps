# Handoff: Musty's Map — Campus Eat & Study Ratings (iOS)

## Overview
Musty's Map is a Gen Z–styled campus app for Cal Poly SLO students. Students rate and review restaurants and study spots, see live busyness, browse a campus map, climb a leaderboard, and view each other's rating profiles. Sign-up is gated to `@calpoly.edu` emails.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, **not production code to copy**. The task is to **recreate these designs in the target codebase's environment** using its established patterns. If no codebase exists yet, **SwiftUI** (iOS 17+) is the recommended choice since this is an iOS app (MapKit for the map, native toggles/share sheet).

Open `Campus App Screens.dc.html` in a browser to see every screen side-by-side; every phone is fully interactive. `CampusApp.dc.html` is the single source containing all screens + logic (look at the `class Component` script at the bottom for data, state and behavior).

## Fidelity
**High-fidelity.** Final colors, type, spacing, copy and interactions. Recreate pixel-accurately. Device frame: 390×844 pt (iPhone 14/15). The black bezel, status bar, Dynamic Island and home indicator in the mock are frame chrome — use the real system ones.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| poly green | `#154734` | primary buttons, active states, selected pins, filled stars, bars, brand wordmark |
| seal grey | `#54585A` | subtext, captions, section labels, inactive tab icons |
| serenity | `#D5E4F4` | accent fills: avatars, study tiles, tags, hourly bars, header of public profile |
| serenity deep | `#9DB8D6` | the trailing "." / "?" on headlines; past-hour bars `#B9CCE2`; striped placeholder `#CADBEE` |
| off-white | `#FAF9F6` | app background, text on green |
| ink | `#17231D` | primary text, dark chips (live status pill), toast |
| card | `#FFFFFF` | cards, inputs, list containers |
| track | `#EEF0EC` | progress/bar track, unselected detail segments |
| star empty | `#DCDFDA` | unfilled stars |
| toggle off | `#E2E4E0` | switch track off |
| quote bg | `#F1F5FA` | top-comment box on feed |
| danger | `#B3261E` | errors, sign out, delete account |
| hairline | `rgba(23,35,29,.07)` | row dividers |
| card border | `1px solid rgba(23,35,29,.05)` | cards |
| input border | `1px solid rgba(23,35,29,.1)` | inputs, outlined chips |
| outline button | `1px solid rgba(23,35,29,.16)` | secondary buttons |

**Busyness levels** (5 steps, used everywhere): `dead #9AA3A0` · `chill #3E8E63` · `lively #C9A227` · `busy #D9822B` · `packed #C2412D`. Mapping from 0–100 occupancy: <20 dead, <40 chill, <60 lively, <80 busy, else packed. Displayed as "{level} rn".

### Typography
Font: **Geist** (Google Fonts; weights 400/500/600/700). All copy is **lowercase** (brand voice), except "TOP RATER" badge and uppercase section labels.
| Role | Size / weight / tracking / line-height |
|---|---|
| Hero wordmark (intro) | 64 / 600 / -0.06em / 0.9, green, trailing "." in `#9DB8D6` |
| Screen title (settings, leaderboard) | 40 / 600 / -0.045em |
| Auth title (sign in) | 46 / 600 / -0.05em / 1.0; sign-up 42 / 1.02 |
| Location name | 34 / 600 / -0.04em / 1.0 |
| Rate question | 34 / 600 / -0.04em / 1.05 |
| Big rating number | 40 / 600 / -0.05em (location), 30 (map bar) |
| Sheet title | 27–28 / 600 / -0.035em |
| Card title | 16–17 / 600 / -0.01em |
| Body | 15 / 400 / 1.4–1.45 |
| Sub / caption | 13–14 / 400, seal grey |
| Section label | 12 / 600 / +0.14em, UPPERCASE, seal grey |
| Tab label | 11 / 600 |
| Button | 16–17 / 600 |

Star glyph "★" inline with numbers is rendered at **0.72em** of the surrounding text, nudged up 0.1em, and the star+number never wraps (`white-space: nowrap`).

### Radius
Pills/buttons `999`; cards `24`; list containers `22`; inputs `18` (16 in edit sheet); sheets `30–34`; category tiles `14–15`; photo hero overlap `28` top corners; podium `18 18 8 8`; busyness check-in tiles `16`; detail segments `9`.

### Spacing
Screen side padding 20 (auth 28). Section gap 26–28. Card padding 14–16. Row min-height 54. Top safe area content starts at y≈56–58; bottom tab bar 88 tall.

### Shadows
Floating card: `0 10px 36px rgba(23,35,29,.16–.18)`. Map pills: `0 4px 14px rgba(23,35,29,.18)`. Header card: `0 4px 18px rgba(23,35,29,.08)`. Center FAB: `0 8px 20px rgba(21,71,52,.35)`. Toast: `0 8px 24px rgba(0,0,0,.2)`.

### Common components
- **Primary button**: h56, pill, green bg, off-white 17/600. Disabled = opacity .35 (still visible).
- **Secondary button**: h50–54, pill, transparent, outline border, ink text.
- **Chip (filter/pill)**: padding 9×16, pill, 14/500. Selected: green bg/off-white text; unselected: white bg, input border.
- **Tag**: serenity bg, green text, padding 8×13, 14/500. Selectable tags toggle to green/off-white.
- **Category tile**: 44–46 square, r14–15. Food = green bg, "eat" off-white; Study = serenity bg, "study" green. 13/600.
- **Score pill**: green bg, off-white, 13–14/600, "★ 4", padding 5–6×10–11.
- **Live pill**: ink bg, off-white, 8px colored dot + "{level} rn".
- **Toggle**: iOS switch 51×31, on = green.
- **Photo placeholder**: diagonal stripes serenity/`#CADBEE` with monospace label — replace with real photos.
- **Toast**: top-center, ink pill, 14/500, auto-dismiss 2.2s.

---

## Navigation
Bottom tab bar (88 tall, off-white 96% + blur, top hairline) with **5 slots**: `feed` · `map` · **center + FAB** (62 circle, green, raised -26) · `ranks` (trophy) · `you`. Active icon/label = green, inactive = seal grey. Tab bar shows on feed, map, leaderboard, profile. FAB opens Rate a Spot (preselects the currently selected/last-viewed spot).

Pushed screens (location, rate, public profile, settings, sign in/up) use a back stack. After login the app lands on **feed**.

---

## Screens

### 1. Intro (start)
- Top (y≈72): wordmark "musty's map." then 19/400 tagline "rate where you eat, study & lock in **@ cal poly slo**." ("@ cal poly slo" green, 600).
- Center: 250 circle, serenity fill, **6px green (#154734) ring**, Musty mascot image inside (contain).
- Bottom stack (gap 16, centered): primary "get started" → Sign Up; "already have an account? **sign in**" (15, grey; link green 600) → Sign In; legal 12/1.45 grey max-w 280: "by continuing, you agree to the terms of service and privacy policy." (links ink, underlined).

### 2. Sign In
Back chevron. Label "WELCOME BACK", title "sign in." Fields: email (placeholder `you@calpoly.edu`), password (eye toggle show/hide). Right-aligned "forgot password?" (toast: reset link sent / enter email first). Primary "sign in →" (disabled until valid email + non-empty password). Footer "new here? **sign up →**". Invalid email → red border + "needs to be a @calpoly.edu email."

### 3. Sign Up (2 steps)
**Step 1**: label "SIGN UP", title "what's your **.edu** email?" (.edu green), sub "we only use it to verify you're a student." Fields: school email, password ("8+ characters"), confirm password (mismatch → red border + "passwords don't match."). Checkbox (24, r7; checked = green with ✓): "i agree to the terms of service, privacy policy, and community guidelines." Primary "create account →" enabled only when email matches `/@calpoly\.edu$/i`, pw ≥ 8, pw == confirm, agreed. Footer "have an account? sign in".
**Step 2**: "ALMOST THERE" / "check your inbox." / "6-digit code sent to {email}". Code input h64, 28/500, letter-spacing .5em, centered, digits only, max 6. "let's go →" enabled at 6 digits → feed + toast "you're in. welcome to musty's map." Links: "← wrong email", "resend code".

### 4. Feed (tab)
- Header: 42 Musty avatar + "musty's map." 25/600 green.
- Search pill h50 white: "search a spot or a person".
- "TRENDING RN" + right "busiest at 2:14 pm". Horizontal carousel of 210-wide cards: photo 112 tall with live pill (top-left) and "#rank" pill (top-right, off-white/green); below: name 16/600, "★ 4.6 · 37 check-ins this hr". Sorted by current busyness, top 4.
- "ALL SPOTS" + chips all/eat/study. Cards (sorted by rating): tile + name + "{walk} walk · {hours}" + right big "★ 4.6" (20/600) / "{n} ratings" (11). Busyness row: dot + "{level} rn" (fixed 104 width) + 6px bar colored by level, width = occupancy%. Top comment box (`#F1F5FA`, r16): quoted text 15, caption "top comment · @handle · ★ 5" 12 grey. Tap → Location.

### 5. Map (tab)
- Full-bleed campus map (prototype used Leaflet + Esri street tiles desaturated; use **MapKit** natively, muted style). Center ≈ 35.3016, -120.6602, zoom ~16. User location: 15px green dot, white 3px ring, 38px translucent green halo.
- Floating header card (r24, off-white 97%): 46 Musty avatar, "musty's map" 21/600, "{n} spots · rn is 2:14 pm"; 44 search button.
- Filter chips row below: all / eat / study / quiet rn (level ≤ chill) / 4.2+.
- Recenter button 52 circle, right side.
- **Pins**: pill with type dot (food = solid green dot; study = serenity dot with green ring) + short name + rating (60% opacity). Selected pin: green bg, off-white text, scale 1.08, raised z. Small rotated-square tail. Tweak option: score-only pins ("★ 4.6").
- **Bottom card, nothing selected** ("WHAT'S GOOD RN" / "top rated nearby"): top 3 rows (tile, name, dot + "{walk} · {level} rn", rating). Tap selects.
- **Bottom card, pin selected (expanded bar)**: type chip (EAT green / STUDY serenity), live chip, close ×. Name 27/600, meta "{area} · {hours} · {walk}". Rating 30/600 + "{n} ratings"; mini hourly busyness chart (17 bars 7a–11p, 40 tall; now = green, past = `#B9CCE2`, future = serenity) with "7a · now · 11p" axis. Actions: "quick rate" (outline), "rate it" (green), 50 circle serenity arrow → Location. Tapping the map clears selection; selecting pans map so pin sits above the card.

### 6. Location detail
- Photo hero 290 tall with back + share circles (44, off-white). Content sheet overlaps by 28 with r28 top.
- Chips: type, hours ("open till 12a"), "{walk} walk" (no wrap). Name 34. Area 15 grey.
- Rating row: 40/600 number, 5 small stars (11px) + "{n} ratings", ink live pill.
- "HOW BUSY": day chips (today, tue…sun). White card: title "{level} right now" or "usually {level} {day} at {hour}", sub "~{n} min wait" (food) / "~{n}% of seats open" (study) + "· from 38 check-ins this hour" / "· tap a bar to peek". 17 hourly bars, 104 tall, r5; selected hour green, current hour `#7FA08F`, others serenity; tap a bar to select; heights animate .3s. Axis 7a 10a 1p 4p 7p 11p.
- "THE BREAKDOWN": 4 rows (study: noise, outlets, wifi, seats; food: taste, value, wait, portions), 8px green progress bar + value "4.8". Tags below.
- "REVIEWS" / "newest first": cards with 38 serenity avatar initials, @handle, time, score pill, text. Tap avatar/handle → Public Profile.
- Sticky bottom (fade from transparent): "quick rate" outline + "write a review" green (flex 1 : 1.4).

### 7. Quick Rate (bottom sheet)
Scrim `rgba(23,35,29,.38)`, sheet inset 12, r34. Label "QUICK RATE · 5 SEC", spot name 28. Star row in white r22 box, 5 stars at 24px, spaced evenly. "how busy rn?" — 5 equal tiles h68 r16: **16px colored dot** above one-word label (dead/chill/lively/busy/packed, 11.5/500, no wrap); selected = green bg, off-white text. "post it" enabled if a star or a busyness level chosen → toast "logged. you're a real one." Link "got more to say? **write a full review →**" carries stars+busyness into Rate screen. Tap scrim to dismiss.

### 8. Rate a Spot
Header: close × (44 white), "rate a spot" 17/600. Horizontal spot picker chips (selecting resets form). "OVERALL" / "how was {spot}?" 34; 5 stars at 24px + caption (1 nah, 2 meh, 3 solid, 4 really good, 5 elite). "THE DETAILS": 4 category rows with 5 tappable segments (h30 r9; filled green up to value). "HOW BUSY IS IT RN?": 5 busyness chips with dots. "TAGS": spot tags + extras (study: lock-in spot, hidden gem, group friendly, go early; food: worth it, overpriced, hidden gem, go early), multi-select. "ANYTHING ELSE?" textarea (placeholder "the tea, the tips, the best seat…") + dashed "+ add a photo" (88 tall). Sticky "post rating" (disabled label "tap a star to rate" until overall set) → adds to your profile (replaces existing rating for that spot), back, toast "posted. thanks for the intel."

### 9. Leaderboard (tab)
Title "leaderboard." Segmented control (track `rgba(23,35,29,.06)`, active segment white + shadow, green 600): ratings · reviews · spots · streak. Description line (e.g., "spots you've rated, all time"). Scope chips: "all cal poly" / "this week". **Podium**: order 2-1-3; avatars 56 (68 for #1, green), rank badge circle under avatar, @handle, block (heights 92 / 118 / 76; #1 green with off-white text, others white) showing value + unit. **Your rank card**: 1.5px green border, "#7", avatar, "you", "{n} more to pass @handle", value. List of ranks 4+ in white card: rank, avatar, @handle, sub ("+n this week" in green / "cal poly"), value. Tap → public profile.

### 10. Your Profile (tab)
Header: "@handle" 24/600, share + settings (sliders icon) 46 circles. Centered avatar 108 serenity with "TOP RATER" badge (green, 11/600, 3px off-white border). Name 26, major·year 14 grey, bio 15. Stats card: ratings · ★ avg given · followers. Buttons: "edit profile" (outline) + "share profile" (green). "YOUR RATINGS" with chips "all · 6 / eat · 3 / study · 3"; rating cards (tile, name, "rated {date}", score pill, note). Tap → Location.
- **Edit sheet**: cancel / "edit profile" / save (green); avatar + "change photo"; fields name, handle, major · year, bio.
- **Share sheet**: green card with Musty avatar + "musty's map." wordmark, "CAL POLY", user avatar/name/@handle, chips (ratings, avg, "top spot: kennedy lib"). Link row "mustysmap.app/@handle" + "copy" (→ "copied ✓"). "share via…" → native share sheet.

### 11. Public Profile
Serenity header (r0 0 34 34): back + share circles; 84 green avatar with initials, name 26 green, "@handle · major · year". **No follow button.** Stats card (ratings, avg given, followers). "HOW THEY RATE": distribution 5★→1★ bars (green, 10 tall) with counts; divider; "food · 58%" / "study · 42%" split bar. Personality labels (outlined chips). "GO-TO SPOTS" horizontal 150-wide cards (photo 92 + name + "they gave ★ 5"). "RECENT RATINGS" cards.

### 12. Settings
Back, title "settings." Grouped white cards (r22) with uppercase section labels and grey footers:
- **notifications**: allow notifications; mute all ("pause every push. no dings, no buzz."); replies to your reviews; new followers; busy alerts ("ping me when a spot i rated clears out"); sounds; badge app icon. When allow is off or mute all is on, the sub-toggles go to 40% opacity and are disabled. Footer: "you can also manage these in iOS settings → musty's map."
- **location**: location access › "while using"; precise location. Footer: "used to show spots near you. never shown on your profile."
- **privacy**: public profile; show ratings on profile; allow tracking ("measure ads across other apps. off by default." — must map to ATT prompt); blocked users › none; download my data.
- **accessibility**: reduce motion; haptics; text size › system (support Dynamic Type).
- **legal**: terms of service; privacy policy; community guidelines.
- **account**: email › address; change password; **sign out** (red 600); **delete account** (red 600) → centered confirm dialog "delete your account?" / "this permanently wipes your profile, ratings and reviews. no undo." / red "delete forever" / outline "never mind". (In-app account deletion is an App Store requirement.)
- Footer: "musty's map 1.0 (12) · made at cal poly".

Defaults: notifications on, mute off, replies on, follows on, busy alerts off, sounds on, badges on, precise on, public profile on, show ratings on, tracking **off**, reduce motion off, haptics on.

---

## Interactions & Behavior
- Disabled primary buttons stay rendered at 35% opacity; tapping shows validation (red border/message) where relevant.
- Active press: tappable cards scale to .985; FAB and stars scale ~.9–.94.
- Toggle knob slides 20pt, .2s; track color .2s.
- Busyness chart bar height .3s; selected tab/segment color .15s.
- Map selection pans with animation; recenter uses fly-to (.6s).
- Toasts auto-dismiss after 2.2s.
- Respect Reduce Motion (disable pans/scale effects).

## State / Data
- `Spot { id, name, shortName, type: food|study, area, lat, lng, rating, ratingCount, hoursLabel, walkTime, tags[], subScores[4], hourlyBusy[17] (7a–11p, 0–100), photos[] }`
- `Review { spotId, userId, stars, busyLevel?, subScores?, tags[], text, photo?, createdAt }`
- `User { name, handle, majorYear, bio, avatar, ratingCount, avgGiven, followers, ratingDistribution[5], foodPct, labels[] }`
- `Leaderboard { metric: ratings|reviews|spots|streak, scope: all|week, entries[{user, value, rank}], me{rank, value, gapToNext} }`
- Busyness: aggregate live check-ins from ratings/quick rates in the current hour; historical curve per weekday per hour.
- Auth: email + password with `.edu` verification code (6 digits); restrict to `@calpoly.edu`.
- Prototype data lives in `CampusApp.dc.html` (`LOCS`, `REV`, `USERS`, `MINE`, `LBP`/`LBV`) — sample content only.

## Assets
- **Musty mascot** (mustang): not included. The prototype uses a drop-in placeholder (`image-slot`, id `musty-icon`) shown on intro (250), map header (46), feed header (42), share card (32). Supply a transparent PNG/SVG.
- Location photos: placeholders (striped). Supply real photos.
- Icons: simple 1.8–2.2 stroke line icons (map, feed, trophy, person, search, share, back, close, sliders). Use SF Symbols equivalents: `map`, `list.bullet.rectangle`, `trophy`, `person`, `magnifyingglass`, `square.and.arrow.up`, `chevron.left`, `xmark`, `slider.horizontal.3`, `location.north`.
- Map tiles in prototype: Esri World Street Map (reference only). Use MapKit.

## Files
- `Campus App Screens.dc.html` — overview canvas of all screens (open this first).
- `CampusApp.dc.html` — the full interactive prototype; all markup (inline styles = exact values) + behavior/data in the script class.
- `Musty Map Deck.dc.html` — presentation deck of the screens.
- `support.js`, `image-slot.js`, `deck-stage.js` — runtime needed to open the HTML files locally (not part of the product).
