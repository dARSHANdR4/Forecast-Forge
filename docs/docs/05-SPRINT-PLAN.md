# Forecast Forge — MVP Feature Matrix & Sprint Plan
## Phase 4 & 10: Prioritized Features + Execution Schedule

---

## 1. Feature Priority Matrix

| # | Feature | Priority | Sprint | Existing? | Effort |
|---|---|---|---|---|---|
| F01 | CSV upload with drag-and-drop zone | P0 | 4 | ⚠️ File input only | 1d |
| F02 | File validation (CSV, size, non-empty) | P0 | 4 | ⚠️ Basic check | 0.5d |
| F03 | Data preview table (10 rows, styled) | P0 | 4 | ⚠️ 5 rows, unstyled | 0.5d |
| F04 | AI column inference (target + features) | P0 | 4 | ✅ Functional | 0d |
| F05 | Descriptive statistics (per column) | P0 | 4 | ❌ Not built | 2d |
| F06 | Distribution histograms | P0 | 4 | ❌ Not built | 1d |
| F07 | Correlation heatmap | P1 | 4 | ❌ Not built | 1d |
| F08 | Missing value handling (4 strategies) | P0 | 5 | ❌ Not built | 2d |
| F09 | Outlier detection (Z-score/IQR) | P1 | 5 | ❌ Not built | 1d |
| F10 | Categorical encoding (label/one-hot) | P1 | 5 | ❌ Not built | 1d |
| F11 | Real ML training (5 regression models) | P0 | 6 | ❌ All simulated | 5d |
| F12 | Real ML training (5 classification models) | P0 | 6 | ❌ All simulated | — (same impl) |
| F13 | Feature importance (tree-based) | P0 | 6 | ❌ Random values | — (part of tree impl) |
| F14 | Multi-model training (AutoML) | P0 | 7 | ❌ Single model | 1d |
| F15 | Model comparison table with ranking | P0 | 7 | ❌ Not built | 2d |
| F16 | Single prediction with result card | P0 | 8 | ❌ Not built | 1.5d |
| F17 | Forecast visualization (confidence bands) | P0 | 8 | ⚠️ Basic chart | 2d |
| F18 | AI improvement suggestions | P1 | — | ✅ Functional | 0d |

**P0 Total: 14 features** | **P1 Total: 4 features**

---

## 2. Sprint Plan

### Sprint 1: Design System Foundation (3 days)
| Deliverable | File(s) | Description |
|---|---|---|
| CSS Token Migration | `globals.css` | All DESIGN.md color, typography, spacing, motion tokens as CSS variables |
| Tailwind Extension | `tailwind.config.ts` | Extended palette, chart colors, custom spacing, font families |
| Font Setup | `layout.tsx` | Inter + JetBrains Mono from Google Fonts |
| Dark Theme Default | `layout.tsx` | `dark` class on `<html>`, dark-first CSS variables |
| **Estimated Effort** | | **3 developer-days** |

### Sprint 2: App Shell & Navigation (3 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Sidebar Navigation | `app-sidebar.tsx` | 240px sidebar, section labels, active states per DESIGN.md §10.2 |
| Top Navigation | `top-nav.tsx` | 56px topbar with breadcrumb per §10.3 |
| Wizard Stepper | `wizard-stepper.tsx` | 6-step horizontal progress per §10.4 |
| Shell Layout | `layout.tsx` | Sidebar + topbar + content area wrapper |
| Route Pages | `*/page.tsx` (7 files) | Empty page shells for all routes |
| Dashboard | `page.tsx` | Landing with empty state / recent datasets |
| **Estimated Effort** | | **3 developer-days** |

### Sprint 3: Design Components (4 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Metric Card | `metric-card.tsx` | KPI display per §10.6 |
| Dataset Card | `dataset-card.tsx` | File card with status per §10.7 |
| Model Card | `model-card.tsx` | Training results per §10.8 |
| Chart Container | `chart-container.tsx` | Chart wrapper per §10.9 |
| Upload Zone | `upload-zone.tsx` | Drag-drop per §10.10 |
| AI Insight Card | `ai-insight-card.tsx` | AI output per §10.11 |
| Feature Importance | `feature-importance.tsx` | Bar chart per §10.12 |
| Prediction Card | `prediction-card.tsx` | Result display per §10.13 |
| Empty State | `empty-state.tsx` | Centered CTA per §10.19 |
| Loading Skeleton | `loading-skeleton.tsx` | Shimmer per §10.20 |
| Error State | `error-state.tsx` | Error display per §10.21 |
| **Estimated Effort** | | **4 developer-days** |

### Sprint 4: Upload & Data Understanding (5 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Upload Page | `upload/page.tsx` | Upload zone + preview + AI suggestions |
| Data Uploader Restyle | `data-uploader.tsx` | Restyle to DESIGN.md, keep CSV/Genkit logic |
| Statistics Library | `statistics.ts` | mean, median, std, percentile, pearson |
| Data Analysis Library | `data-analysis.ts` | Column stats, distributions, correlations |
| Explore Page | `explore/page.tsx` | Metric cards + column table + charts + heatmap + AI |
| Data Explorer Component | `data-explorer.tsx` | Tabbed EDA view |
| **Estimated Effort** | | **5 developer-days** |

### Sprint 5: Data Cleaning (4 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Cleaning Library | `data-cleaning.ts` | Missing values, outliers, encoding |
| Clean Page | `clean/page.tsx` | Issue report + action controls + before/after |
| Data Cleaner Component | `data-cleaner.tsx` | Cleaning UI with strategy selectors |
| **Estimated Effort** | | **4 developer-days** |

### Sprint 6: ML Engine (5 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Linear Regression | `ml-algorithms/linear-regression.ts` | OLS with normal equation |
| Decision Tree | `ml-algorithms/decision-tree.ts` | CART for regression + classification |
| Random Forest | `ml-algorithms/random-forest.ts` | Bagged CART ensemble |
| KNN | `ml-algorithms/knn.ts` | K-Nearest Neighbors |
| SVM | `ml-algorithms/svm.ts` | Linear kernel (simplified) |
| ML Service Rewrite | `ml-service.ts` | Wire up real algorithms, remove Math.random() |
| Train Flow Update | `train-model.ts` | Point to new ML service |
| **Estimated Effort** | | **5 developer-days** |

### Sprint 7: Training & Comparison (4 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Train Page | `train/page.tsx` | Column selection + model picker + progress + results |
| Model Trainer Restyle | `model-trainer.tsx` | DESIGN.md styling + AutoML button |
| Compare Page | `compare/page.tsx` | Comparison table + charts |
| Model Comparison Component | `model-comparison.tsx` | Side-by-side display per §10.24 |
| **Estimated Effort** | | **4 developer-days** |

### Sprint 8: Prediction & Dashboard (4 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Predict Page | `predict/page.tsx` | Single + batch prediction |
| Results Page | `results/page.tsx` | Forecast dashboard |
| Forecast Chart | `forecast-chart.tsx` | Time-series with confidence bands per §10.23 |
| Prediction Display Refactor | `prediction-display.tsx` | Extract to reusable components |
| **Estimated Effort** | | **4 developer-days** |

### Sprint 9: State Management (3 days)
| Deliverable | File(s) | Description |
|---|---|---|
| App Store | `store/app-store.ts` | React Context + useReducer |
| Dataset Hook | `hooks/use-dataset.ts` | Dataset state slice |
| Training Hook | `hooks/use-training.ts` | Training state slice |
| Wire All Pages | All `page.tsx` files | Replace local useState with global store |
| **Estimated Effort** | | **3 developer-days** |

### Sprint 10: Polish & Testing (3 days)
| Deliverable | File(s) | Description |
|---|---|---|
| Empty States | All data-dependent components | Add empty state component to every async view |
| Loading States | All data-dependent components | Add skeleton loaders |
| Error Boundaries | All pages | Wrap with error boundary + retry |
| Accessibility | All interactive elements | aria-label, focus rings, keyboard nav |
| Font Audit | All components | Verify all metrics use JetBrains Mono |
| E2E Test Run | Manual | Upload → Explore → Clean → Train → Compare → Predict |
| README Update | `README.md` | Setup instructions, screenshots |
| **Estimated Effort** | | **3 developer-days** |

---

## 3. Effort Summary

| Sprint | Focus | Days |
|---|---|---|
| Sprint 1 | Design System | 3 |
| Sprint 2 | App Shell | 3 |
| Sprint 3 | Components | 4 |
| Sprint 4 | Upload & Explore | 5 |
| Sprint 5 | Cleaning | 4 |
| Sprint 6 | ML Engine | 5 |
| Sprint 7 | Train & Compare | 4 |
| Sprint 8 | Predict & Dashboard | 4 |
| Sprint 9 | State Management | 3 |
| Sprint 10 | Polish & Test | 3 |
| **TOTAL** | | **38 developer-days** |

---

## 4. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| TypeScript ML too slow for large CSVs | Medium | High | Cap file size at 10MB, add WebWorker for training |
| Decision Tree / Random Forest implementation bugs | High | High | Start with Linear Regression (simplest), add progressively |
| Genkit API key expires or hits quota | Low | Medium | Graceful fallback — disable AI features, show manual UI |
| Design migration breaks existing functionality | Medium | Medium | Sprint 1 changes only CSS — no logic changes |
| State management adds complexity late (Sprint 9) | Medium | Medium | Build pages with local state first, migrate to global last |
