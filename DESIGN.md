---
name: Forecast Forge Design System
version: 1.0.0
created: 2025-06-14
project: Forecast Forge — AI-Powered No-Code Forecasting Platform
authors: [Design Systems Team]
status: production-ready
target-agents: [Claude Code, Cursor, Windsurf, Lovable, Bolt, GPT-based agents]
---

# FORECAST FORGE — DESIGN SYSTEM

> **For AI Coding Agents:** This file is the single source of truth for all visual decisions in Forecast Forge. Every screen, component, and interaction must follow these tokens and rules. Do NOT deviate from the tokens defined here. Do NOT introduce new color values, font sizes, or spacing values not listed below.

---

## 1. BRAND DESCRIPTION

### Identity

Forecast Forge is a data-first, AI-assisted forecasting platform. The brand sits at the intersection of analytical precision and approachable intelligence. It does not shout — it guides. It does not decorate — it clarifies.

The visual language is inspired by:
- **Orderful** — structured information hierarchy, confident mono-weight typography, stark contrast between data and chrome
- **Graphy** — clean chart-first layout, editorial data presentation, minimal decoration
- **Linear** — dark-mode first, purposeful whitespace, sharp radius edges
- **Vercel** — monochromatic depth, developer-grade precision
- **Notion** — calm neutrals, guided workflow feel
- **Stripe** — trust through clarity, professional tone

Forecast Forge does NOT adopt any of these identities directly. It creates its own: **Analytical Warmth** — cold data presented with human confidence.

### Personality Attributes

| Attribute | Expression |
|---|---|
| Trustworthy | Precise metrics, explainable AI, no black boxes |
| Analytical | Dense but readable data, chart-first layouts |
| Professional | Contained layouts, strict typographic hierarchy |
| Modern | Dark surface primary, sharp geometry, no gradients except data |
| Intelligent | Guided flows, context-aware hints, AI insight cards |
| Minimal | No decorative elements; every pixel earns its place |
| Data-first | Charts and tables are heroes, not supporting content |
| Beginner-friendly | Progressive disclosure; advanced controls hidden by default |

### Anti-Patterns — Never Use

- Neon gradients or glow effects
- Rounded bubbly UI elements (pill shapes except for badges only)
- Gaming or crypto-inspired aesthetics
- Purple or teal as primary actions
- Drop shadows for decoration (only for elevation/depth)
- Emoji as UI elements
- Full-bleed background images behind data

---

## 2. COLOR TOKENS

### Base Palette

```
--color-black:          #0A0A0B    /* Near-black — primary dark surface */
--color-surface-0:      #0F0F11    /* Darkest surface — page background */
--color-surface-1:      #161618    /* Card surface — primary dark cards */
--color-surface-2:      #1E1E21    /* Elevated surface — modals, drawers */
--color-surface-3:      #252528    /* Hover/pressed surface */
--color-surface-4:      #2E2E32    /* Input background */

--color-border-subtle:  #2A2A2E    /* Hairline borders, table dividers */
--color-border-default: #3A3A3F    /* Default borders, card edges */
--color-border-strong:  #4A4A52    /* Focused borders, active elements */

--color-white:          #FFFFFF
--color-white-90:       rgba(255,255,255,0.90)
--color-white-70:       rgba(255,255,255,0.70)
--color-white-50:       rgba(255,255,255,0.50)
--color-white-30:       rgba(255,255,255,0.30)
--color-white-10:       rgba(255,255,255,0.10)
--color-white-05:       rgba(255,255,255,0.05)
```

### Brand Accent — Forge Red

Inspired by Orderful's confident red and Graphy's salmon accent. Warm, assertive, never aggressive.

```
--color-accent-50:      #FFF1F0
--color-accent-100:     #FFE0DD
--color-accent-200:     #FFBDB8
--color-accent-300:     #FF9089
--color-accent-400:     #FF5C52    /* Light/interactive accent */
--color-accent-500:     #E84040    /* Primary brand accent */
--color-accent-600:     #CC2E2E    /* Pressed / dark variant */
--color-accent-700:     #A82323
--color-accent-800:     #861B1B
--color-accent-900:     #5C0F0F
```

### Semantic Colors

```
/* Success */
--color-success-subtle:    #0F2A1A
--color-success-muted:     #1A4A2E
--color-success-default:   #22C55E
--color-success-strong:    #4ADE80

/* Warning */
--color-warning-subtle:    #2A200A
--color-warning-muted:     #4A380A
--color-warning-default:   #F59E0B
--color-warning-strong:    #FCD34D

/* Error / Danger */
--color-error-subtle:      #2A0F0F
--color-error-muted:       #4A1A1A
--color-error-default:     #EF4444
--color-error-strong:      #F87171

/* Info */
--color-info-subtle:       #0A1A2A
--color-info-muted:        #0F2A4A
--color-info-default:      #3B82F6
--color-info-strong:       #60A5FA
```

### Text Colors

```
--color-text-primary:      #F4F4F5    /* Main body text */
--color-text-secondary:    #A1A1AA    /* Supporting text, labels */
--color-text-tertiary:     #71717A    /* Placeholder, disabled */
--color-text-disabled:     #52525B    /* Disabled state */
--color-text-inverse:      #09090B    /* Text on light/accent surfaces */
--color-text-accent:       #FF5C52    /* Accent-colored text links */
```

### Light Mode Overrides (Optional — Secondary Theme)

```
--color-surface-0-light:   #FAFAFA
--color-surface-1-light:   #FFFFFF
--color-surface-2-light:   #F4F4F5
--color-surface-3-light:   #E4E4E7
--color-surface-4-light:   #D4D4D8
--color-border-subtle-light:  #E4E4E7
--color-border-default-light: #D4D4D8
--color-text-primary-light:   #09090B
--color-text-secondary-light: #52525B
```

> **Agent Note:** Default theme is dark. Light mode is a secondary consideration for MVP. Build dark-first.

---

## 3. DATA VISUALIZATION COLOR SYSTEM

This section is critical. All charts, graphs, and data displays must use these exact palette values.

### Primary Chart Palette (Categorical Data)

Use in order for multi-series charts. Never repeat a color within the same chart.

```
--chart-1:   #E84040    /* Forge Red — primary series */
--chart-2:   #3B82F6    /* Data Blue — secondary series */
--chart-3:   #22C55E    /* Signal Green — third series */
--chart-4:   #F59E0B    /* Amber — fourth series */
--chart-5:   #A855F7    /* Purple — fifth series */
--chart-6:   #06B6D4    /* Cyan — sixth series */
--chart-7:   #F97316    /* Orange — seventh series */
--chart-8:   #EC4899    /* Pink — eighth series */
```

### Forecast-Specific Colors

```
--forecast-actual:        #F4F4F5    /* Actual historical data — near white */
--forecast-predicted:     #E84040    /* Predicted values — brand accent */
--forecast-confidence-95: rgba(232, 64, 64, 0.12)   /* 95% confidence band fill */
--forecast-confidence-80: rgba(232, 64, 64, 0.22)   /* 80% confidence band fill */
--forecast-trend-up:      #22C55E    /* Upward trend line */
--forecast-trend-down:    #EF4444    /* Downward trend line */
--forecast-trend-neutral: #71717A    /* Flat trend line */
--forecast-annotation:    #F59E0B    /* Annotation markers (launch, event) */
```

### Correlation Heatmap

```
--heatmap-strong-positive:  #E84040   /* r close to +1.0 */
--heatmap-mild-positive:    rgba(232, 64, 64, 0.50)
--heatmap-neutral:          #2E2E32   /* r near 0 */
--heatmap-mild-negative:    rgba(59, 130, 246, 0.50)
--heatmap-strong-negative:  #3B82F6   /* r close to -1.0 */
--heatmap-diagonal:         #52525B   /* Self-correlation (always 1.0) */
```

### Feature Importance Colors

```
--importance-high:    #E84040    /* Top 30% features */
--importance-medium:  #F59E0B    /* Mid 30-70% features */
--importance-low:     #71717A    /* Bottom 30% features */
--importance-bar-bg:  #2A2A2E   /* Bar track background */
```

### Model Comparison Colors

```
--model-best:       #22C55E    /* Best performing model — green accent */
--model-second:     #F59E0B    /* Second best */
--model-third:      #71717A    /* Third / worst */
--model-row-best:   rgba(34, 197, 94, 0.08)   /* Row highlight for best model */
```

### Chart Grid & Axis Rules

```
--chart-grid:       rgba(255,255,255,0.06)   /* Grid lines */
--chart-axis:       rgba(255,255,255,0.15)   /* Axis lines */
--chart-axis-label: #71717A                  /* Axis text */
--chart-tooltip-bg: #1E1E21                  /* Tooltip background */
--chart-tooltip-border: #3A3A3F              /* Tooltip border */
```

---

## 4. TYPOGRAPHY TOKENS

### Font Stack

```
--font-sans:    'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-mono:    'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace
--font-display: 'Inter', sans-serif    /* Same as sans — no display-specific font */
```

> **Agent Note:** Load Inter from Google Fonts. JetBrains Mono for all code, metric values, and numeric data in tables.

### Type Scale

```
--text-xs:    11px / line-height: 16px / letter-spacing: 0.02em
--text-sm:    13px / line-height: 20px / letter-spacing: 0.01em
--text-base:  15px / line-height: 24px / letter-spacing: 0
--text-lg:    17px / line-height: 28px / letter-spacing: -0.01em
--text-xl:    20px / line-height: 32px / letter-spacing: -0.02em
--text-2xl:   24px / line-height: 36px / letter-spacing: -0.02em
--text-3xl:   30px / line-height: 40px / letter-spacing: -0.03em
--text-4xl:   36px / line-height: 44px / letter-spacing: -0.03em
--text-5xl:   48px / line-height: 56px / letter-spacing: -0.04em
--text-6xl:   64px / line-height: 72px / letter-spacing: -0.05em
```

### Font Weights

```
--font-normal:    400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
```

### Typographic Roles

| Role | Size | Weight | Color | Usage |
|---|---|---|---|---|
| page-title | 4xl | bold | text-primary | Hero headings, major screen titles |
| section-title | 2xl | semibold | text-primary | Section headings inside screens |
| card-title | lg | semibold | text-primary | Card headings, panel titles |
| body | base | normal | text-primary | All body copy |
| body-secondary | sm | normal | text-secondary | Supporting descriptions |
| label | xs | medium | text-secondary | Form labels, table headers |
| label-uppercase | xs | semibold | text-tertiary | Section labels, STEP indicators (letter-spacing: 0.08em, UPPERCASE) |
| metric-value | 4xl/5xl | bold | text-primary | KPI numbers, stats, large metrics — use font-mono |
| metric-label | xs | medium | text-secondary | Label under metric values — UPPERCASE |
| code | sm | normal | text-primary | Monospace content — use font-mono |
| caption | xs | normal | text-tertiary | Chart captions, footnotes |
| nav-item | sm | medium | text-secondary | Sidebar and top nav links |
| nav-active | sm | semibold | text-primary | Active nav state |

### Numeric Display Rule

> All numeric values displayed as metrics (R², RMSE, MAE, row counts, percentages) MUST use `font-mono`. This creates instant visual distinction between data and interface text — borrowed from Orderful's structured data presentation.

---

## 5. SPACING TOKENS

```
--space-0:    0px
--space-1:    4px
--space-2:    8px
--space-3:    12px
--space-4:    16px
--space-5:    20px
--space-6:    24px
--space-8:    32px
--space-10:   40px
--space-12:   48px
--space-16:   64px
--space-20:   80px
--space-24:   96px
--space-32:   128px
```

### Spacing Application Rules

| Context | Token |
|---|---|
| Component internal padding (dense) | space-3 / space-4 |
| Component internal padding (standard) | space-4 / space-6 |
| Component internal padding (spacious) | space-6 / space-8 |
| Card padding | space-6 |
| Section gap between cards | space-4 |
| Page section gap | space-12 / space-16 |
| Sidebar item padding | space-3 space-4 |
| Form field gap | space-4 |
| Form section gap | space-8 |
| Table cell padding | space-3 space-4 |
| Chart container padding | space-6 |

---

## 6. RADIUS TOKENS

```
--radius-none:   0px
--radius-sm:     4px    /* Inputs, small badges */
--radius-md:     6px    /* Buttons, cards */
--radius-lg:     8px    /* Modals, drawers, large cards */
--radius-xl:     12px   /* Chart containers, upload zones */
--radius-2xl:    16px   /* Feature cards on landing */
--radius-full:   9999px /* Pills, avatar circles ONLY */
```

> **Agent Note:** Forecast Forge uses sharp geometry. Default radius is md (6px). Avoid round elements. Only use radius-full for status indicator dots and avatar circles.

---

## 7. ELEVATION TOKENS

```
--shadow-none:   none
--shadow-sm:     0 1px 2px rgba(0,0,0,0.4)
--shadow-md:     0 4px 12px rgba(0,0,0,0.5)
--shadow-lg:     0 8px 24px rgba(0,0,0,0.6)
--shadow-xl:     0 16px 48px rgba(0,0,0,0.7)
--shadow-accent: 0 0 0 1px rgba(232,64,64,0.4)   /* Focus ring / accent glow */
--shadow-focus:  0 0 0 2px rgba(232,64,64,0.6)   /* Keyboard focus ring */
```

### Elevation Layers

| Layer | Shadow | Surface Color | Usage |
|---|---|---|---|
| 0 — Page | none | surface-0 | Page background |
| 1 — Card | shadow-sm | surface-1 | Standard cards |
| 2 — Raised Card | shadow-md | surface-2 | Hovered cards, sticky headers |
| 3 — Modal | shadow-lg | surface-2 | Modals, dialogs |
| 4 — Dropdown | shadow-xl | surface-2 | Dropdowns, tooltips, toasts |

---

## 8. MOTION TOKENS

```
--duration-instant:  0ms
--duration-fast:     100ms
--duration-normal:   200ms
--duration-slow:     350ms
--duration-slower:   500ms

--ease-default:      cubic-bezier(0.16, 1, 0.3, 1)   /* Expo out — snappy settle */
--ease-in:           cubic-bezier(0.4, 0, 1, 1)
--ease-out:          cubic-bezier(0, 0, 0.2, 1)
--ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1)  /* Subtle spring for cards */
```

### Motion Rules

| Interaction | Duration | Easing |
|---|---|---|
| Button hover | 100ms | ease-default |
| Card hover elevation | 200ms | ease-default |
| Modal open | 200ms | ease-default |
| Modal close | 150ms | ease-in |
| Sidebar expand/collapse | 250ms | ease-default |
| Toast enter | 300ms | ease-spring |
| Chart data render | 500ms | ease-out |
| Loading skeleton pulse | 1500ms | ease-in-out (infinite) |
| Page transition | 200ms | ease-out |
| Stepper transition | 350ms | ease-default |

---

## 9. LAYOUT TOKENS

```
--layout-sidebar-width:         240px
--layout-sidebar-collapsed:     64px
--layout-topbar-height:         56px
--layout-content-max-width:     1280px
--layout-content-padding:       32px
--layout-card-grid-gap:         16px
--layout-section-gap:           48px
```

### Grid System

Forecast Forge uses a 12-column grid.

```
Columns:        12
Gutter:         16px (--layout-card-grid-gap)
Margin:         32px (--layout-content-padding)
Breakpoints:
  sm:   640px
  md:   768px
  lg:   1024px
  xl:   1280px
  2xl:  1440px
```

### Column Span Rules for Data Screens

| Component | Span |
|---|---|
| Metric/Stat card (row of 4) | 3 cols each |
| Metric/Stat card (row of 3) | 4 cols each |
| Chart (primary, full) | 12 cols |
| Chart (half) | 6 cols |
| Chart (two-thirds) | 8 cols |
| Data table | 12 cols |
| Sidebar panel | 4 cols |
| Main content with sidebar | 8 cols |
| Feature Importance | 5 cols |
| Forecast Chart | 7 cols |

---

## 10. COMPONENT TOKENS & SPECIFICATIONS

### 10.1 Buttons

#### Primary Button
```
Background:       --color-accent-500
Background Hover: --color-accent-400
Background Active: --color-accent-600
Background Disabled: rgba(232,64,64,0.3)
Text:             --color-white
Text Disabled:    rgba(255,255,255,0.4)
Border:           none
Border Radius:    --radius-md
Padding:          10px 18px (sm) / 12px 24px (default) / 14px 32px (lg)
Font:             --text-sm, --font-semibold
Transition:       100ms ease-default
Min Width:        none
Height:           36px (sm) / 40px (default) / 44px (lg)
```

#### Secondary Button
```
Background:       transparent
Background Hover: --color-surface-3
Background Active: --color-surface-4
Border:           1px solid --color-border-default
Border Hover:     1px solid --color-border-strong
Text:             --color-text-primary
Border Radius:    --radius-md
Padding:          same as primary
```

#### Ghost Button
```
Background:       transparent
Background Hover: --color-white-05
Background Active: --color-white-10
Border:           none
Text:             --color-text-secondary
Text Hover:       --color-text-primary
Border Radius:    --radius-md
```

#### Danger Button
```
Background:       --color-error-subtle
Background Hover: --color-error-muted
Border:           1px solid --color-error-default
Text:             --color-error-strong
Border Radius:    --radius-md
```

#### Icon Button (square)
```
Width:  36px / 40px
Height: 36px / 40px
Padding: 0
Background: transparent
Background Hover: --color-white-05
Border Radius: --radius-md
```

### 10.2 Sidebar

```
Width:          240px (expanded) / 64px (collapsed)
Background:     --color-surface-1
Border Right:   1px solid --color-border-subtle
Top Padding:    16px
Bottom Padding: 16px

Logo Area:
  Height:       56px
  Padding:      0 20px
  Border Bottom: 1px solid --color-border-subtle

Section Label:
  Font:         --text-xs, --font-semibold
  Color:        --color-text-tertiary
  Padding:      20px 16px 8px 16px
  UPPERCASE:    yes
  Letter Spacing: 0.08em

Nav Item:
  Height:        36px
  Padding:       0 12px
  Border Radius: --radius-md
  Margin:        2px 8px
  Font:          --text-sm, --font-medium
  Color:         --color-text-secondary
  Icon Size:     16px
  Icon Color:    --color-text-tertiary
  Gap (icon-label): 10px

Nav Item Hover:
  Background:   --color-white-05
  Color:        --color-text-primary
  Icon Color:   --color-text-secondary

Nav Item Active:
  Background:   rgba(232,64,64,0.10)
  Color:        --color-text-primary
  Icon Color:   --color-accent-500
  Left Border:  2px solid --color-accent-500
  Border Radius: 0 6px 6px 0 (to allow left border)
```

### 10.3 Top Navigation

```
Height:         56px
Background:     --color-surface-1 (with backdrop-blur in transparent variant)
Border Bottom:  1px solid --color-border-subtle
Padding:        0 32px
Position:       sticky top-0
Z-index:        100

Breadcrumb:
  Font:         --text-sm
  Color:        --color-text-tertiary
  Separator:    "/" in --color-text-disabled
  Active:       --color-text-primary

Action Area:
  Gap between items: 8px
```

### 10.4 Wizard Stepper

```
Container:
  Background:   --color-surface-1
  Border:       1px solid --color-border-subtle
  Border Radius: --radius-lg
  Padding:      16px 24px

Step Indicator:
  Circle Size:  28px
  Border:       1px solid --color-border-default
  Border Radius: radius-full
  Font:         --text-xs, --font-semibold, font-mono

Step States:
  Pending:
    Background: --color-surface-3
    Border:     1px solid --color-border-default
    Text:       --color-text-disabled
    Label:      --color-text-tertiary
  Active:
    Background: --color-accent-500
    Border:     none
    Text:       --color-white
    Label:      --color-text-primary (semibold)
    Label Underline: 2px --color-accent-500
  Completed:
    Background: --color-success-muted
    Border:     1px solid --color-success-default
    Icon:       checkmark in --color-success-strong
    Label:      --color-text-secondary

Connector Line:
  Width: 100%
  Height: 1px
  Background Pending:   --color-border-subtle
  Background Completed: --color-success-default (animated fill)
```

### 10.5 Data Table

```
Container:
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-lg
  Overflow:      hidden

Header Row:
  Background:    --color-surface-2
  Border Bottom: 1px solid --color-border-default
  Height:        40px
  Font:          --text-xs, --font-semibold, UPPERCASE
  Color:         --color-text-tertiary
  Letter Spacing: 0.05em
  Padding:       0 16px

Body Row:
  Height:        44px
  Border Bottom: 1px solid --color-border-subtle
  Padding:       0 16px
  Font:          --text-sm
  Color:         --color-text-primary

Body Row Hover:
  Background:    --color-white-05

Body Row Selected:
  Background:    rgba(232,64,64,0.06)
  Border Left:   2px solid --color-accent-500

Numeric Cells:
  Font:          font-mono
  Align:         right

Sortable Column Header:
  Cursor:        pointer
  Icon:          ChevronUp/Down (16px, --color-text-disabled)
  Icon Hover:    --color-text-secondary

Pagination:
  Container:     border-top 1px solid --color-border-subtle
  Background:    --color-surface-1
  Height:        48px
  Font:          --text-sm
  Color:         --color-text-secondary
```

### 10.6 Metric Card / KPI Card

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-lg
  Padding:       24px

Label:
  Font:          --text-xs, --font-semibold, UPPERCASE
  Color:         --color-text-tertiary
  Letter Spacing: 0.08em
  Margin Bottom: 8px

Value:
  Font:          --text-4xl, --font-bold, --font-mono
  Color:         --color-text-primary

Trend Badge:
  Positive:      --color-success-default text, --color-success-subtle bg
  Negative:      --color-error-default text, --color-error-subtle bg
  Neutral:       --color-text-tertiary text, --color-surface-3 bg
  Font:          --text-xs, --font-semibold
  Border Radius: --radius-sm
  Padding:       2px 6px

Icon:
  Size:          20px
  Color:         --color-text-tertiary
  Position:      top-right of card
```

### 10.7 Dataset Card

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-lg
  Padding:       20px 24px
  Cursor:        pointer
  Transition:    200ms ease-default

Hover:
  Border:        1px solid --color-border-strong
  Background:    --color-surface-2
  Shadow:        --shadow-md

File Icon Area:
  Background:    rgba(232,64,64,0.10)
  Border Radius: --radius-md
  Size:          40px × 40px
  Icon:          TableIcon, 20px, --color-accent-500

Dataset Name:
  Font:          --text-base, --font-semibold
  Color:         --color-text-primary

Meta Row (rows × cols × size):
  Font:          --text-xs, --font-mono
  Color:         --color-text-tertiary
  Gap:           16px between items

Status Badge:
  Uploaded:   --color-info-default text, --color-info-subtle bg
  Cleaned:    --color-success-default text, --color-success-subtle bg
  Analysed:   --color-accent-500 text, rgba(232,64,64,0.10) bg
```

### 10.8 Model Card

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-lg
  Padding:       24px

Best Model Badge:
  Background:    --color-success-subtle
  Border:        1px solid --color-success-default
  Text:          "BEST MODEL"
  Font:          --text-xs, --font-semibold
  Color:         --color-success-strong

Model Type Label:
  Font:          --text-lg, --font-semibold
  Color:         --color-text-primary

Metrics Grid (2×2):
  Each metric:
    Label:  --text-xs, UPPERCASE, --color-text-tertiary
    Value:  --text-xl, --font-bold, --font-mono, --color-text-primary

Accuracy Bar:
  Track:    --color-surface-3, height 4px, radius-full
  Fill:     --color-accent-500 (for best) / --color-success-default / --color-warning-default
  Animated: left-to-right on mount, 500ms ease-out
```

### 10.9 Chart Container

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-xl
  Padding:       24px

Chart Header:
  Title:         --text-base, --font-semibold, --color-text-primary
  Subtitle:      --text-sm, --color-text-secondary
  Actions (download, fullscreen): ghost icon buttons, right-aligned

Chart Body:
  Padding Top:   16px
  Min Height:    280px

Legend:
  Position:      below chart
  Font:          --text-xs, --color-text-secondary
  Dot size:      8px, radius-full

Tooltip:
  Background:    --color-surface-2
  Border:        1px solid --color-border-default
  Border Radius: --radius-md
  Padding:       8px 12px
  Shadow:        --shadow-xl
  Font:          --text-sm
  Value Font:    --font-mono
```

### 10.10 Upload Zone

```
Container:
  Background:       --color-surface-1
  Border:           2px dashed --color-border-default
  Border Radius:    --radius-xl
  Padding:          48px 32px
  Text Align:       center
  Cursor:           pointer
  Transition:       200ms

Hover / Drag Active:
  Background:       rgba(232,64,64,0.04)
  Border:           2px dashed --color-accent-500

Icon:
  Size:             40px
  Color:            --color-text-tertiary
  Margin Bottom:    16px

Primary Text:
  Font:             --text-base, --font-semibold
  Color:            --color-text-primary

Secondary Text:
  Font:             --text-sm
  Color:            --color-text-secondary
  Margin Top:       4px

Supported Formats:
  Font:             --text-xs, --font-mono
  Color:            --color-text-tertiary
  Background:       --color-surface-3
  Border Radius:    --radius-sm
  Padding:          2px 8px

Browse Button:
  Style:            ghost button with accent text color
  Text Color:       --color-accent-400
```

### 10.11 AI Insight Card

This component conveys AI-generated analysis. It must feel helpful and transparent — never mysterious.

```
Container:
  Background:       rgba(232,64,64,0.04)
  Border:           1px solid rgba(232,64,64,0.20)
  Border Left:      3px solid --color-accent-500
  Border Radius:    --radius-lg
  Padding:          16px 20px

Header:
  Icon:             SparklesIcon / BrainIcon, 16px, --color-accent-400
  Label:            "AI INSIGHT"
  Font:             --text-xs, --font-semibold, UPPERCASE
  Color:            --color-accent-400
  Letter Spacing:   0.08em
  Gap:              6px between icon and label

Body Text:
  Font:             --text-sm
  Color:            --color-text-primary
  Line Height:      1.6
  Margin Top:       8px

Source Tag:
  Text:             e.g., "Based on: Random Forest, 1,243 samples"
  Font:             --text-xs, --font-mono
  Color:            --color-text-tertiary
  Margin Top:       12px
```

### 10.12 Feature Importance Card

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-lg
  Padding:       24px

Title:           "Feature Importance"
Subtitle:        "Which columns drive predictions most"

Bar Item:
  Label:         --text-sm, --color-text-primary, left-aligned
  Bar Track:     --color-surface-3, height 8px, radius-full
  Bar Fill:      gradient from --importance-high → --importance-medium based on rank
  Value:         --text-sm, --font-mono, --color-text-secondary, right-aligned
  Row Height:    36px
  Gap between rows: 4px

Rank Badge:
  Position:      before label
  Font:          --text-xs, --font-mono, --color-text-disabled
  Width:         24px (right-aligned number e.g. "01")
```

### 10.13 Prediction Card / Result Card

```
Container:
  Background:       --color-surface-2
  Border:           1px solid --color-border-default
  Border Radius:    --radius-lg
  Padding:          24px

Result Banner:
  Background:       rgba(232,64,64,0.08)
  Border:           1px solid rgba(232,64,64,0.25)
  Border Radius:    --radius-md
  Padding:          16px 20px

Predicted Value:
  Label:            "PREDICTED VALUE"
  Font-label:       --text-xs, --font-semibold, UPPERCASE, --color-text-tertiary
  Font-value:       --text-5xl, --font-bold, --font-mono, --color-text-primary

Confidence Range:
  Label:            "Confidence Range (95%)"
  Font:             --text-sm, --color-text-secondary
  Values:           --font-mono, --color-text-primary

Input Summary:
  List of feature: value pairs
  Label:            --text-xs, --color-text-tertiary
  Value:            --text-sm, --font-mono, --color-text-primary
  Border Bottom:    1px solid --color-border-subtle between rows
```

### 10.14 Form Inputs

```
Input Field:
  Height:           40px
  Background:       --color-surface-4
  Border:           1px solid --color-border-default
  Border Radius:    --radius-md
  Padding:          0 12px
  Font:             --text-sm, --color-text-primary
  Placeholder:      --color-text-disabled

  Focus:
    Border:         1px solid --color-accent-500
    Shadow:         --shadow-focus
    Outline:        none

  Error:
    Border:         1px solid --color-error-default
    Background:     rgba(239,68,68,0.05)

  Disabled:
    Opacity:        0.5
    Cursor:         not-allowed
    Background:     --color-surface-3

Label:
  Font:             --text-sm, --font-medium
  Color:            --color-text-secondary
  Margin Bottom:    6px

Error Message:
  Font:             --text-xs
  Color:            --color-error-default
  Icon:             AlertCircle 12px
  Margin Top:       4px
  Gap:              4px

Help Text:
  Font:             --text-xs
  Color:            --color-text-tertiary
  Margin Top:       4px
```

### 10.15 Dropdown / Select

```
Trigger:
  Same as Input Field
  Icon:             ChevronDown 16px, --color-text-tertiary, right-aligned

Menu:
  Background:       --color-surface-2
  Border:           1px solid --color-border-default
  Border Radius:    --radius-lg
  Shadow:           --shadow-xl
  Padding:          4px
  Max Height:       280px
  Overflow Y:       auto

Menu Item:
  Height:           36px
  Padding:          0 12px
  Border Radius:    --radius-md
  Font:             --text-sm
  Color:            --color-text-primary

  Hover:
    Background:     --color-white-05

  Selected:
    Background:     rgba(232,64,64,0.10)
    Color:          --color-accent-400
    Checkmark:      16px, --color-accent-500, right side
```

### 10.16 Tabs

```
Tab Bar:
  Border Bottom:    1px solid --color-border-subtle
  Gap:              0

Tab Item:
  Height:           44px
  Padding:          0 16px
  Font:             --text-sm, --font-medium
  Color:            --color-text-secondary
  Border Bottom:    2px solid transparent
  Cursor:           pointer
  Transition:       100ms

  Hover:
    Color:          --color-text-primary

  Active:
    Color:          --color-text-primary
    Border Bottom:  2px solid --color-accent-500
    Font Weight:    --font-semibold
```

### 10.17 Modal

```
Overlay:
  Background:       rgba(0,0,0,0.7)
  Backdrop Filter:  blur(4px)

Container:
  Background:       --color-surface-2
  Border:           1px solid --color-border-default
  Border Radius:    --radius-xl
  Shadow:           --shadow-xl
  Width:            480px (sm) / 640px (md) / 800px (lg)
  Max Height:       85vh
  Overflow Y:       auto

Header:
  Padding:          20px 24px
  Border Bottom:    1px solid --color-border-subtle
  Title:            --text-lg, --font-semibold
  Close Button:     ghost icon button, top-right

Body:
  Padding:          24px

Footer:
  Padding:          16px 24px
  Border Top:       1px solid --color-border-subtle
  Justify:          right
  Gap:              8px
```

### 10.18 Toast / Notification

```
Container:
  Background:       --color-surface-2
  Border:           1px solid --color-border-default
  Border Radius:    --radius-lg
  Shadow:           --shadow-xl
  Padding:          12px 16px
  Max Width:        380px
  Position:         fixed, bottom-right (bottom: 24px, right: 24px)
  Gap between toasts: 8px

Icon:
  Size:             18px
  Success:          --color-success-default
  Error:            --color-error-default
  Warning:          --color-warning-default
  Info:             --color-info-default

Title:
  Font:             --text-sm, --font-semibold
  Color:            --color-text-primary

Description:
  Font:             --text-sm
  Color:            --color-text-secondary

Close:
  Ghost icon button, 24×24px, top-right

Auto-dismiss:
  Success:          4000ms
  Error:            never (manual dismiss)
  Warning:          6000ms
  Info:             4000ms
```

### 10.19 Empty State

```
Container:
  Padding:          64px 32px
  Text Align:       center

Icon Container:
  Background:       --color-surface-3
  Border:           1px dashed --color-border-default
  Border Radius:    --radius-xl
  Width:            64px
  Height:           64px
  Margin:           0 auto 20px
  Icon Size:        28px
  Icon Color:       --color-text-disabled

Title:
  Font:             --text-base, --font-semibold
  Color:            --color-text-primary
  Margin Bottom:    8px

Description:
  Font:             --text-sm
  Color:            --color-text-secondary
  Max Width:        320px
  Margin:           0 auto 24px

CTA Button:
  Style:            primary or secondary button
  Margin:           0 auto
```

### 10.20 Loading States

#### Skeleton Loader
```
Background:    linear-gradient(90deg, --color-surface-2 0%, --color-surface-3 50%, --color-surface-2 100%)
Background Size: 400% 100%
Animation:     shimmer 1.5s ease-in-out infinite
Border Radius: --radius-md (match content shape)
```

#### Page Spinner
```
Size:          40px
Color:         --color-accent-500
Animation:     spin 800ms linear infinite
Position:      centered in content area
```

#### Progress Bar (for training)
```
Track:         --color-surface-3, height 4px, radius-full
Fill:          --color-accent-500, animated width
Animated Fill: transition width 300ms ease-default
With Step Text: --text-xs, --color-text-secondary, below bar
```

### 10.21 Error State

```
Icon:          AlertTriangle or XCircle, 40px, --color-error-default
Title:         --text-lg, --font-semibold, --color-text-primary
Message:       --text-sm, --color-text-secondary
Code:          --text-xs, --font-mono, --color-error-default (if technical error code shown)
Retry Button:  secondary button
Support Link:  ghost button with accent color text
```

### 10.22 Success State

```
Icon:          CheckCircle, 40px, --color-success-default
Background:    --color-success-subtle (subtle tint behind icon)
Title:         --text-lg, --font-semibold, --color-text-primary
Message:       --text-sm, --color-text-secondary
CTA:           primary button (Next step action)
```

### 10.23 Forecast Visualization Panel

This is the primary hero component for the forecast output screen.

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-xl
  Padding:       24px

Chart Section:
  Height:        360px minimum
  Chart Type:    Line chart
  Grid:          --chart-grid (subtle horizontal lines only)
  Axis:          --chart-axis (x-axis only)
  Axis Labels:   --chart-axis-label

Line Specs:
  Actual:        stroke --forecast-actual, width 2px, solid
  Predicted:     stroke --forecast-predicted, width 2px, solid
  Confidence 95%: fill --forecast-confidence-95 (area between upper/lower)
  Confidence 80%: fill --forecast-confidence-80

Annotation Markers:
  Style:         vertical dashed line, --forecast-annotation
  Tooltip:       event label above line

Summary Row (below chart):
  Background:    --color-surface-2
  Border Top:    1px solid --color-border-subtle
  Padding:       16px 24px
  Metrics:       RMSE, MAE, R² — displayed as inline stat chips
  Font:          --font-mono for values
```

### 10.24 Model Comparison Panel

```
Container:
  Background:    --color-surface-1
  Border:        1px solid --color-border-subtle
  Border Radius: --radius-xl

Header:
  Padding:       20px 24px
  Border Bottom: 1px solid --color-border-subtle

Table:
  Column 1: Model Name (160px)
  Column 2: MAE (right-aligned, mono)
  Column 3: RMSE (right-aligned, mono)
  Column 4: R² (right-aligned, mono)
  Column 5: Action (right-aligned)

Best Row Highlight:
  Background:    --model-row-best
  Left Border:   3px solid --model-best

Rank Badges:
  #1: background --color-success-subtle, text --color-success-strong
  #2: background --color-warning-subtle, text --color-warning-strong
  #3: background --color-surface-3, text --color-text-tertiary
```

---

## 11. DATA VISUALIZATION RULES

### Line Charts

- Grid: horizontal only, --chart-grid, no vertical grid
- Axis: x-axis only visible by default, --chart-axis
- Labels: --chart-axis-label, 11px, font-mono
- Dots: shown only on hover (not on every data point)
- Smooth: curves are preferred over straight-line segments (tension: 0.4)
- Colors: use chart-1 for primary, chart-2 for secondary
- Tooltip: show on hover with crosshair cursor

### Bar Charts

- Bar Width: 60% of available column space
- Bar Radius: 3px top-left, top-right only (flat bottom)
- Gap: 40% of available column space
- Hover: increase opacity to 100%, add thin accent border
- Label: optional, shown above bar for top value
- Selected/Highlighted: use chart-1 color, others dimmed to opacity-40

### Scatter Plots

- Dot Size: 6px default (radius)
- Dot Border: 1px solid rgba(255,255,255,0.15)
- Hover: scale to 10px, show tooltip
- Regression Line: dashed, --color-accent-500, opacity 70%

### Histograms

- Bar Color: --chart-1 at 70% opacity
- Bar Hover: 100% opacity
- Mean Line: dashed, --color-warning-default
- Median Line: dashed, --color-info-default

### Heatmaps (Correlation)

- Use heatmap color scale defined in Color Tokens
- Cell Text: --font-mono, --text-xs, centered
- Cell Border: 1px solid --color-surface-0
- Diagonal: --heatmap-diagonal fill
- Axis Labels: --font-mono, --text-xs, 45-degree rotation for x-axis

---

## 12. AI FEATURE DESIGN LANGUAGE

### Core Principle

AI in Forecast Forge must NEVER feel like magic or a black box. Every AI output must be traceable to data. Every AI recommendation must explain its reasoning.

### AI Indicator System

```
AI Badge:
  Text:          "AI"
  Background:    rgba(232,64,64,0.15)
  Border:        1px solid rgba(232,64,64,0.35)
  Color:         --color-accent-400
  Font:          --text-xs, --font-semibold
  Border Radius: --radius-sm
  Padding:       1px 5px

AI-Generated Content Border:
  Left Border:   3px solid --color-accent-500
  Background:    rgba(232,64,64,0.03)

AI Processing State:
  Use pulsing left-border animation instead of spinner for inline AI
  Animation: pulse opacity 0.5 → 1.0, 1000ms ease-in-out infinite
```

### SHAP / Explainability Views (Future Stage 3)

```
Waterfall Chart:
  Positive contributions: --color-success-default bars
  Negative contributions: --color-error-default bars
  Base value line: --color-text-tertiary, dashed
  Final value line: --color-accent-500, solid
  Labels: --font-mono, --text-xs

Force Plot:
  Arrow colors: same as waterfall
  Background: --color-surface-1
```

---

## 13. RESPONSIVE BEHAVIOR

### Layout Strategy

Forecast Forge is desktop-first. Mobile is not in MVP scope.

```
≥ 1280px:   Full layout. Sidebar 240px. All columns visible.
1024–1279px: Sidebar collapses to 64px (icon-only). Content adapts.
768–1023px:  Sidebar becomes a drawer (hidden by default). 
             Charts stack vertically. Grid collapses to 2-col.
< 768px:    Not officially supported in MVP. Gracefully degrade.
             Show "Best viewed on desktop" banner.
```

### Chart Responsiveness

- All chart containers MUST use `width: 100%` from parent, not fixed pixel widths
- Use `ResponsiveContainer` wrapper (Recharts) or equivalent
- Minimum chart height: 200px on small screens, 280px standard, 360px large views

---

## 14. ACCESSIBILITY

### Requirements (WCAG 2.1 AA)

- All text ≥ 4.5:1 contrast ratio against background
- Large text (18px+ or 14px bold) ≥ 3:1 contrast ratio
- All interactive elements have visible focus states (--shadow-focus)
- Focus order follows logical DOM order (top-to-bottom, left-to-right)
- No information conveyed by color alone — always pair with icon or text
- All images and icons used as content have `aria-label`
- All form inputs have explicit `<label>` elements (not placeholder-only)
- Chart data available as accessible table (`<details>` or visually hidden)
- Modal traps focus inside when open
- Keyboard shortcuts: Escape closes modal/drawer, Tab navigates interactive elements

### ARIA Usage Rules

```
Sidebar nav:     role="navigation", aria-label="Main navigation"
Wizard stepper:  role="list" > role="listitem" per step
Loading state:   aria-live="polite", aria-busy="true"
Chart:           role="img", aria-label="{chart-title} chart"
Toast:           role="status" (info/success) or role="alert" (error)
Modal:           role="dialog", aria-modal="true", aria-labelledby
Error message:   aria-describedby on related input
```

---

## 15. KNOWN GAPS (POST-MVP)

| Gap | Description | Scheduled Stage |
|---|---|---|
| Light Mode | Light theme tokens defined but not tested | Post-MVP |
| Mobile Layout | No mobile breakpoint design specified | Post-MVP |
| SHAP Views | Component specs placeholder only | Stage 3 |
| Animation Library | Motion tokens defined; not enforced by a shared library | Stage 2 |
| Chart Theming | Charts don't auto-switch with theme toggle | Post-MVP |
| Dark/Light Toggle | Token infrastructure ready; toggle UI not designed | Post-MVP |
| PDF Report Styling | Export styling tokens not specified | Stage 4 |
| Skeleton for Charts | Skeleton shape undefined for variable chart heights | Sprint 4 |
| i18n Typography | Right-to-left layout not specified | Not planned |

---

## 16. USAGE RULES FOR AI CODING AGENTS

### Mandatory Rules

1. **NEVER** introduce a color value not defined in this file's color tokens.
2. **NEVER** use a font size not in the type scale — if you need something, round to nearest token.
3. **ALWAYS** use `--font-mono` for all numeric metric values (MAE, RMSE, R², row counts, percentages).
4. **ALWAYS** apply the wizard stepper on any multi-step workflow screen.
5. **NEVER** use gradients on UI surfaces (only allowed in heatmap data and chart fills).
6. **ALWAYS** use dark theme (`--color-surface-0` as page background) unless user explicitly toggles light.
7. **NEVER** add decorative illustrations or icons not serving a functional purpose.
8. **ALWAYS** add empty state, loading state, and error state for every data-dependent component.
9. **NEVER** show raw Python tracebacks to users — map all backend errors to user-facing messages.
10. **ALWAYS** left-border AI Insight cards with `3px solid --color-accent-500`.

### Component Selection Rules

| Situation | Component to use |
|---|---|
| Showing a KPI number | Metric Card |
| Showing file status | Dataset Card with status badge |
| Multi-step process | Wizard Stepper |
| Tabular data preview | Data Table |
| Trained model results | Model Card |
| Forecast output | Forecast Visualization Panel |
| AI-generated text | AI Insight Card |
| Feature ranking | Feature Importance Card |
| Single prediction result | Prediction Card |
| Chart of any type | Chart Container wrapper |
| Upload prompt | Upload Zone |

---

*End of DESIGN.md — Forecast Forge v1.0*
