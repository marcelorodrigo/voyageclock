# Voyage Clock - Project Plan

## Project Overview

**Voyage Clock** is a web application designed to help travelers adapt to new time zones by providing personalized routine adjustments. The application generates science-based recommendations to minimize jet lag and accelerate circadian rhythm adaptation.

### Core Problem
Jet lag occurs when traveling across time zones, causing misalignment between the body's internal clock and the destination's local time. This results in fatigue, poor sleep, reduced cognitive performance, and digestive issues.

### Solution
Provide users with a personalized adaptation plan that includes:
- Light exposure timing (seeking/avoiding)
- Sleep schedule adjustments (gradual shifting)
- Wake time recommendations
- Exercise timing and intensity
- Caffeine intake guidance
- Melatonin supplementation advice
- Other evidence-based strategies

---

## Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: TailwindCSS 4.x
- **Build Tool**: Vite (full client-side)
- **Testing**: Vitest (unit), Playwright (e2e)


---

## Features Breakdown

### Phase 1: MVP (Minimum Viable Product)

#### 1.1 User Input Form
**Priority**: High  
**Description**: Collect essential information from users

**Input Fields**:
- Current timezone (auto-detect with manual override): where the user can select their home timezone.
- Destination timezone (that cannot be the same as the current timezone)
- Departure date and time
- Number of days at destination
- Current sleep schedule:
  - Usual bedtime
  - Usual wake time
  - Sleep duration (automatically calculated from bedtime/wake time)
- Travel direction awareness (East vs West, which is automatically calculated from timezones)

**Technical Implementation**:
- Create `TravelInputForm.vue` component
- Use Pinia store for form state (`useTravelStore`)
- Timezone selection using native `Intl.DateTimeFormat`
- Date/time pickers with proper validation
- Form validation with clear error messages

#### 1.2 Algorithm Engine
**Priority**: High  
**Description**: Core logic for generating adaptation recommendations

**Algorithm Considerations**:
- Calculate timezone difference (hours)
- Determine travel direction (eastward/westward)
- Days before departure to start adjustment
- Rate of circadian shift (typically 1-1.5 hours per day)
- Pre-travel adjustment recommendations
- During-flight recommendations
- Post-arrival recommendations

**Technical Implementation**:
- Create `src/services/jetlagAlgorithm.ts`
- Pure functions for calculations (easily testable)
- Consider scientific research:
  - Light exposure is most powerful zeitgeber
  - Eastward travel is harder to adjust to
  - Exercise timing affects circadian rhythm
  - Meal timing can help entrainment

**Research References**:
- NASA Jet Lag Calculator methodology
- Circadian rhythm research
- Light therapy studies

#### 1.3 Recommendations Display
**Priority**: High  
**Description**: Present personalized adaptation plan in an intuitive format

**Display Sections**:
1. **Overview Card**
   - Timezone change summary
   - Travel direction
   - Estimated adjustment period
   - Difficulty level indicator

2. **Pre-Travel Phase** (3-7 days before)
   - Daily timeline showing:
     - Recommended sleep/wake times
     - Light exposure windows
     - Light avoidance periods
     - Exercise timing
     - Caffeine timing
     - Melatonin timing (if applicable)

3. **Travel Day**
   - In-flight recommendations
   - Sleep strategy during flight
   - Meal timing
   - Hydration reminders
   - Movement/stretching suggestions

4. **Post-Arrival Phase** (First 3-5 days)
   - Daily adjustment schedule
   - Critical light exposure times
   - Sleep consolidation strategies
   - Activity recommendations

**Technical Implementation**:
- Create `RecommendationsPlan.vue` component
- Create sub-components:
  - `OverviewCard.vue`
  - `DailyTimeline.vue`
  - `RecommendationCard.vue`
  - `ProgressIndicator.vue`
- Use TailwindCSS for responsive design
- Timeline visualization with clear visual hierarchy
- Print-friendly CSS for physical reference

#### 1.4 Timeline Visualization
**Priority**: Medium  
**Description**: Visual representation of the adjustment schedule

**Features**:
- Day-by-day breakdown
- Color-coded activities:
  - 🌞 Light exposure (yellow/orange)
  - 🌑 Light avoidance (dark blue/gray)
  - 😴 Sleep periods (blue)
  - 🏃 Exercise (green)
  - ☕ Caffeine (brown)
  - 💊 Melatonin (purple)
- Time axis showing both home and destination times
- Current day indicator (if plan is active)
- Calendar view is a plus

**Technical Implementation**:
- Create `TimelineVisualization.vue`
- Consider using calendar library
- Responsive design for mobile viewing
- Smart scroll for multi-day view considering mobile and desktop experiences

---


### 2 Educational Content
**Priority**: Low  
**Description**: Help users understand the science

**Features**:
- About circadian rhythms
- How jet lag works
- Explanation of each recommendation
- FAQ section
- Tips and best practices
- Scientific references

**Technical Implementation**:
- Create `EducationPage.vue`
- Markdown content rendering
- Interactive diagrams
- Expandable sections for details



## Data Models

### Travel Plan
```typescript
interface TravelPlan {
  id: string;
  userId?: string;
  createdAt: Date;
  
  // Input data
  homeTimezone: string;
  destinationTimezone: string;
  departureDate: Date;
  returnDate?: Date;
  
  // Sleep schedule
  currentBedtime: string; // HH:mm format
  currentWakeTime: string;
  currentSleepDuration: number; // hours
  
  // Calculated data
  timezoneOffset: number; // hours
  travelDirection: 'east' | 'west';
  adjustmentDays: number;
  
  // Recommendations
  preTravel: DailyRecommendation[];
  travelDay: TravelDayRecommendation;
  postArrival: DailyRecommendation[];
}
```

### Daily Recommendation
```typescript
interface DailyRecommendation {
  date: Date;
  dayNumber: number; // Relative to departure
  
  sleep: {
    bedtime: string;
    wakeTime: string;
    duration: number;
    notes?: string;
  };
  
  lightExposure: TimeWindow[];
  lightAvoidance: TimeWindow[];
  
  exercise?: {
    timing: TimeWindow;
    intensity: 'low' | 'moderate' | 'high';
    notes?: string;
  };
  
  caffeine?: {
    allowedUntil: string;
    recommendations?: string;
  };
  
  melatonin?: {
    timing: string;
    dosage?: string;
    notes?: string;
  };
  
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    notes?: string;
  };
  
  generalNotes?: string[];
}
```

### Time Window
```typescript
interface TimeWindow {
  start: string; // HH:mm format
  end: string;
  priority: 'critical' | 'recommended' | 'optional';
  notes?: string;
}
```

---

## Algorithm Pseudocode

### Main Calculation Flow

```
1. Calculate timezone offset
   offset = destinationTZ - homeTZ (in hours)
   
2. Determine travel direction
   direction = offset > 0 ? 'east' : 'west'
   
3. Calculate adjustment days needed
   Pre-travel: min(7, abs(offset) / shiftRate)
   Post-arrival: abs(offset) / shiftRate
   
4. Generate pre-travel recommendations
   For each day before departure:
     - Shift sleep time gradually
     - Calculate light exposure windows
     - Determine exercise timing
     - Set caffeine cutoff
     - Add melatonin if needed
     
5. Generate travel day recommendations
   - Optimal sleep timing during flight
   - Light exposure on plane
   - Meal timing strategy
   - Hydration goals
   
6. Generate post-arrival recommendations
   For each day after arrival:
     - Continue sleep schedule adjustment
     - Critical light exposure times
     - Activity recommendations
     - Consolidation strategies
```

### Light Exposure Algorithm

```
Key principles:
- Light is the strongest circadian signal
- Morning light advances the clock (helps for westward)
- Evening light delays the clock (helps for eastward)
- Avoid light at wrong times can be as important as seeking it

For Eastward Travel (need to shift earlier):
- Pre-travel: Seek morning light, avoid evening light
- Post-arrival: Seek bright light in destination morning
- Avoid afternoon light initially

For Westward Travel (need to shift later):
- Pre-travel: Seek evening light, avoid morning light
- Post-arrival: Seek bright light in destination evening
- Avoid early morning light initially
```

---

## User Stories

### Core User Stories

1. **As a business traveler**, I want to minimize jet lag so that I can be productive in meetings immediately after arriving.

2. **As a vacation traveler**, I want to adjust quickly to my destination so I don't waste vacation days feeling tired.

3. **As a frequent flyer**, I want to save my preferences so I can quickly generate new plans for recurring routes.

4. **As a health-conscious traveler**, I want science-based recommendations so I can trust the advice I'm following.

5. **As a mobile user**, I want to access my plan on my phone so I can check recommendations throughout the day.

6. **As someone with sleep issues**, I want to customize recommendations based on my constraints so the plan is realistic for me.

---

## UI/UX Considerations

### Design Principles
- **Simplicity**: Clear, uncluttered interface
- **Actionable**: Every screen has a clear next step
- **Trustworthy**: Show scientific basis for recommendations
- **Accessible**: WCAG 2.1 AA compliance minimum
- **Mobile-first**: Primary use case is mobile device

### Key Screens

1. **Landing Page**
   - Clear value proposition
   - Quick start button
   - Example/demo
   - Brief explanation

2. **Input Form**
   - Progressive disclosure
   - Auto-detection where possible
   - Clear labels and help text
   - Real-time validation

3. **Plan Overview**
   - Summary card at top
   - Expandable daily sections
   - Print/share options
   - Edit button to modify inputs

4. **Daily View**
   - Today's recommendations highlighted
   - Checklist format
   - Mark items as complete
   - Quick access to tomorrow

5. **Settings/Profile**
   - Saved preferences
   - Notification settings
   - Account management
   - About/FAQ

### Color Scheme
- **Primary**: Blue (trust, calm, sky)
- **Secondary**: Orange (energy, sunrise/sunset)
- **Accents**: 
  - Yellow (light/sun)
  - Dark blue (night/darkness)
  - Green (exercise/health)
  - Purple (rest/recovery)

---

## Testing Strategy

### Unit Tests
- Algorithm calculations
- Timezone conversions
- Date/time utilities
- Form validation logic
- Store actions and getters

### Component Tests
- Form components
- Recommendation display
- Timeline visualization
- Interactive elements

### E2E Tests
Priority user flows:
1. Complete input form and generate plan
2. View and navigate through recommendations
3. Edit plan inputs and regenerate
4. Save and retrieve plan (when auth added)

### Manual Testing Checklist
- [ ] Various timezone combinations
- [ ] Edge cases (e.g., crossing date line)
- [ ] Extreme time differences (e.g., 12+ hours)
- [ ] Same-day travel
- [ ] Short trips (1-2 days)
- [ ] Mobile responsiveness
- [ ] Different browsers
- [ ] Accessibility (keyboard navigation, screen readers)

---

## File Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── TravelInputForm.vue
│   │   ├── TimezoneSelector.vue
│   │   ├── DateTimePicker.vue
│   │   └── SleepScheduleInput.vue
│   ├── recommendations/
│   │   ├── RecommendationsPlan.vue
│   │   ├── OverviewCard.vue
│   │   ├── DailyTimeline.vue
│   │   ├── RecommendationCard.vue
│   │   └── TimelineVisualization.vue
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   └── education/
│       ├── FAQSection.vue
│       ├── ScienceExplainer.vue
│       └── TipsCard.vue
├── views/
│   ├── HomeView.vue
│   ├── PlanInputView.vue
│   ├── PlanResultsView.vue
│   ├── EducationView.vue
│   └── SettingsView.vue
├── stores/
│   ├── travelStore.ts
│   ├── userStore.ts
│   └── notificationStore.ts
├── services/
│   ├── jetlagAlgorithm.ts
│   ├── timezoneService.ts
│   ├── dateTimeUtils.ts
│   └── storageService.ts
├── types/
│   ├── travel.ts
│   ├── recommendations.ts
│   └── user.ts
├── composables/
│   ├── useTimeZone.ts
│   ├── useDateTime.ts
│   └── useRecommendations.ts
└── __tests__/
    ├── unit/
    │   ├── jetlagAlgorithm.spec.ts
    │   ├── timezoneService.spec.ts
    │   └── dateTimeUtils.spec.ts
    └── components/
        ├── TravelInputForm.spec.ts
        └── RecommendationsPlan.spec.ts
```

---

## Development Milestones

### Milestone 1: Foundation (Week 1-2)
- [ ] Set up project structure
- [ ] Create type definitions
- [ ] Build core algorithm (v1)
- [ ] Unit tests for algorithm
- [ ] Documentation

### Milestone 2: Basic UI (Week 3-4)
- [ ] Landing page
- [ ] Input form components
- [ ] Basic form validation
- [ ] Responsive layout with TailwindCSS
- [ ] Component tests

### Milestone 3: Recommendations Display (Week 5-6)
- [ ] Plan overview component
- [ ] Daily recommendations layout
- [ ] Timeline visualization
- [ ] Print-friendly styling
- [ ] Integration tests

### Milestone 4: Polish & Launch MVP (Week 7-8)
- [ ] Refine algorithm based on testing
- [ ] Error handling
- [ ] Loading states
- [ ] Accessibility audit
- [ ] Browser testing
- [ ] E2E tests
- [ ] Deploy to production
- [ ] Documentation and help content

### Milestone 5: Enhanced Features (Week 9-12)
- [ ] Local storage for saving plans
- [ ] Share functionality
- [ ] Educational content
- [ ] Advanced customization options
- [ ] Performance optimization

### Future Milestones
- User accounts and backend API
- Notifications system
- PWA capabilities
- Mobile app
- Wearable integration

---

## Research & Resources

### Scientific Foundation
- [NASA Jet Lag Tool](https://www.nasa.gov/humans-in-space/prepare-for-landing-reducing-the-effects-of-long-duration-space-flight-on-crew-performance-and-health/)
- Jet Lag Rooster app methodology
- Circadian rhythm research papers
- Sleep medicine guidelines

### Technical Resources
- Vue 3 Composition API documentation
- TypeScript best practices
- TailwindCSS utility-first approach
- Pinia state management patterns
- Date/time handling with Temporal API (future)

### Design Inspiration
- Health and wellness apps
- Travel planning tools
- Timeline interfaces
- Calendar applications

---

## Success Metrics

### MVP Phase
- User completes input form successfully
- Plan is generated without errors
- Recommendations are scientifically sound
- UI is intuitive (measured by user testing)
- Mobile-responsive works on major devices

### Post-Launch
- Daily/Monthly active users
- Plan completion rate
- User satisfaction survey results
- Return usage rate
- Share/recommendation rate
- Average session duration

---

## Risk Assessment

### Technical Risks
- **Risk**: Algorithm accuracy
  - **Mitigation**: Base on peer-reviewed research, get expert review
  
- **Risk**: Timezone handling complexity
  - **Mitigation**: Use well-tested libraries, extensive testing
  
- **Risk**: Browser compatibility
  - **Mitigation**: Progressive enhancement, polyfills

### Product Risks
- **Risk**: Too complex for casual users
  - **Mitigation**: Simple MVP, optional advanced features
  
- **Risk**: Recommendations too difficult to follow
  - **Mitigation**: User testing, adjustable intensity levels
  
- **Risk**: Liability concerns (medical advice)
  - **Mitigation**: Clear disclaimers, general wellness guidance only

---

## Future Enhancements (Backlog)

- Multiple destination trips (e.g., world tour)
- Return journey planning
- Shift worker mode (local jet lag)
- Integration with Google Calendar/Outlook
- Social features (share with travel companions)
- Gamification (achievement badges)
- Community recommendations
- Export to PDF
- Dark mode
- Internationalization (i18n)
- Voice assistant integration
- Smart home integration (lighting automation)

---

## Getting Started

### For Developers

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd voyageclock
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Run Tests**
   ```bash
   pnpm test:unit
   pnpm test:e2e
   ```

4. **Review This Plan**
   - Read through entire PLAN.md
   - Check current milestone goals
   - Review file structure
   - Understand data models

5. **Start with First Task**
   - Begin with Milestone 1
   - Create type definitions
   - Build core algorithm
   - Write tests first (TDD)

---

## Contributing

### Development Workflow
1. Check this PLAN.md for current priorities
2. Create feature branch from `main`
3. Write tests first (TDD approach)
4. Implement feature
5. Ensure all tests pass
6. Update documentation if needed
7. Create pull request with clear description

### Code Standards
- Follow TypeScript best practices
- Use Vue 3 Composition API
- Write descriptive commit messages
- Include JSDoc comments for complex logic
- Maintain test coverage above 80%

---

## Questions to Resolve

- [ ] Should we recommend specific melatonin dosages or just timing?
- [ ] How to handle travelers with sleep disorders?
- [ ] Should we include dietary recommendations beyond meal timing?
- [ ] What's the liability disclaimer language?
- [ ] Should we support round-trip planning in MVP?
- [ ] How granular should the timeline be (1-hour blocks vs 30-min)?
- [ ] Should we account for layovers differently?
- [ ] Is there a freemium model in the future?

---

## Conclusion

Voyage Clock aims to be the most scientifically accurate and user-friendly jet lag prevention tool available. By focusing on actionable, evidence-based recommendations and excellent UX, we can help millions of travelers have better experiences and maintain their health while exploring the world.

**Next Steps**: Begin Milestone 1 with algorithm development and type definitions.

