# 🔥 Forecast Forge

**AI-powered, no-code forecasting platform** — go from raw CSV to real ML predictions without writing a single line of code. Everything runs in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ What Is Forecast Forge?

Forecast Forge is a browser-based machine learning platform that democratizes data science for non-technical users. Upload a CSV, explore your data, clean it, train 5 real ML algorithms, compare results, and generate predictions — all through a guided wizard interface.

**No Python. No APIs. No setup. Just predictions.**

### Key Features

| Feature | Description |
|---------|------------|
| 📤 **CSV Upload** | Drag-and-drop with automatic column analysis and type detection |
| 📊 **Data Exploration** | Per-column statistics, histograms, correlation heatmap |
| 🧹 **Auto Cleaning** | Missing value handling (5 strategies), outlier detection (Z-score/IQR), categorical encoding |
| 🧠 **5 Real ML Algorithms** | Linear Regression, Decision Tree (CART), Random Forest, KNN, SVM — all pure TypeScript |
| 🏆 **Model Comparison** | Side-by-side metrics table with auto-ranking |
| 🎯 **Predictions** | Single prediction with confidence intervals, model selector, prediction history |
| 🌙 **Dark-First Design** | Premium dark theme with Forge Red (#E84040) accent |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm** 9.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/dARSHANdR4/Forecast-Forge.git
cd Forecast-Forge

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at **http://localhost:9002**

### Build for Production

```bash
npm run build
npm start
```

---

## 📋 Guided Workflow

Forecast Forge follows a 6-step wizard flow:

```
Upload → Explore → Clean → Train → Compare → Predict
```

1. **Upload** — Drop a CSV file (up to 20MB). The engine automatically analyzes columns and suggests target/features.
2. **Explore** — View per-column statistics, distribution histograms, and a correlation heatmap.
3. **Clean** — Auto-detect missing values and outliers. Apply fixes with one click.
4. **Train** — Select target and features, then train all 5 algorithms with real-time progress.
5. **Compare** — Side-by-side metrics table, actual-vs-predicted scatter, residual distribution, feature importance.
6. **Predict** — Enter values, select any trained model, get predictions with 95% confidence intervals.

---

## 🧠 ML Algorithms

All algorithms are implemented in **pure TypeScript** — no external ML libraries.

| Algorithm | Type | Method |
|-----------|------|--------|
| **Linear Regression** | Regression | OLS via Normal Equation (Gauss-Jordan) |
| **Decision Tree** | Regression & Classification | CART with MSE/Gini splits |
| **Random Forest** | Regression & Classification | 30-tree bagged CART ensemble |
| **K-Nearest Neighbors** | Regression & Classification | Euclidean distance, inverse-distance weighting |
| **Support Vector Machine** | Regression & Classification | Pegasos-style SGD, linear kernel |

### Metrics

- **Regression**: R², RMSE, MAE, MSE
- **Classification**: Accuracy, Precision, Recall, F1 Score, Confusion Matrix
- **Feature Importance**: Coefficient-based (LR/SVM), split-gain (DT/RF)
- **Confidence Intervals**: Per-tree variance (Random Forest)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui components |
| **Icons** | Lucide React |
| **Charts** | Recharts 2.15 |
| **State** | React Context + useReducer |
| **ML Engine** | Custom TypeScript (5 algorithms) |
| **Deployment** | Vercel-ready |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css           # Design system tokens
│   ├── layout.tsx            # Shell: sidebar + topbar
│   ├── page.tsx              # Dashboard
│   ├── upload/page.tsx       # Step 1: Upload
│   ├── explore/page.tsx      # Step 2: Explore
│   ├── clean/page.tsx        # Step 3: Clean
│   ├── train/page.tsx        # Step 4: Train
│   ├── compare/page.tsx      # Step 5: Compare
│   └── predict/page.tsx      # Step 6: Predict
├── components/
│   ├── app/                  # Domain components (15 files)
│   └── ui/                   # shadcn primitives (33 files)
├── lib/
│   ├── ml-algorithms/        # 5 algorithm implementations
│   ├── ml-service.ts         # Training orchestrator
│   ├── statistics.ts         # Core math functions
│   ├── data-analysis.ts      # EDA utilities
│   └── data-cleaning.ts      # Cleaning pipeline
└── store/
    └── app-store.tsx         # Global state management
```

---

## 🎨 Design System

Dark-first design with the **Forge Red** palette:

- **Primary Surface**: `#0F0F11` (deep dark)
- **Accent**: `#E84040` (Forge Red)
- **Typography**: Inter (UI) + JetBrains Mono (metrics)
- **Chart Colors**: 8-color palette optimized for dark backgrounds
- **Components**: 15+ custom components following the design specification

---

## 📊 Sample Datasets

Place CSV files in the `/public` directory for easy access. The app includes a test dataset:
- `test-iris.csv` — 150 samples, 4 features, 3 classes (classification)

---

## 🧪 Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

---

## 📄 Documentation

Detailed project documentation is in the `/docs` directory:

| Document | Description |
|----------|------------|
| `01-PRD.md` | Product Requirements Document |
| `02-UX-FLOW.md` | User Experience Flow |
| `03-TRD.md` | Technical Requirements Document |
| `04-AGENT-PROMPT.md` | AI Agent Orchestration Prompt |
| `05-SPRINT-PLAN.md` | Sprint Plan & Feature Matrix |

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Author

**Darshan DR** — [@dARSHANdR4](https://github.com/dARSHANdR4)

---

*Built with ❤️ and TypeScript. No Math.random() was harmed in the making of these predictions.*
