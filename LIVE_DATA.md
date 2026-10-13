# Live data and deployment

- Product Hunt: server-only `PRODUCTHUNT_TOKEN`. The route queries the official GraphQL API without a response cache, including direct slug lookup. No sample fallback. The feed is paginated; filters operate on fetched pages. Price, technology stack and architecture are not inferred from votes.
- GitHub: public search through `/api/github`, using server-only `GITHUB_TOKEN` when configured. Exact zero-result searches stay empty; failures show unavailable. Repository metadata is live, not growth history or code-quality assessment. Best-match ordering comes from GitHub. The UI's activity view sorts by update time, not measured trending growth.
- News: source feeds cached for up to five minutes. Failed refreshes do not substitute demo articles. Feed aggregation is not a complete news archive; old deep links may no longer be available.
- Open feed pages recheck every five minutes while visible and when the tab becomes visible. This is not background phone push.
- YC: individual profiles fetch their public YC page when opened and every five minutes while visible. The shared directory/analytics dataset refresh workflow runs every six hours on the default GitHub branch. It validates identity, status and batch, and never guesses funding, team size or unicorn tags. It refreshes existing companies; discovering newly added YC companies is not implemented.
- Failed/renamed identities are retained in `allStartups` for investigation, but never-verified entries are excluded from `startups`. Previously checked profiles retain their original timestamp on a failed recheck. Freshness notice exposes age; timestamps mean the source was checked, not that YC independently verified every field.

## Operations

1. Set `PRODUCTHUNT_TOKEN` and optionally `GITHUB_TOKEN` in hosting server environment variables. Never use `NEXT_PUBLIC_` for server credentials.
2. Enable GitHub Actions with content-write permission. The workflow runs only after this code reaches the default branch. Scheduled jobs may be delayed by GitHub; inspect run failures.
3. Ensure the hosting Git integration rebuilds from default-branch dataset commits. Without a successful deployment, the directory still contains the prior build's snapshot.
4. Manual refresh: `node backend/ycscrapping/refresh-verified.cjs`. It preserves the existing file if over 30% fail validation. Run TypeScript/build checks before publishing.

No external API can guarantee uninterrupted, instant updates. Source failures are exposed rather than labeled current. Source coverage, credentials, rate limits, scheduler availability and deployment health remain operational dependencies.

## Notification design (not activated)

Use server-side scheduling and native push (FCM/APNs for the Capacitor app), not an in-tab timer. Persist device consent/tokens, timezone, quiet hours, frequency and topic/source preferences. Rotate YC/GitHub/Product Hunt/news, rank by relevance and freshness, deduplicate per device, expire queued items, and skip unavailable sources. Default to a few notifications daily with an optional hourly mode. Include a factual one-line summary and an exact internal deep link, with an original-source fallback for expired articles. Token revocation, retries, delivery telemetry and user opt-out are required before launch. No notification permissions, registrations or messages are created by the current implementation.
