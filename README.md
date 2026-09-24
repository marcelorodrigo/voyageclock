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

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
