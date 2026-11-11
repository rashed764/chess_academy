# CHESSMIND ACADEMY — TESTING STRATEGY

**Philosophy:** Test-driven logic decoupled from rendering, combined with browser automation verification under Ultra Mode.

---

## 1. Fast-Feedback Pure Logic Unit Tests (`node:test`)
- **Framework:** Node.js native test runner via `npx --yes tsx --test <test_file>`.
- **Scope:**
  - Chess legal move validation (`chess.js` integration).
  - Checkmate and stalemate identification.
  - Board action validation (ensuring invalid squares or illegal moves are rejected).
  - Curriculum progression logic and XP calculation.
  - Centipawn evaluation conversion and tactical blunder classification.

---

## 2. Browser Verification (Ultra Mode with Playwright CLI)
- **Tooling:** Headless Chromium via `playwright-cli`.
- **Viewport coverage:** Desktop (1440x900) and Mobile (390x844).
- **Core Verification Journeys:**
  1. **Journey 1 — Curriculum & Interactive Lesson:** Student navigates to Stage 1, launches "The Knight's Leap", reads instruction, plays legal move on board, receives instant validation, and earns XP.
  2. **Journey 2 — Practice Arena:** Student starts a game against the Engine Bot, plays e2-e4, bot responds with legal move, captured piece list updates, and move notation renders in history.
  3. **Journey 3 — Tactical Puzzle & Hint:** Student solves a fork puzzle, uses a graduated hint, executes the correct tactic, and sees confetti celebration + rating increment.
