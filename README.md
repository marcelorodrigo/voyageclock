# VoyageClock

VoyageClock creates a conservative, day-by-day sleep and timezone adaptation plan for generally healthy adult travelers. Enter local departure and arrival times, home and destination timezones, and your typical sleep schedule to receive preparation, arrival-day, and next-day guidance.

Plans favor gradual schedule adjustments, protect usual sleep opportunity, and avoid precise light seek/avoid windows when biological circadian timing cannot be estimated from the available inputs. Caffeine timing is optional. The planner is deterministic and runs in the browser; trip data is not saved or sent to a server.

The **The science** page explains the research and limitations behind the guidance. VoyageClock provides general wellness information, not medical advice, diagnosis, medication dosing, or a guarantee of jet lag prevention.

## Setup

Install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Tests

Run the Vitest unit suite for timezone conversion, validation, guidance, plan generation, and domain errors:

```bash
pnpm test:unit
```

Run Nuxt functional tests with happy-dom for the form, plan timeline, pages, and traveler-facing validation:

```bash
pnpm test:nuxt
```

## Production

Generate the production SPA as static files:

```bash
pnpm build
```

The generated site is written to `.output/public`. Deploy the contents of this directory to a static host; a Nuxt application server is not required at runtime. `pnpm generate` runs the same static generation command.

Set `NUXT_SITE_URL` to the canonical public URL when generating the production site (for example, `https://voyageclock.example`). If it is not set, Nuxt uses `http://localhost:3000`, the default local host and port, for site metadata and the generated sitemap.

Configure the host to serve the SPA entry point for client-side routes such as `/plan` and `/science` on direct visits and refreshes. Nuxt generates a `200.html` fallback for this purpose; the exact rewrite or fallback configuration depends on the host.

Because this is a client-rendered SPA, page-specific metadata is set in the browser rather than included in prerendered route HTML, and the app does not receive the SEO benefits of server-rendered pages.

Locally preview the generated site:

```bash
pnpm preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
