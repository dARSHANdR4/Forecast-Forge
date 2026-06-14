# Forecast Forge — Technical Requirements Document (TRD)
## Phase 6–8: Tech Stack, Database Schema, API Design

---

## 1. Technology Stack

### Frontend
| Technology | Version | Rationale |
|---|---|---|
| **Next.js** | 15.2.3 | Already in prototype. App Router for file-based routing. Server actions for ML operations. |
| **React** | 18.3.1 | Already in prototype. Hooks-based component architecture. |
| **TypeScript** | 5.x | Already in prototype. Type safety for ML data structures. |
| **Tailwind CSS** | 3.4.1 | Already in prototype. Utility-first styling with DESIGN.md custom tokens. |
| **shadcn/ui** | Latest | Already in prototype. 33 primitives pre-installed. Radix-based accessible components. |
| **Recharts** | 2.15.1 | Already in prototype. Chart library for forecasts, distributions, correlations. |
| **Lucide React** | 0.475.0 | Already in prototype. Icon system. |
| **Zod** | 3.24.2 | Already in prototype. Schema validation for ML types and form inputs. |

### AI Layer
| Technology | Version | Rationale |
|---|---|---|
| **Google Genkit** | 1.6.2 | Already in prototype. Flow-based AI orchestration. |
| **Gemini 2.0 Flash** | via Genkit | Already in prototype. Column inference, data insights, improvement suggestions. |

### ML Engine (In-Browser)
| Technology | Purpose |
|---|---|
| **Custom TypeScript** | Linear Regression (OLS), Decision Tree (CART), KNN, basic SVM |
| **ml-matrix** (optional) | Matrix operations for linear algebra if needed |

### State Management
| Technology | Purpose |
|---|---|
| **React Context + useReducer** | Global app state (dataset, models, predictions) |
| **Custom Hooks** | Domain-specific state accessors (useDataset, useTraining) |

### Build & Dev
| Technology | Purpose |
|---|---|
| **Turbopack** | Fast dev server (already configured: `next dev --turbopack`) |
| **Inter font** | Primary typeface from Google Fonts |
| **JetBrains Mono font** | Monospace for metrics/data from Google Fonts |

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Browser (Client)                    │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │ React   │  │ Recharts │  │ shadcn/ui + Tailwind │ │
│  │ Pages   │  │ Charts   │  │ Design System        │ │
│  └────┬────┘  └────┬─────┘  └──────────────────────┘ │
│       │            │                                   │
│  ┌────▼────────────▼───────────────────────────────┐  │
│  │          React Context (App Store)               │  │
│  │  dataset | analysis | training | predictions     │  │
│  └────┬─────────────────────────────────────────┬──┘  │
│       │                                         │      │
│  ┌────▼──────────┐                    ┌────────▼────┐ │
│  │ CSV Utilities  │                    │ UI Hooks     │ │
│  │ parse/generate │                    │ useDataset   │ │
│  └───────────────┘                    │ useTraining  │ │
│                                        └─────────────┘ │
└───────────────┬────────────────────────────────────────┘
                │ Server Actions (Next.js)
┌───────────────▼────────────────────────────────────────┐
│                Next.js Server (Node.js)                 │
│  ┌──────────────────┐    ┌──────────────────────────┐  │
│  │ Genkit AI Flows   │    │ ML Service               │  │
│  │ • Column inference│    │ • trainAndEvaluateModel() │  │
│  │ • Data insights   │    │ • Linear Regression      │  │
│  │ • Suggestions     │    │ • Decision Tree (CART)   │  │
│  │ • Explanations    │    │ • Random Forest          │  │
│  └────────┬─────────┘    │ • KNN                    │  │
│           │               │ • SVM (linear)           │  │
│  ┌────────▼─────────┐    └──────────────────────────┘  │
│  │ Google Gemini API │                                  │
│  └──────────────────┘                                  │
└────────────────────────────────────────────────────────┘
```

### Data Flow

```
CSV File → parseCSV() → Record<string, string>[]
  → preprocessData() → { features: number[][], targets: number[] }
    → trainTestSplit() → { train, test }
      → model.fit(trainX, trainY)
        → model.predict(testX) → predictions[]
          → calculateMetrics(actuals, predictions) → metrics{}
            → { model, metrics, predictions, featureImportances } → UI
```

---

## 3. Data Schema (In-Memory Session State)

Since MVP uses no database (session-only, in-memory), these represent the TypeScript interfaces for the state store.

### Dataset Schema

```typescript
interface DatasetMeta {
  id: string;                    // UUID generated on upload
  filename: string;              // Original filename
  uploadedAt: string;            // ISO timestamp
  rowCount: number;              // Total rows (excluding header)
  columnCount: number;           // Total columns
  fileSizeBytes: number;         // Original file size
  status: 'uploaded' | 'analyzed' | 'cleaned';
}

interface ColumnInfo {
  name: string;                  // Column header
  type: 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean';
  missingCount: number;          // Number of null/empty values
  missingPercent: number;        // missingCount / rowCount * 100
  uniqueCount: number;           // Distinct values
  sampleValues: string[];        // First 5 values
  // Numeric-specific
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  q25?: number;                  // 25th percentile
  q75?: number;                  // 75th percentile
}

interface DatasetState {
  meta: DatasetMeta | null;
  rawCsv: string | null;
  cleanedCsv: string | null;
  headers: string[];
  parsedData: Record<string, string>[];
  columns: ColumnInfo[];
  suggestedTargetColumn: string | null;
  suggestedFeatureColumns: string[];
  correlationMatrix: number[][] | null;
}
```

### Model Schema

```typescript
interface TrainedModel {
  id: string;                    // UUID
  modelType: ModelType;          // From ml-models.ts
  taskType: 'regression' | 'classification';
  targetColumn: string;
  featureColumns: string[];
  trainedAt: string;             // ISO timestamp
  trainingTimeMs: number;
  metrics: RegressionMetrics | ClassificationMetrics;
  predictions: (number | string)[];
  actuals: (number | string)[];
  featureImportances: FeatureImportance[] | null;
  isSelected: boolean;           // User has selected this as active model
  rank: number | null;           // Auto-ranked position (1 = best)
}

interface TrainingState {
  models: TrainedModel[];
  selectedModelId: string | null;
  isTraining: boolean;
  currentlyTraining: string | null;  // modelType being trained
  progress: number;              // 0-100 for progress bar
}
```

### Prediction Schema

```typescript
interface SinglePrediction {
  id: string;
  modelId: string;
  inputValues: Record<string, number | string>;
  predictedValue: number | string;
  confidenceLower?: number;      // 95% CI lower bound
  confidenceUpper?: number;      // 95% CI upper bound
  timestamp: string;
}

interface BatchPrediction {
  modelId: string;
  inputCsv: string;
  outputCsv: string;
  rowCount: number;
  timestamp: string;
}

interface PredictionState {
  singlePredictions: SinglePrediction[];
  batchPredictions: BatchPrediction[];
}
```

---

## 4. API Design (Server Actions)

Since Forecast Forge uses Next.js Server Actions (not REST API), the "API" consists of exported async functions with `'use server'` directive.

### Existing Server Actions (Keep & Evolve)

#### `inferModelColumns(input)`
- **File**: `src/ai/flows/infer-model-columns.ts`
- **Input**: `{ csvData: string }`
- **Output**: `{ targetColumn: string, featureColumns: string[] }`
- **Backend**: Genkit → Gemini 2.0 Flash
- **Status**: ✅ Functional — keep as-is

#### `trainModel(input)`
- **File**: `src/ai/flows/train-model.ts`
- **Input**: `{ csvData: string, targetColumn: string, featureColumns: string[], modelType: ModelType }`
- **Output**: `TrainModelOutput` (model type, metrics, predictions, actuals, feature importances, training time)
- **Backend**: ml-service.ts → ML algorithms
- **Status**: ⚠️ Evolve — point to real ML implementations

#### `suggestModelImprovements(input)`
- **File**: `src/ai/flows/suggest-improvement-flow.ts`
- **Input**: Model type, metrics, feature columns, all columns
- **Output**: `{ suggestions: string }`
- **Backend**: Genkit → Gemini 2.0 Flash
- **Status**: ✅ Functional — keep as-is

#### `generateModelPredictions(input)`
- **File**: `src/ai/flows/generate-model-predictions.ts`
- **Input**: Model, data, target, features
- **Output**: Predictions CSV + error metrics
- **Backend**: Genkit → Gemini 2.0 Flash (currently) → should use real model
- **Status**: ⚠️ Evolve — use real model.predict() instead of LLM

### New Server Actions

#### `analyzeData(input)` — [NEW]
- **File**: `src/ai/flows/analyze-data.ts`
- **Input**: `{ csvData: string, columnStats: ColumnInfo[] }`
- **Output**: `{ insights: string, qualityScore: number, recommendations: string[] }`
- **Backend**: Genkit → Gemini 2.0 Flash
- **Purpose**: AI-powered data quality assessment shown as AI Insight Card on /explore page

#### `explainPrediction(input)` — [NEW]
- **File**: `src/ai/flows/explain-prediction.ts`
- **Input**: `{ modelType: string, prediction: number, featureValues: Record<string, number>, featureImportances: FeatureImportance[] }`
- **Output**: `{ explanation: string }`
- **Backend**: Genkit → Gemini 2.0 Flash
- **Purpose**: Plain-language explanation of a single prediction

### Error Format

All server actions use consistent error handling:

```typescript
interface ServerActionError {
  code: string;
  message: string;          // User-facing message
  details?: string;         // Developer-facing details (not shown to user)
}

// Error codes
const ERROR_CODES = {
  INVALID_CSV: 'INVALID_CSV',           // Malformed or empty CSV
  COLUMN_NOT_FOUND: 'COLUMN_NOT_FOUND', // Target/feature column doesn't exist
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA', // Too few rows for train/test split
  TRAINING_FAILED: 'TRAINING_FAILED',   // ML algorithm error
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',     // Genkit/Gemini API unreachable
  PREDICTION_FAILED: 'PREDICTION_FAILED', // Model.predict() error
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',     // Exceeds 50MB limit
  INVALID_INPUT: 'INVALID_INPUT',       // Zod validation failure
} as const;
```

---

## 5. ML Pipeline Design

### Training Pipeline (10 Steps)

```
1. Parse CSV       → parseCSV(csvString) → { headers, data }
2. Validate        → Check target exists, features exist, sufficient rows
3. Type Detection  → Detect numeric/categorical per column
4. Preprocess      → Handle NaN, encode categoricals, extract features
5. Split           → 80/20 train/test (stratified for classification)
6. Scale           → StandardScaler for KNN/SVM (not tree-based)
7. Train           → model.fit(trainX, trainY)
8. Predict         → model.predict(testX) → predictions
9. Evaluate        → calculateMetrics(actuals, predictions)
10. Importance     → Extract feature importance (tree-based only)
```

### Model Implementations

| Model | Algorithm | Hyperparameters | Feature Importance |
|---|---|---|---|
| Linear Regression | OLS (Normal Equation) | None | Coefficient magnitudes |
| Decision Tree (R/C) | CART (Gini/MSE) | maxDepth=10, minSamplesLeaf=5 | Split gain accumulation |
| Random Forest (R/C) | Bagged CART | nTrees=50, maxDepth=10 | Average across trees |
| KNN (R/C) | Euclidean, weighted | k=5 | Not available |
| SVM (R/C) | Linear kernel (simplified) | C=1.0 | Coefficient magnitudes |

### Confidence Intervals (for predictions)

For Random Forest: Use prediction variance across trees.
```
individual_predictions = [tree.predict(x) for tree in forest.trees]
mean = average(individual_predictions)
std = standardDeviation(individual_predictions)
CI_95 = [mean - 1.96 * std, mean + 1.96 * std]
CI_80 = [mean - 1.28 * std, mean + 1.28 * std]
```

For other models: Use residual standard error from training.
```
residuals = actuals - predictions (on test set)
std_error = standardDeviation(residuals)
CI_95 = [prediction - 1.96 * std_error, prediction + 1.96 * std_error]
```

### AutoML Logic

When user clicks "Train All Models":
1. Detect task type from target column (numeric → regression, categorical → classification)
2. Filter to applicable models (5 regression or 5 classification)
3. Train each sequentially, updating progress (1/5, 2/5, etc.)
4. Rank by primary metric (R² for regression, F1 for classification)
5. Mark top model as "BEST MODEL" with green badge

---

## 6. File Structure Reference

```
src/
├── app/
│   ├── globals.css            # DESIGN.md tokens (CSS custom properties)
│   ├── layout.tsx             # Shell: sidebar + topbar + content area
│   ├── page.tsx               # Dashboard (/)
│   ├── upload/page.tsx        # Upload wizard step
│   ├── explore/page.tsx       # Data exploration step
│   ├── clean/page.tsx         # Data cleaning step
│   ├── train/page.tsx         # Model training step
│   ├── compare/page.tsx       # Model comparison step
│   ├── predict/page.tsx       # Prediction step
│   └── results/page.tsx       # Forecast dashboard
├── components/
│   ├── app/                   # Domain components (20 files)
│   └── ui/                    # shadcn primitives (33 files, unchanged)
├── lib/
│   ├── utils.ts               # shadcn cn() utility
│   ├── csv-utils.ts           # CSV parse/generate/download
│   ├── ml-models.ts           # Zod schemas + types
│   ├── ml-service.ts          # Main training orchestrator
│   ├── ml-algorithms/         # Algorithm implementations (5 files)
│   ├── data-analysis.ts       # EDA utilities
│   ├── data-cleaning.ts       # Cleaning utilities
│   └── statistics.ts          # Core stat functions
├── ai/
│   ├── genkit.ts              # Genkit config
│   ├── flows/                 # Server action flows (6 files)
│   └── types/                 # Zod schemas for flows
├── hooks/                     # Custom React hooks (4 files)
└── store/
    └── app-store.ts           # Global state (Context + useReducer)
```
