# Forecast Forge — Product Requirements Document (PRD)
## Phase 1: MVP

---

## 1. Executive Summary

**Forecast Forge** is an AI-powered, no-code forecasting platform that enables users to go from raw CSV data to actionable predictions without needing machine learning expertise. The platform guides users through a structured workflow: upload → understand → clean → train → compare → predict — with AI assistance at every step.

### Vision Statement
Transform Forecast Forge from a basic ML demo application into a genuine AI-powered no-code forecasting platform that democratizes data science for non-technical users.

### Current State (Phase 1 Prototype — Built 1 Year Ago)
The existing prototype provides:
- CSV file upload with 5-row preview
- AI-powered column inference (target + features) via Google Genkit
- 10 model types (5 regression, 5 classification) — **all simulated with Math.random()**
- Basic metrics display (MSE, RMSE, MAE, R², accuracy, confusion matrix)
- Recharts visualizations (bar chart, ROC curve)
- AI improvement suggestions via Genkit
- CSV download of predictions

### Target State (MVP)
- Real ML training with actual predictions (not random)
- Multi-page guided workflow with sidebar navigation
- Data understanding with EDA (statistics, distributions, correlations)
- Automated data cleaning pipeline
- Multi-model comparison with auto-ranking
- Forecast dashboard with confidence bands
- Dark-first premium design system per DESIGN.md

---

## 2. Problem Statement

Small business analysts, researchers, students, and curious beginners face a significant barrier when trying to extract predictive insights from their data:

1. **Technical Barrier**: Existing ML tools (scikit-learn, TensorFlow) require programming skills
2. **Complexity Barrier**: Understanding which model to use, how to clean data, and how to interpret results requires domain expertise
3. **Tooling Barrier**: No-code platforms like AutoML are expensive or enterprise-locked
4. **Trust Barrier**: Black-box predictions without explanation reduce confidence in results

Forecast Forge solves this by providing a **guided, AI-assisted, browser-based** platform where users upload a CSV and receive explained predictions — no code, no setup, no PhD required.

---

## 3. User Personas

### Persona 1: The Curious Beginner — "Alex"
- **Role**: College student studying business
- **Goal**: Predict sales trends for a class project using CSV data from a textbook
- **Pain Points**: No Python experience, intimidated by ML terminology, needs visual results for a presentation
- **Key Needs**: Simple upload, automatic model suggestion, clear charts, downloadable results
- **Success Metric**: Can go from CSV to prediction chart in under 10 minutes

### Persona 2: The Business Analyst — "Priya"
- **Role**: Marketing analyst at a mid-size company
- **Goal**: Forecast next quarter's customer acquisition numbers based on historical data
- **Pain Points**: Uses Excel for everything, manager asks for "ML predictions", doesn't know which model to pick
- **Key Needs**: Data quality assessment, model comparison to justify choice, exportable report
- **Success Metric**: Can produce a forecast with confidence intervals and share the methodology

### Persona 3: The Data-Curious Developer — "Jordan"
- **Role**: Full-stack developer exploring ML concepts
- **Goal**: Quickly test different models on datasets without setting up Jupyter/Python environment
- **Pain Points**: Wants to understand model behavior (feature importance, metrics) not just get predictions
- **Key Needs**: Explainability, multiple model training, raw metrics access
- **Success Metric**: Can compare 3+ models on the same dataset and understand why one performs better

---

## 4. User Stories & Acceptance Criteria

### US-01: Upload CSV Data
> As a user, I want to upload a CSV file so that I can begin analyzing my data.

**Acceptance Criteria:**
- [ ] Drag-and-drop zone accepts CSV files
- [ ] File browser fallback for manual selection
- [ ] File validation: CSV format, <50MB, non-empty
- [ ] Preview shows first 10 rows in styled data table
- [ ] Column count, row count, file size displayed as metric cards
- [ ] AI automatically suggests target and feature columns
- [ ] Toast notification on success/failure

### US-02: Understand My Data
> As a user, I want to see an overview of my data quality and statistics so I can decide if cleaning is needed.

**Acceptance Criteria:**
- [ ] Summary metric cards: total rows, columns, missing %, duplicate %
- [ ] Per-column statistics: type, mean, median, std, min, max, missing count, unique count
- [ ] Distribution histograms for numeric columns
- [ ] Correlation heatmap matrix
- [ ] AI Insight Card with data quality assessment

### US-03: Clean My Data
> As a user, I want the platform to detect and fix data quality issues automatically so I don't have to do it manually.

**Acceptance Criteria:**
- [ ] Missing value strategies: drop rows, fill mean/median/mode, forward-fill
- [ ] Outlier detection with configurable threshold
- [ ] Categorical encoding options
- [ ] Before/after preview comparison
- [ ] One-click "Apply Cleaning" action

### US-04: Train a Model
> As a user, I want to select a model type and train it on my data so I can generate predictions.

**Acceptance Criteria:**
- [ ] Model type selector with grouped categories (Regression / Classification)
- [ ] Target column dropdown (pre-filled from AI suggestion)
- [ ] Feature column multi-select with checkboxes
- [ ] Training progress bar with step text
- [ ] Training results shown as Model Card with metrics
- [ ] Feature importance displayed for tree-based models

### US-05: Train All Models (AutoML)
> As a user, I want to train all applicable models at once so I can find the best one without guessing.

**Acceptance Criteria:**
- [ ] "Train All Models" button triggers sequential training of all applicable models
- [ ] Progress indicator shows which model is currently training
- [ ] All results stored for comparison

### US-06: Compare Models
> As a user, I want to compare multiple trained models side-by-side so I can pick the best one.

**Acceptance Criteria:**
- [ ] Comparison table: Model Name | MAE | RMSE | R² | Action
- [ ] Best model row highlighted with green tint
- [ ] Rank badges (#1, #2, #3) per DESIGN.md
- [ ] "Select Model" button to choose for prediction

### US-07: Generate Predictions
> As a user, I want to input feature values and receive a prediction so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Single prediction: Input form → large predicted value display
- [ ] Batch prediction: Upload new CSV → predictions added as column → download
- [ ] Prediction Card shows: predicted value (5xl mono), confidence range, input summary

### US-08: View Forecast Dashboard
> As a user, I want to see my predictions visualized as charts so I can spot trends.

**Acceptance Criteria:**
- [ ] Forecast line chart: actual vs predicted lines
- [ ] Confidence bands (95% and 80%)
- [ ] Summary row: RMSE, MAE, R² as stat chips
- [ ] Feature importance alongside forecast chart

### US-09: Get AI Insights
> As a user, I want AI to explain my results in plain language so I understand what they mean.

**Acceptance Criteria:**
- [ ] AI Insight Card appears on explore, train, and results pages
- [ ] Left-border accent styling (3px solid --color-accent-500)
- [ ] Source tag (e.g., "Based on: Random Forest, 1,243 samples")
- [ ] Plain-language explanation of model behavior

### US-10: Export Results
> As a user, I want to download my predictions and analysis so I can share them.

**Acceptance Criteria:**
- [ ] CSV download of predictions
- [ ] CSV download of analysis summary
- [ ] Download buttons on results and prediction pages

---

## 5. Functional Requirements

| ID | Requirement | Priority | Status in Prototype |
|---|---|---|---|
| FR-01 | CSV upload with drag-and-drop | P0 | ⚠️ File input only |
| FR-02 | Data preview table (10 rows) | P0 | ✅ 5 rows |
| FR-03 | AI column inference | P0 | ✅ Functional |
| FR-04 | Descriptive statistics (EDA) | P0 | ❌ Not built |
| FR-05 | Distribution histograms | P0 | ❌ Not built |
| FR-06 | Correlation heatmap | P1 | ❌ Not built |
| FR-07 | Missing value handling | P0 | ❌ Not built |
| FR-08 | Outlier detection | P1 | ❌ Not built |
| FR-09 | Categorical encoding | P1 | ❌ Not built |
| FR-10 | Real model training (5 types) | P0 | ❌ Simulated only |
| FR-11 | Multiple model training | P0 | ❌ Single model only |
| FR-12 | Model comparison table | P0 | ❌ Not built |
| FR-13 | Feature importance (real) | P0 | ❌ Random values |
| FR-14 | Single prediction input | P0 | ❌ Not built |
| FR-15 | Batch prediction | P1 | ❌ Not built |
| FR-16 | Forecast visualization | P0 | ⚠️ Basic chart |
| FR-17 | AI improvement suggestions | P1 | ✅ Functional |
| FR-18 | CSV export | P0 | ✅ Functional |

---

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page load time | < 3 seconds |
| NFR-02 | CSV upload processing | < 10 seconds for 10MB file |
| NFR-03 | Model training time | < 30 seconds per model (10K rows) |
| NFR-04 | Chart render time | < 1 second |
| NFR-05 | Browser support | Chrome 90+, Firefox 88+, Edge 90+ |
| NFR-06 | Accessibility | WCAG 2.1 AA compliance |
| NFR-07 | Responsive breakpoints | 768px, 1024px, 1280px |
| NFR-08 | Dark mode first | Default to dark theme |

---

## 7. MVP Scope Lock

### ✅ IN Scope for MVP
- CSV upload with validation and preview
- Automated data exploration (EDA)
- Basic data cleaning (missing values, encoding)
- 5 regression + 5 classification models with real training
- Multi-model comparison with auto-ranking
- Single prediction with result card
- Forecast visualization with confidence bands
- AI column inference + improvement suggestions
- CSV export
- Dark-first design per DESIGN.md
- Desktop-optimized (1024px+ breakpoints)

### ❌ OUT of Scope for MVP
- User authentication / accounts
- Database persistence (session-only, in-memory)
- PDF report generation (stretch goal)
- Time-series decomposition (ARIMA, Prophet)
- Deep learning models
- Mobile-responsive layout (<768px)
- Light mode toggle
- Multi-language / i18n
- Real-time collaboration
- API key management UI
- SHAP/LIME explainability views
