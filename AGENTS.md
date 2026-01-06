# AI Coding Agent Guide for Voyage Clock

This document provides AI coding assistants with a concise knowledge base for productive development in the Voyage Clock codebase.

---

## Project Architecture (Big Picture)
- **Stack:** Nuxt 4 (Vue 3 Composition API, TypeScript), Pinia, TailwindCSS v4, Vite, pnpm.
- **Purpose:** Generate science-based, personalized jet lag adaptation plans.
- **Data Flow:**
  - `/plan` form ➔ `travelStore` (Pinia) ➔ [timezoneService.ts](app/utils/timezoneService.ts) for timezones/direction ➔ [jetlagAlgorithm.ts](app/utils/jetlagAlgorithm.ts) ➔ structured recommendations appear in `/plan/results`.
- **Key Components:**
  - [jetlagAlgorithm.ts](app/utils/jetlagAlgorithm.ts): Jet lag logic and plan generation (scientific constants, "east/west" handling).
  - [travelStore.ts](app/stores/travelStore.ts): All form state, validation, triggering of plan generation.
  - [RecommendationsPlan.vue](app/components/recommendations/RecommendationsPlan.vue): Main results display, orchestrates Daily/TravelDay timelines.
  - [types/travel.ts](app/types/travel.ts): Source of truth for domain types: `TravelPlan`, `DailyRecommendation`, etc.
  - [timezoneService.ts](app/utils/timezoneService.ts): Handles timezone math, direction, user timezone.

## Critical Developer Workflows
- **Install & Build:**
  - `pnpm install` (always use pnpm)
  - `pnpm dev`: Starts dev server (`http://localhost:3000`)
  - `pnpm build`: Production build; `pnpm preview`: Preview prod build; `pnpm generate`: Static site output
- **Testing:**
  - `pnpm test:unit`: Unit tests (Vitest)
  - `pnpm test:e2e`: E2E tests (Playwright, run `pnpm build` first)
  - `pnpm lint`: Linting (ESLint)
- **Debugging:**
  - Use browser DevTools for UI logic.
  - Algorithm/debugging: Set breakpoints in TS files; main logic in jetlagAlgorithm, travelStore.
- **Hot reload works via Vite; component/utility changes are instant.**

## Project-Specific Conventions
- **Auto-imports:**
  - Vue APIs & Nuxt composables are auto-imported. Don't import `ref`, `useRouter`, etc. Use `~/` alias for `app/`.
  - All components in `components/` are globally available—no imports/exports needed.
- **Forms:**
  - Single source of truth is `travelStore.formData`; changes go through `updateField()`. Validation errors in `errors`, use per-field validation; `touched` for error display.
- **Timezones:**
  - Use [timezoneService.ts](app/utils/timezoneService.ts) for *all* timezone math & direction. Never re-implement offset math or direction.
  - User's timezone defaults from `getCurrentTimezone()`.
- **Algorithm/Plan-Generation:**
  - Always pass correct `timezoneOffset` (hours, positive=east, negative=west) to `generateTravelPlan()`.
  - Constants for science: update only with scientific justification.
- **Styling:**
  - Use Tailwind utility classes directly in templates; use scoped `<style>` for custom rules/animations. Mobile-first layout.

## Integration & Communication Patterns
- **Component boundaries:**
  - "pages/": route entrypoints, minimal logic; delegate to child components.
  - "forms/": all form elements reusable; "recommendations/": read-only output of plans.
- **Types:**
  - Edit domain types in one place: [`app/types/travel.ts`](app/types/travel.ts). All algorithm/store/component logic must match here.
- **Educational Content:**
  - Pattern: new Vue file in `pages/learn/`, use `EducationLayout.vue`.

## Concrete Examples
- **Add a Form Field:**
  - Update `TravelFormData` (types), initialize in `formData` (store), add to `TravelInputForm.vue`, update algorithm/types as needed, ensure results display.
- **Modify Jet lag Algorithm:**
  - Edit constants at top of `jetlagAlgorithm.ts`, update generation functions for plan structure, update types and UI bindings as needed.

## File Reference Quicklinks
- `/app/utils/jetlagAlgorithm.ts` — plan generation/logic
- `/app/stores/travelStore.ts` — state & validation
- `/app/types/travel.ts` — data structures
- `/app/utils/timezoneService.ts` — all timezone math
- `/app/components/recommendations/RecommendationsPlan.vue` — display logic

---

## Required Linting Step

After every change or implementation, you must run ESLint to check for formatting and issues:

```
pnpm lint
```

Resolve any reported problems before considering the change complete. This ensures code quality and consistency across the project.

---

**For AI agents:** Always ensure all changes conform to the domain types, and use the developer workflows above. When in doubt, reference the specific critical files above for the current project patterns.
