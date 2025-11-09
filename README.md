# Voyage Clock

Voyage Clock helps travelers adapt to new time zones with personalized, science-based plans to minimize jet lag and accelerate circadian rhythm adjustment.

## Features

- **Personalized Jet Lag Plans**: Enter your travel details and usual sleep schedule to receive a tailored adaptation plan.
- **Smart Recommendations**: Get daily guidance on light exposure, sleep timing, exercise, caffeine, and melatonin use, based on circadian science.
- **Visual Timelines**: See your adaptation plan as an intuitive, color-coded timeline for each phase of your journey (pre-travel, travel day, post-arrival).
- **Travel Direction Awareness**: Recommendations adapt to eastward or westward travel for optimal adjustment.
- **Responsive & Mobile-Friendly**: Access your plan on any device, with print-friendly options for on-the-go reference.
- **Educational Content**: Learn about circadian rhythms, jet lag, and the science behind each recommendation (coming soon).

## How It Works

1. **Input Your Trip**: Select your home and destination time zones, departure date/time, and usual sleep schedule.
2. **Get Your Plan**: Instantly receive a step-by-step adaptation schedule, including when to seek or avoid light, adjust sleep, exercise, and more.
3. **Follow Daily Guidance**: Use the timeline and daily cards to stay on track before, during, and after your trip.

## Who Is It For?

- **Business travelers**: Be productive right after arrival.
- **Vacationers**: Maximize your time and energy on holiday.
- **Frequent flyers**: Quickly generate plans for recurring routes.
- **Health-conscious travelers**: Trust evidence-based advice.
- **Mobile users**: Access your plan anywhere, anytime.
- **People with sleep issues**: Customize recommendations for your needs.

## Example Recommendations

- Gradually shift your sleep schedule before departure
- Seek morning or evening light depending on travel direction
- Adjust caffeine and melatonin timing
- In-flight sleep and meal strategies
- Post-arrival light exposure and activity tips

## Technical Details

**Frontend**: Vue 3 (Composition API), TypeScript, Pinia, Vue Router, TailwindCSS, Vite

**Testing**: Vitest (unit), Playwright (e2e)

---

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

