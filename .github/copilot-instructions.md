# Voyage Clock - AI Coding Assistant Instructions

## Project Overview

Voyage Clock is a Nuxt 3 + Vue 3 Composition API application that generates personalized, science-based jet lag adaptation plans for travelers. The core algorithm ([jetlagAlgorithm.ts](../app/utils/jetlagAlgorithm.ts)) calculates optimal light exposure, sleep timing, and supplementation schedules based on timezone differences and travel direction.

## Tech Stack & Architecture

- **Framework**: Nuxt 4 (Vue 3 Composition API + TypeScript + auto-imports)
- **State Management**: Pinia store ([travelStore.ts](../app/stores/travelStore.ts)) manages form data, validation, and generated plans
- **Styling**: TailwindCSS v4 with Vite plugin (scoped styles in components, utility classes in templates)
- **Build Tool**: pnpm + Vite

## Key Architectural Patterns

### 1. Form Flow & State Management

The travel plan generation follows this flow:

1. User fills form at [/plan](../app/pages/plan/index.vue) → updates `travelStore.formData`
2. Form validation happens per-field via `updateField()` and `validateField()` methods
3. Submit triggers `generateAndSavePlan()` → computes `timezoneOffset` → calls `generateTravelPlan()`
4. Store sets `travelPlan` state → router pushes to [/plan/results](../app/pages/plan/results.vue)
5. Results page displays plan via [RecommendationsPlan.vue](../app/components/recommendations/RecommendationsPlan.vue)

**Critical**: Always compute `timezoneOffset` using [timezoneService.ts](../app/utils/timezoneService.ts) before passing to algorithm - the algorithm uses this for east/west direction and adjustment calculations.

### 2. Algorithm Design ([jetlagAlgorithm.ts](../app/utils/jetlagAlgorithm.ts))

The core logic is based on circadian rhythm research with these principles:

- **Eastward travel** (positive offset): Harder to adapt, requires advancing sleep schedule
- **Westward travel** (negative offset): Easier to adapt, requires delaying sleep schedule
- **Key constants**: `MAX_PRE_TRAVEL_DAYS = 7`, `LIGHT_EXPOSURE_DURATION = 2hrs`, `MELATONIN_THRESHOLD = 3hrs`
- **Adjustment rate**: 1-1.5 hours per day
- Returns structured `TravelPlan` with `preTravel[]`, `travelDay`, and `postArrival[]` recommendations

When modifying recommendations, reference scientific principles in comments and maintain the existing constants unless explicitly updating based on new research.

### 3. Type System ([types/travel.ts](../app/types/travel.ts))

All domain types are defined here:

- `TravelPlan`: Complete plan with input data, calculations, and recommendations arrays
- `DailyRecommendation`: Per-day guidance with nested objects for sleep, light, exercise, caffeine, melatonin, meals
- `TimeWindow`: Time ranges with `start`/`end` (HH:mm format) and `priority` levels
- `TravelFormData`: User input from form (all fields are strings for form binding)

Always use these types for type safety. Form data uses strings (HH:mm, ISO dates) while plan uses Date objects and numbers.

### 4. Component Organization

- **Pages** ([app/pages/](../app/pages/)): Route components, minimal logic, delegate to child components
- **Components**:
  - `forms/`: Reusable form inputs with validation, error display, and v-model binding
  - `recommendations/`: Display plan data (read-only, takes plan as prop)
  - `education/`: Educational content layout (coming soon)
- **Utilities** ([app/utils/](../app/utils/)): Pure functions for dates, timezones, and algorithms

### 5. Styling Conventions

- Use Tailwind utility classes in templates for layout/spacing (`flex`, `grid`, `p-4`, `mb-2`)
- Scoped `<style>` blocks for component-specific styles (animations, complex states, print media queries)
- Color scheme: Blue primary (`blue-600`, `blue-700`), gray neutrals, gradient backgrounds (`from-blue-50 via-indigo-50 to-purple-50`)
- Responsive: mobile-first, use `md:` and `lg:` breakpoints

Example from [RecommendationsPlan.vue](../app/components/recommendations/RecommendationsPlan.vue):

```vue
<div class="max-w-7xl mx-auto px-4">  <!-- Tailwind utilities -->
  <button @click="printPlan" class="btn btn-outline">  <!-- Scoped class -->
```

## Development Workflows

### Running the App

```bash
pnpm install      # First time setup
pnpm dev          # Start dev server (auto-opens http://localhost:3000)
pnpm build        # Production build
pnpm generate     # Static site generation
pnpm preview      # Preview production build locally
```

### Testing (per README)

- Unit tests: `pnpm test:unit` (Vitest)
- E2E tests: `pnpm test:e2e` (Playwright - must run `pnpm build` first)
- Linting: `pnpm lint` (ESLint)

**Note**: The README mentions testing commands but test files are not visible in the workspace yet.

### Auto-imports (Nuxt 4)

Vue APIs, Nuxt composables, and components are auto-imported:

- No need to import `ref`, `computed`, `defineStore`, `useRouter`, etc.
- Components in `~/components/` are globally available
- Use `~/` alias for imports (resolves to `app/` directory)

Example:

```typescript
// ✅ Correct (auto-imported)
const travelStore = useTravelStore();
const router = useRouter();

// ❌ Wrong (don't explicitly import)
import { ref } from "vue";
import { useRouter } from "vue-router";
```

## Project-Specific Conventions

### Date/Time Handling

- Always use [dateTimeUtils.ts](../app/utils/dateTimeUtils.ts) for date operations (`parseTime`, `formatTime`, `addDays`)
- Form inputs use strings (`"23:00"`, `"2025-01-15"`), convert to Date objects in store/algorithm
- Timezone-aware calculations use [timezoneService.ts](../app/utils/timezoneService.ts) with IANA identifiers

### Timezone Service

- `getCurrentTimezone()`: Auto-detect user's timezone (used as form default)
- `calculateTimezoneOffset()`: Returns hour difference between two timezones at a specific date
- `getTravelDirection()`: Derives 'east'/'west' from offset sign (positive = east)
- Timezone options in [timezoneService.ts](../app/utils/timezoneService.ts) are hand-curated (not exhaustive IANA list)

### Pinia Store Patterns

[travelStore.ts](../app/stores/travelStore.ts) demonstrates the standard pattern:

- `ref()` for state, `computed()` for derived values
- Actions return void (mutate state directly)
- Validation per-field, stores errors in `errors` ref with matching keys
- `touched` ref tracks user interaction for error display timing

### Navigation & Routing

- Marketing pages: `/` (home), `/learn/*` (educational content)
- Planning flow: `/plan` (form) → `/plan/results` (generated plan)
- Use `router.push({ name: 'plan-input' })` for named routes
- Results page redirects to form if no plan exists (guard in `onMounted`)

## Common Tasks

### Adding a New Form Field

1. Add to `TravelFormData` type in [types/travel.ts](../app/types/travel.ts)
2. Initialize in `formData` ref in [travelStore.ts](../app/stores/travelStore.ts)
3. Add validation case in `validateField()` switch statement
4. Add form input component in [TravelInputForm.vue](../app/components/forms/TravelInputForm.vue)
5. Update algorithm if the field affects calculations

### Modifying Recommendations

1. Adjust constants at top of [jetlagAlgorithm.ts](../app/utils/jetlagAlgorithm.ts)
2. Modify generation functions: `generatePreTravelRecommendations()`, `generateTravelDayRecommendations()`, or `generatePostArrivalRecommendations()`
3. Update `DailyRecommendation` or `TravelDayRecommendation` types if structure changes
4. Ensure display components in [components/recommendations/](../app/components/recommendations/) handle new fields

### Creating Educational Content

Follow pattern from [learn/index.vue](../app/pages/learn/index.vue):

- Use `EducationLayout.vue` for consistent styling (component exists but not examined yet)
- Add topic card to grid in [learn/index.vue](../app/pages/learn/index.vue)
- Create new page in [pages/learn/](../app/pages/learn/) directory
- Use `useSeoMeta()` and `useHead()` for SEO metadata

## Critical Files Reference

- [jetlagAlgorithm.ts](../app/utils/jetlagAlgorithm.ts) - Core business logic, scientifically-based constants
- [travelStore.ts](../app/stores/travelStore.ts) - Single source of truth for app state
- [types/travel.ts](../app/types/travel.ts) - All domain types, keep in sync with algorithm output
- [timezoneService.ts](../app/utils/timezoneService.ts) - Timezone calculations, must be accurate for algorithm
- [RecommendationsPlan.vue](../app/components/recommendations/RecommendationsPlan.vue) - Main results display, orchestrates all recommendation components
