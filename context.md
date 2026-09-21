# Musty's Map — Planning

iOS app for Cal Poly students to crowdsource crowd levels, wait times, and free food across campus.

## Core Concept

- Map of major campus locations (1901, Kennedy Library, campus dining, study spaces)
- Users self-report busyness, wait time, and open study spots
- Map pins show live status at a glance
- Free food events surfaced as they're reported

---

## Must Have

**Map**
- Campus map centered on Cal Poly with pins for each tracked location
- Pin color/icon reflects current status (e.g. green / yellow / red)
- Tap pin → detail sheet with current status + recent reports

**Reporting**
- Submit a report in under 15 seconds (busyness level, wait time, study spots open)
- Reports timestamped; status decays to "unknown" after N minutes
- One report per user per location per cooldown window

**Locations**
- Hardcoded starting list of ~15–25 major campus spots
- Categories: dining, study, other

**Accounts**
- Some form of identity to prevent spam (decide below)

**Backend**
- Store locations, reports, aggregated status
- Read path fast enough for map load on open

---

## Nice to Have

- Free food feed — separate tab/filter for active free food reports
- Photo attached to a report (line length, food spread)
- Push notifications for free food near you
- Historical patterns ("usually busy at 12pm Tue")
- Search / filter map by category or "has open seats"
- Report upvote/downvote for accuracy
- Favorites list for frequently checked locations
- Dining hours + closed state shown on pins
- Basic moderation / report-a-report flow

---

## Stretch Goals

- Android version
- Apple Watch / widget / Live Activity showing nearest spot status
- Geofencing — auto-prompt a report when you leave a tracked location
- Predictive busyness model from historical data
- Official Cal Poly dining API or POS integration for real wait times
- Gamification: leaderboard, points, badges for reporters
- Expansion to other campuses
- Anonymous passive crowd sensing (opt-in)

---

## Open Decisions

| Decision | Options | Owner | Due |
|---|---|---|---|
| Auth model | Anonymous device ID / Sign in with Apple / Cal Poly email required | | |
| Backend | Firebase / Supabase / custom | | |
| UI framework | SwiftUI / UIKit | | |
| Map SDK | MapKit / Mapbox / Google Maps | | |
| Status decay window | 30 min? 60 min? per-category? | | |
| Busyness scale | 3-level / 5-level / percent-full | | |
| Cold start problem | How do we get enough reports on day one? | | |
| Location list source | Manual / admin-editable / user-submitted | | |
| Moderation | None at launch / flag-based / manual review | | |

---

## Risks

- **Cold start** — empty map has no value; need critical mass of reporters
- **Report accuracy** — trolls or stale data make the app untrustworthy
- **Retention** — is this a daily-use app or once-a-week?
- **Campus/legal** — using Cal Poly name, branding, or location data
- **Team capacity** — scope must fit the timeline

---

## Rough Milestones

1. Decisions locked (table above)
2. Map + static locations, no data
3. Report submission + live status end to end
4. Free food + polish
5. TestFlight with a small group of students
6. Iterate on feedback → submit

---

## Success Metrics

- Reports per day
- % of tracked locations with fresh status during peak hours
- Weekly active users
- Repeat reporters


---

See [REUSE.md](REUSE.md) for what we can port from the Sensly hackathon project (`~/KiroHackathon`).
