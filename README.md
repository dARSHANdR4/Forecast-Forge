<div align="center">

# 🔥 Forecast Forge

<img src="./docs/assets/hero-banner.png" alt="Forecast Forge Hero Banner" width="100%">

**AI-powered, no-code forecasting platform**  
Go from raw CSV to real ML predictions without writing a single line of code.  
Everything runs securely in your browser.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Machine Learning](https://img.shields.io/badge/ML_Engine-Pure_TypeScript-E84040?style=for-the-badge&logo=codeigniter&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-feature-showcase) • [Architecture](#%EF%B8%8F-architecture) • [Workflow](#-application-flow) • [Screenshots](#-screenshots--preview) • [PRD](./docs/01-PRD.md) • [TRD](./docs/03-TRD.md) • [UI/UX](./docs/02-UX-FLOW.md) • [Sprint Plan](./docs/05-SPRINT-PLAN.md)

</div>

---

## 🎮 What Is Forecast Forge?

Forecast Forge democratizes data science. It is a fully client-side application that transforms raw datasets into actionable predictive models. Instead of wrestling with Pandas scripts or Python environments, you get a beautiful, guided UI to explore data, handle outliers, train algorithms, and forecast the future.

> No Python. No external APIs. No server-side processing. 100% of the Machine Learning engine runs locally in your browser.

---

## 📸 Screenshots & Preview

| Dashboard | Upload & Explore |
|:---:|:---:|
| <img src="./docs/assets/dashboard.png" width="400" alt="Dashboard View"> | <img src="./docs/assets/explore.png" width="400" alt="Data Exploration View"> |
| **Welcome screen and metrics overview** | **Data distribution and correlation heatmaps** |

| Data Cleaning | Model Training |
|:---:|:---:|
| <img src="./docs/assets/clean.png" width="400" alt="Data Cleaning View"> | <img src="./docs/assets/train.png" width="400" alt="Model Training View"> |
| **One-click outlier and missing value fixes** | **Live training of 5 ML algorithms** |

| Model Comparison | Forecasting Results |
|:---:|:---:|
| <img src="./docs/assets/compare.png" width="400" alt="Model Comparison View"> | <img src="./docs/assets/predict.png" width="400" alt="Forecasting View"> |
| **Side-by-side performance and feature importance** | **Predictions with 95% confidence intervals** |

---

## 🏗️ Architecture

Forecast Forge separates the interface from the heavy mathematical lifting, maintaining high performance while operating entirely on the client side.

```mermaid
graph TD
    classDef default fill:#1E1E24,stroke:#4A4A5A,stroke-width:2px,color:#fff;
    classDef highlight fill:#E84040,stroke:#FF6B6B,stroke-width:2px,color:#fff,font-weight:bold;
    classDef layer fill:#2A2A35,stroke:#4A4A5A,stroke-width:1px,color:#E0E0E0;

    subgraph Client ["Frontend Interface (Next.js)"]
        UI[Dashboard & Wizard UI]
        State[React Context App Store]
    end

    subgraph DataLayer ["Data Processing Layer"]
        Parse[CSV Parser]
        EDA[Exploratory Data Analysis]
        Clean[Missing Value & Outlier Handling]
    end

    subgraph MLEngine ["Machine Learning Engine (Pure TS)"]
        Reg[Regression Models<br/>LR, DT, RF, KNN, SVM]
        Class[Classification Models<br/>DT, RF, KNN, SVM]
        Eval[Metrics & Validation]
    end

    subgraph PredictionLayer ["Forecasting Layer"]
        Infer[Inference Engine]
        Conf[Confidence Intervals]
    end

    UI -->|File Upload| Parse
    Parse --> EDA
    EDA --> Clean
    Clean -->|Cleaned Data| State
    State -->|Target & Features| MLEngine
    MLEngine -->|Trained Models| Eval
    Eval -->|Ranked Models| State
    State -->|Selected Model| Infer
    Infer --> Conf
    Conf -->|Prediction Output| UI

    class MLEngine highlight;
    class Client,DataLayer,PredictionLayer layer;
```

---

## 🔄 Application Flow

The entire experience is built around a linear, foolproof 6-step workflow designed for non-technical users.

```mermaid
flowchart LR
    classDef step fill:#2A2A35,stroke:#E84040,stroke-width:2px,color:#fff,border-radius:8px;
    
    1((📤)):::step -->|Upload CSV| 2((📊)):::step
    2 -->|Explore Stats| 3((🧹)):::step
    3 -->|Auto-Clean| 4((🧠)):::step
    4 -->|Train 5 Models| 5((🏆)):::step
    5 -->|Compare Metrics| 6((🎯)):::step
    
    click 1 href "#-feature-showcase" "Upload"
    click 2 href "#-feature-showcase" "Explore"
    click 3 href "#-feature-showcase" "Clean"
    click 4 href "#-feature-showcase" "Train"
    click 5 href "#-feature-showcase" "Compare"
    click 6 href "#-feature-showcase" "Predict"
    
    style 1 fill:#1A1A24
    style 2 fill:#1A1A24
    style 3 fill:#1A1A24
    style 4 fill:#1A1A24
    style 5 fill:#1A1A24
    style 6 fill:#1A1A24
```

---

## ✨ Feature Showcase

### 📤 Upload CSV & Auto-Detect
Drag and drop datasets up to 20MB. The engine automatically parses headers, detects data types, and intelligently suggests prediction targets based on data distributions.

---

### 📊 Data Exploration & Heatmaps
Visualize your data before training. View per-column distributions, value counts, missing percentages, and a beautiful correlation matrix heatmap to spot feature dependencies.

---

### 🧹 One-Click Data Cleaning
Say goodbye to manual Pandas scripts. Automatically detect outliers via Z-scores and handle missing values using mean, median, mode, or drop strategies—all with a single click.

---

### 🧠 Pure TypeScript ML Engine
Train 5 real machine learning algorithms directly in your browser without any backend:
- Linear Regression (Gauss-Jordan OLS)
- Decision Trees (CART with MSE/Gini)
- Random Forests (30-tree bagged ensemble)
- K-Nearest Neighbors (Euclidean inverse-distance)
- Support Vector Machines (Pegasos-style SGD)

---

### 🏆 Model Comparison & Analytics
Compare model performance side-by-side. Track R², RMSE, Accuracy, and F1 Scores. Dive deeper with actual vs. predicted scatter plots, residual error distributions, and feature importance rankings.

---

### 🎯 Forecasting & Confidence Intervals
Select the winning model and input new data to generate instant predictions. View outputs complete with 95% confidence intervals and historical prediction logging.

---

## 🛠️ Tech Stack

**Frontend Framework**  
Built on **Next.js 15** (App Router, Turbopack) using **React 19** and strictly typed **TypeScript 5**. State management handles the workflow natively using React Context and `useReducer`.

**Design & UI**  
A premium dark-first interface styled with **Tailwind CSS 3.4**, utilizing **shadcn/ui** primitives, **Lucide React** icons, and rich visualizations powered by **Recharts 2.15**.

**Machine Learning Engine**  
A 100% custom, zero-dependency engine written in TypeScript. All algorithms, matrix operations, and metrics calculations run directly in the V8 browser engine.

---

## 📚 Documentation Hub

To explore the product specs, architecture, and design decisions behind Forecast Forge, refer to the detailed documentation:

- 📑 [Product Requirements Document (PRD)](./docs/01-PRD.md)
- 🎨 [UI/UX & Application Flow](./docs/02-UX-FLOW.md)
- 🏗️ [Technical Requirements Document (TRD)](./docs/03-TRD.md)
- 🤖 [Agent Orchestration Prompt](./docs/04-AGENT-PROMPT.md)
- 📅 [Sprint Plan & Roadmap](./docs/05-SPRINT-PLAN.md)
- 💅 [Design System (DESIGN.md)](../DESIGN.md)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm** 9.x or later

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/dARSHANdR4/Forecast-Forge.git
cd Forecast-Forge

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be running at **http://localhost:9002** (or your default Next.js port). A sample dataset `test-iris.csv` is included in the `/public` folder for immediate testing.

### Deployment

Forecast Forge is completely static/client-side and highly optimized for Vercel.

```bash
npm i -g vercel
vercel
```

---

## 🤝 Author & License

**Darshan DR** — [@dARSHANdR4](https://github.com/dARSHANdR4)

This project is licensed under the MIT License.

<div align="center">
  <br />
  <i>Built with ❤️ and TypeScript. No Math.random() was harmed in the making of these predictions.</i>
</div>
