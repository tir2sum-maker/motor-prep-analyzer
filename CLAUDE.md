# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MotorPrep Analyzer** is a web application for football (soccer) training staff to monitor player development, calculate biological and motor parameters, and generate mid-season reports with visualizations. Inspired by academy reports from clubs like Feyenoord.

**Tech Stack:**
- Next.js 14 (App Router) with TypeScript
- Tailwind CSS + Radix UI components
- Firebase (Firestore for data, Auth for authentication)
- jsPDF + html2canvas for PDF export
- React hooks for state management

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Firebase Setup
1. Create Firebase project at console.firebase.google.com
2. Copy `.env.local.example` to `.env.local`
3. Fill in Firebase config values from Firebase Console
4. Set Firestore rules to require authentication for read/write on `players` collection

### Testing Individual Components
```bash
# Run dev server and navigate to specific routes:
# / - Dashboard with player list
# /player/[id] - Individual player profile
```

## Architecture

### Data Flow

1. **Firebase Layer** (`src/firebase/`)
   - `config.ts`: Initializes Firebase app, Firestore, and Auth
   - `players.ts`: CRUD operations for players (getAllPlayers, getPlayerById, addPlayer, updatePlayer, deletePlayer)
   - All operations return Promises, handle errors with try/catch

2. **Calculation Engine** (`src/lib/calculations.ts`)
   - `calculateBioAge()`: Computes biological age using simplified Maturity Offset
   - `calculatePHV()`: Peak Height Velocity from growth history
   - `calculateZScore()`: Standardized scores for motor tests
   - `calculatePlayerMetrics()`: Main function that orchestrates all calculations
   - `generateTrainingSuggestions()`: AI-like logic for training recommendations based on metrics
   - Uses reference data (`referenceData` object) for age-specific norms

3. **Component Hierarchy**
   ```
   app/layout.tsx (root)
   ├── app/page.tsx (dashboard)
   │   └── Dialog with add player form
   └── app/player/[id]/page.tsx (player detail)
       ├── PlayerForm (edit mode)
       └── PlayerReport (view mode)
           └── StatCard components
   ```

4. **State Management**
   - Local state with `useState` for form data and UI state
   - Firebase real-time updates via `useEffect` + async functions
   - No global state manager (Redux/Zustand) - keep it simple

### Key Design Patterns

1. **Form Handling**: PlayerForm component is controlled - all inputs update local state, onSubmit passes data up
2. **Calculation Separation**: Pure functions in `calculations.ts` - no side effects, easy to test
3. **Firebase Client-Side**: All Firebase calls from client components ('use client'), no server-side operations
4. **PDF Export**: Uses html2canvas to capture rendered report, then jsPDF to create PDF - hides `.no-print` elements

### Color System (Professional Corporate)

Defined in `src/app/globals.css`:
- **Primary**: #0F2A44 (dark blue for headers)
- **Secondary**: #2F80ED (muted blue for accents)
- **Success**: #27AE60 (green for positive metrics)
- **Destructive**: #EB5757 (red for warnings/errors)
- **Stat cards**: Blue background (#2F80ED) with white text for key metrics
- **Background**: #F5F6F8 (light gray, clean professional look)

### Critical Calculation Formulas

1. **Biological Age**:
   ```typescript
   // Simplified heuristic based on BMI and height-for-age
   // Late bloomer: maturityOffset = -0.7
   // Average: maturityOffset = -0.2
   // Early maturer: maturityOffset = 0.5
   bioAge = calendarAge + maturityOffset
   ```

2. **Z-Score for Sprint Tests**:
   ```typescript
   // IMPORTANT: Negative sign because lower time = better performance
   zScore = -(playerTime - meanForBioAge) / standardDeviation
   ```

3. **Sprint Percentage**:
   ```typescript
   sprintPercentage = (sprintMeters / totalDistance) * 100
   // >12% = High output, <8% = Low output
   ```

## Important Development Notes

### When Adding New Features

1. **New Player Fields**:
   - Add to `Player` interface in `src/types/player.ts`
   - Add input in `PlayerForm` (`src/components/player-form.tsx`)
   - Add calculation logic in `src/lib/calculations.ts` if needed
   - Add display in `PlayerReport` (`src/components/player-report.tsx`)
   - Consider PDF export appearance

2. **New Calculations**:
   - Keep pure functions in `calculations.ts`
   - Add reference data to `referenceData` object if using norms
   - Return results in `CalculationResults` type
   - Update `generateTrainingSuggestions()` if relevant

3. **UI Components**:
   - Use existing Radix UI components from `src/components/ui/`
   - Match color scheme from globals.css
   - Ensure mobile responsiveness (Tailwind `md:` breakpoints)
   - Add `.no-print` class to elements that shouldn't appear in PDF

### Firebase Considerations

- **Client-side only**: All Firebase operations are client-side. No server actions yet.
- **Error handling**: Always wrap Firebase calls in try/catch, show user-friendly alerts
- **Real-time**: Currently uses one-time reads. Could add real-time listeners with `onSnapshot` if needed
- **Security**: Firestore rules require authentication. Default setup uses anonymous auth (can be improved)

### PDF Export Gotchas

- Uses `html2canvas` which captures visual rendering, not perfect for all CSS
- Large reports may span multiple pages - code handles pagination
- Hidden elements (`.no-print`) must be hidden before capture, restored after
- Background colors and complex layouts may not render perfectly - test thoroughly

### Responsive Design

- Tailwind mobile-first approach
- Key breakpoints: `md:` (768px), `lg:` (1024px)
- Grid layouts use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- Forms stack vertically on mobile, 2-column on desktop

## Common Tasks

### Adding a New Motor Test

Example: Adding "Vertical Jump"

1. Update type:
   ```typescript
   // src/types/player.ts
   export interface Player {
     // ...
     skokWzwyz?: number; // cm
   }
   ```

2. Add form field:
   ```typescript
   // src/components/player-form.tsx in "Testy motoryczne" Card
   <div className="space-y-2">
     <Label htmlFor="skokWzwyz">Skok wzwyż (cm)</Label>
     <Input
       id="skokWzwyz"
       type="number"
       value={formData.skokWzwyz || ''}
       onChange={(e) => updateField('skokWzwyz', parseFloat(e.target.value))}
     />
   </div>
   ```

3. Add calculation:
   ```typescript
   // src/lib/calculations.ts
   // Add to referenceData for each age group
   const referenceData: Record<number, {
     // ...
     verticalJump: { mean: number; sd: number };
   }> = {
     17: { /* ... */, verticalJump: { mean: 45, sd: 5 } },
   };

   // In calculatePlayerMetrics():
   if (player.skokWzwyz) {
     const refData = getReferenceData(results.wiekBiologiczny);
     results.zScoreSkokWzwyz = calculateZScore(
       player.skokWzwyz,
       refData.verticalJump.mean,
       refData.verticalJump.sd
     );
   }
   ```

4. Display in report:
   ```typescript
   // src/components/player-report.tsx
   {player.skokWzwyz && (
     <StatCard
       label="Skok wzwyż"
       value={formatNumber(player.skokWzwyz, 0)}
       unit="cm"
       variant="stat"
     />
   )}
   ```

### Changing Reference Norms

Edit `referenceData` object in `src/lib/calculations.ts`. Structure:
```typescript
const referenceData: Record<number, {
  sprint10m: { mean: number; sd: number };
  sprint30m: { mean: number; sd: number };
  cod: { mean: number; sd: number };
}> = {
  15: { sprint10m: { mean: 1.85, sd: 0.12 }, /* ... */ },
  16: { sprint10m: { mean: 1.82, sd: 0.11 }, /* ... */ },
  // Add more age groups as needed
};
```

### Customizing Colors

Edit CSS variables in `src/app/globals.css` under `:root`:
```css
:root {
  --primary: 15 42 68;        /* #0F2A44 */
  --secondary: 47 128 237;    /* #2F80ED */
  --success: 39 174 96;       /* #27AE60 */
  --destructive: 235 87 87;   /* #EB5757 */
  /* ... */
}
```

Use in components:
```tsx
<div className="bg-primary text-primary-foreground">
```

## Debugging Tips

1. **Firebase errors**: Check browser console, verify `.env.local` values, check Firebase Console > Firestore > Rules
2. **Calculation errors**: Test calculation functions in isolation with known inputs
3. **PDF export issues**: Inspect `#player-report` element, check canvas rendering in dev tools
4. **Type errors**: Run `npm run build` to catch TypeScript errors before runtime

## Project-Specific Conventions

- **Polish language**: UI labels and messages in Polish (field names like `wzrost`, `waga`)
- **Decimal precision**: Use `formatNumber(value, decimals)` helper for consistent rounding
- **Date handling**: Store as ISO strings, format with `formatDate()` helper
- **Component naming**: PascalCase for components, camelCase for functions/variables
- **File organization**: Group by feature (all player-related in `player/`, all UI primitives in `ui/`)

## Future Enhancements (Not Yet Implemented)

- Real-time collaboration with Firestore listeners
- User authentication with email/password (currently anonymous)
- Charts/graphs using Chart.js
- Export to JSON for data portability
- Multi-language support (Polish/English toggle)
- Historical data tracking and growth curves
- Batch import from CSV/Excel
