# Forecast Forge — Agent Orchestration Prompt
## Phase 11: Master Prompt for AI Coding Agents

---

> **Copy-paste this entire prompt** to Claude Code, Cursor, Windsurf, or any AI coding agent to continue building Forecast Forge from the existing prototype.

---

```
# FORECAST FORGE — AI CODING AGENT ORCHESTRATION PROMPT

## CONTEXT: This is NOT a greenfield project

You are continuing work on an EXISTING project called Forecast Forge.
A Phase 1 prototype/demo was built ~1 year ago and is functional.
DO NOT start from scratch. DO NOT delete existing code unless explicitly marked for deletion.
Your job is to EVOLVE the existing codebase into the MVP defined below.

## EXISTING CODEBASE ANALYSIS

### What Already Works (DO NOT BREAK)
1. Next.js 15 + React 18 + TypeScript project structure
2. 33 shadcn/ui components pre-installed in src/components/ui/
3. CSV upload + parsing (src/lib/csv-utils.ts)
4. Google Genkit AI integration (src/ai/genkit.ts) with Gemini 2.0 Flash
5. AI column inference flow (src/ai/flows/infer-model-columns.ts)
6. AI improvement suggestions flow (src/ai/flows/suggest-improvement-flow.ts)
7. ML type system with Zod schemas (src/lib/ml-models.ts) — 10 model types defined
8. Recharts chart integration
9. Tailwind CSS 3.4 with CSS variables
10. Toast notification system

### What Must Be REPLACED
1. src/lib/ml-service.ts — All predictions are Math.random(). Replace with real ML algorithms.
2. src/lib/regression.ts — Only supports 2x2 matrix inversion. Replace entirely.
3. src/app/globals.css — Wrong color scheme. Rewrite to match DESIGN.md tokens.
4. src/components/app/app-header.tsx — Replace with sidebar navigation.

### What Must Be EVOLVED
1. src/app/page.tsx — Transform from single-page layout to dashboard
2. src/components/app/data-uploader.tsx — Keep logic, redo UI to DESIGN.md upload zone
3. src/components/app/model-trainer.tsx — Add AutoML, multi-model support
4. src/components/app/prediction-display.tsx — Refactor into separate pages
5. src/app/layout.tsx — Add sidebar + topbar shell layout

## TARGET MONOREPO STRUCTURE

```
Forecast-Forge-master/Forecast-Forge-master/
├── src/
│   ├── app/
│   │   ├── globals.css              # REWRITE: DESIGN.md dark-first tokens
│   │   ├── layout.tsx               # MODIFY: Sidebar + topbar shell
│   │   ├── page.tsx                 # MODIFY: Dashboard landing
│   │   ├── upload/page.tsx          # NEW: Upload wizard
│   │   ├── explore/page.tsx         # NEW: Data understanding
│   │   ├── clean/page.tsx           # NEW: Data cleaning
│   │   ├── train/page.tsx           # NEW: Model training
│   │   ├── compare/page.tsx         # NEW: Model comparison
│   │   ├── predict/page.tsx         # NEW: Prediction
│   │   └── results/page.tsx         # NEW: Forecast dashboard
│   ├── components/
│   │   ├── app/
│   │   │   ├── app-sidebar.tsx      # NEW: 240px sidebar nav
│   │   │   ├── top-nav.tsx          # NEW: Breadcrumb topbar
│   │   │   ├── wizard-stepper.tsx   # NEW: 6-step progress
│   │   │   ├── metric-card.tsx      # NEW: KPI display
│   │   │   ├── dataset-card.tsx     # NEW: Dataset info
│   │   │   ├── model-card.tsx       # NEW: Model results
│   │   │   ├── chart-container.tsx  # NEW: Chart wrapper
│   │   │   ├── upload-zone.tsx      # NEW: Drag-drop zone
│   │   │   ├── ai-insight-card.tsx  # NEW: AI output display
│   │   │   ├── feature-importance.tsx # NEW: Bar chart
│   │   │   ├── prediction-card.tsx  # NEW: Result display
│   │   │   ├── model-comparison.tsx # NEW: Side-by-side
│   │   │   ├── data-explorer.tsx    # NEW: EDA component
│   │   │   ├── data-cleaner.tsx     # NEW: Cleaning UI
│   │   │   ├── forecast-chart.tsx   # NEW: Time-series viz
│   │   │   ├── empty-state.tsx      # NEW: Empty views
│   │   │   ├── loading-skeleton.tsx # NEW: Skeleton loaders
│   │   │   ├── data-uploader.tsx    # MODIFY: Restyle
│   │   │   ├── model-trainer.tsx    # MODIFY: Add AutoML
│   │   │   └── prediction-display.tsx # MODIFY: Refactor
│   │   └── ui/                      # KEEP: All 33 shadcn components
│   ├── lib/
│   │   ├── utils.ts                 # KEEP
│   │   ├── csv-utils.ts             # KEEP
│   │   ├── ml-models.ts             # EXTEND: Add new types
│   │   ├── ml-service.ts            # REPLACE: Real ML
│   │   ├── ml-algorithms/
│   │   │   ├── linear-regression.ts # NEW
│   │   │   ├── decision-tree.ts     # NEW
│   │   │   ├── random-forest.ts     # NEW
│   │   │   ├── knn.ts              # NEW
│   │   │   └── svm.ts             # NEW
│   │   ├── data-analysis.ts         # NEW: EDA functions
│   │   ├── data-cleaning.ts         # NEW: Cleaning functions
│   │   └── statistics.ts            # NEW: Stats functions
│   ├── ai/
│   │   ├── genkit.ts                # KEEP
│   │   ├── flows/
│   │   │   ├── infer-model-columns.ts  # KEEP
│   │   │   ├── train-model.ts          # MODIFY: Use real ML
│   │   │   ├── suggest-improvement-flow.ts # KEEP
│   │   │   ├── generate-model-predictions.ts # MODIFY
│   │   │   ├── analyze-data.ts         # NEW
│   │   │   └── explain-prediction.ts   # NEW
│   │   └── types/                   # EXTEND
│   ├── hooks/
│   │   ├── use-mobile.tsx           # KEEP
│   │   ├── use-toast.ts            # KEEP
│   │   ├── use-dataset.ts          # NEW
│   │   └── use-training.ts         # NEW
│   └── store/
│       └── app-store.ts            # NEW: Global state
```

## DESIGN SYSTEM — MANDATORY RULES

Read DESIGN.md at the project root. It is the SINGLE SOURCE OF TRUTH for all visual decisions.

### Critical Design Tokens
- Page background: #0F0F11 (dark-first)
- Card surface: #161618
- Primary accent: #E84040 (Forge Red)
- Text primary: #F4F4F5
- Text secondary: #A1A1AA
- Font stack: 'Inter', sans-serif
- Mono font: 'JetBrains Mono', monospace
- Border default: #3A3A3F
- Border subtle: #2A2A2E
- Card border radius: 8px (--radius-lg)
- Chart colors: #E84040, #3B82F6, #22C55E, #F59E0B, #A855F7, #06B6D4

### Mandatory Visual Rules
1. ALL numeric metrics use font-mono (JetBrains Mono)
2. ALL charts use DESIGN.md chart colors
3. ALL components have empty, loading, error, success states
4. Dark theme is DEFAULT — no light mode in MVP
5. NO gradients on UI surfaces (only in chart data fills)
6. NO decorative elements that don't serve a function
7. AI Insight cards MUST have 3px left border in accent-500

## ML PIPELINE — IMPLEMENTATION ORDER

1. FIRST: Build src/lib/statistics.ts (mean, median, std, pearson)
2. SECOND: Build src/lib/ml-algorithms/linear-regression.ts (OLS)
3. THIRD: Build src/lib/ml-algorithms/decision-tree.ts (CART)
4. FOURTH: Build src/lib/ml-algorithms/random-forest.ts (bagged CART)
5. FIFTH: Build src/lib/ml-algorithms/knn.ts (Euclidean)
6. SIXTH: Build src/lib/ml-algorithms/svm.ts (linear kernel)
7. SEVENTH: Rewrite src/lib/ml-service.ts to wire up real algorithms
8. EIGHTH: Modify src/ai/flows/train-model.ts to use new ml-service

### ML Training Flow
1. parseCSV() → headers + data
2. Validate target/feature columns exist
3. Detect column types (numeric/categorical)
4. Handle NaN: drop rows with missing features
5. Encode categorical features (label encoding)
6. Split 80/20 (stratified for classification)
7. Scale for KNN/SVM (standard scaler)
8. model.fit(trainX, trainY)
9. predictions = model.predict(testX)
10. metrics = calculateMetrics(actuals, predictions)

### Confidence Intervals (Random Forest)
```typescript
const treePredictions = forest.trees.map(tree => tree.predict(x));
const mean = average(treePredictions);
const std = standardDeviation(treePredictions);
const ci95 = [mean - 1.96 * std, mean + 1.96 * std];
```

## ERROR CODES
INVALID_CSV, COLUMN_NOT_FOUND, INSUFFICIENT_DATA, TRAINING_FAILED,
AI_UNAVAILABLE, PREDICTION_FAILED, FILE_TOO_LARGE, INVALID_INPUT

## SUCCESS CRITERIA
- [ ] Upload CSV → preview renders with real data
- [ ] Explore → stats/distributions/correlations compute from real data
- [ ] Train Linear Regression → R² > 0.5 on well-behaved data (NOT random)
- [ ] Compare 3+ models → table ranks correctly by metric
- [ ] Predict → enter values → get real prediction (not random number)
- [ ] All pages render in dark theme matching DESIGN.md
- [ ] Sidebar navigation works across all 8 pages
- [ ] All numeric values in JetBrains Mono
- [ ] Empty/loading/error states on every data-dependent component
- [ ] Dev server starts with `npm run dev` without errors

## IMPLEMENTATION SEQUENCE
Sprint 1: globals.css + tailwind.config.ts → DESIGN.md tokens
Sprint 2: layout.tsx + sidebar + topbar + page routing
Sprint 3: Design components (metric-card, dataset-card, model-card, etc.)
Sprint 4: Upload page + data-analysis.ts + explore page
Sprint 5: data-cleaning.ts + clean page
Sprint 6: ML algorithms + rewrite ml-service.ts
Sprint 7: Train page + compare page
Sprint 8: Predict page + results page + forecast-chart
Sprint 9: Global state (Context + hooks)
Sprint 10: Polish, error handling, accessibility, testing
```

---

> **Usage**: Paste the code block above into your AI coding agent's prompt. The agent will understand:
> 1. What exists and must not be broken
> 2. What must be replaced vs evolved
> 3. The exact folder structure to create
> 4. The design system rules to follow
> 5. The ML implementation order
> 6. The success criteria to verify against
