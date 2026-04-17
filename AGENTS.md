## Probabilist: AGENTS.md

### Overview

Probabilist is a specialized computation engine designed to model risk and reliability through discrete and continuous probability distributions. By transforming raw input (Manual, CSV, XLSX) into a unified statistical interface, the system provides high-stakes decision support for engineering redundancy and medical trial efficacy.

### Core Sectors

- **Engineering:** Focuses on system availability and reliability. Models $n$-component clusters with independent failure probabilities ($p_i$) to determine the probability of $k$-successes (uptime) and calculates the required redundancy to reach "five-nines" (99.999%) reliability.
- **Medicine:** Focuses on clinical trial success and diagnostic accuracy. Utilizes binomial distributions to calculate the probability of treatment approval based on patient sample size ($n$) and efficacy rates ($p$).

---

### Engineering Principles

- **Architecture:** Follows SOLID, KISS, DRY, and YAGNI.
- **Patterns:** Single Responsibility Principle (SRP) for data transformers and the `compute` engine.
- **Design:** "Noir/Zen" minimalist aesthetic using high-contrast visual hierarchy and "pixel-perfect" UI/UX.

---

### Tech Stack

- **Framework:** TanStack Start (SSR, Server Functions).
- **State:** TanStack Store (Client-side global state).
- **Styling:** TailwindCSS V4, ShadcnUI.
- **Animations:** react-awesome-reveal
- **Parsers:** XLSX, PapaParse.
- **Storage:** Browser `localStorage` for session history; Cookies for JWT-based admin sessions (6h).

---

### Application Flow

#### 1. Home (`/`)

- Entry point for sector selection: **Medicine** or **Engineering**.
- Directs to `/preview?sector=[type]`.

#### 2. Preview (`/preview`)

- **Input Methods:** Manual, CSV, or Excel.
- **Processing:** 1. Reads file as Base64. 2. Calls `transformCSV` or `transformExcel` from `@/lib/data`. 3. Normalizes data into the `StatisticalTask` interface. 4. Updates Store via `setTransformedTasks`.
- **UX:** Triggers loading state during transformation and redirects to `/dashboard` upon completion.

#### 3. Dashboard (`/dashboard`)

- **Access Control:** Admin gate utilizing `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`.
- **Authentication:** Server-side verification via TanStack Start Server Functions; sets a 6h JWT cookie.
- **Display:** \* Statistical computation results (Mean, Variance, PMF/CDF).
  - Charts representing input distribution vs. output success probability.
  - Prescriptive Analytics: Calculated $n$ required for specific uptime/success targets (e.g., 99.99%).
  - **Sidebar:** Historical data suites persisted in `localStorage`.

---

### AI Interaction Protocol

- **Conciseness:** Zero fluff. No conversational filler or affirmations.
- **Precision:** If a prompt is ambiguous, stop and ask for clarification.
- **Code Quality:** \* No comments.
  - Strict adherence to ESLint/Prettier: `single quote`, `no semicolon`, `trailing commas: all`.
  - Standardized TailwindCSS V4 syntax.
- **Robustness:** Resolve hydration conflicts and async race conditions.
- **Tone:** Grounded, direct, and technical.

**Bad example:**
"That's a classic react conflicts. This might have happened because of...."

**Good example:**
"This happened cause of ..."

---

### Statistical Interface

```typescript
interface StatisticalDistribution {
  sector: 'engineering' | 'medicine'

  n: number
  p: number | number[]
  k: number
}
```
