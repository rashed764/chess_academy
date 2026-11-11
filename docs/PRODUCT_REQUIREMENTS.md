# CHESSMIND ACADEMY — PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version:** 1.0.0  
**Status:** Approved / Active Baseline  
**Target Category:** AI-Powered Chess Education Platform & Online University  
**Core Motto:** *"Learn Chess. Understand Chess. Master Chess."*

---

## 1. Executive Summary & Vision

ChessMind Academy is a world-class digital chess university engineered to take an absolute beginner—someone who has never touched a chessboard or knows nothing about the pieces—and guide them systematically to competitive, tournament-grade tactical and strategic mastery.

Unlike typical platforms that prioritize mindless blitz matches or generic LLM chatbots with no chess engine grounding, ChessMind Academy places **pedagogy first**:
1. Chess rules and moves are always strictly validated by a chess rules engine (`chess.js`).
2. Chess evaluations and blunder assessments derive from real engine analysis, never fabricated text.
3. Every lesson has measurable learning outcomes, interactive board demonstrations, student exercises, instant feedback, and knowledge checks.
4. An adaptive AI Coach acts as a patient, master instructor who demonstrates moves, highlights tactical geometric themes (forks, pins, skewers, outposts, pawn structures), adapts explanations to the student's rating, and maintains contextual memory.
5. All progress (XP, streaks, lesson completions, puzzle ratings, accuracy metrics) is tracked and persisted.

---

## 2. Target Personas & Learning Profiles

| Persona | Starting Knowledge | Goal | Primary Journey |
|---|---|---|---|
| **Absolute Beginner (Elo 100-600)** | Zero chess knowledge. Doesn't know how pieces move. | Understand board layout, piece mechanics, legal moves, check, checkmate. | Stage 1 curriculum with step-by-step visual highlights and zero-jargon coach. |
| **Beginner Student (Elo 600-1100)** | Knows rules, but leaves pieces hanging, falls into scholar's mate. | Master opening principles (center control, king safety, development), 1-move tactics. | Stage 2 curriculum, daily blunder checks, 1-move tactical trainer. |
| **Intermediate Trainee (Elo 1100-1600)** | Plays regular games, struggles with deeper tactics and pawn structures. | Forks, pins, skewers, discovered checks, removing defenders, basic endgames. | Stage 3 & 4 curriculum, tactical theme arena, engine game post-mortem. |
| **Advanced Competitor (Elo 1600-2000+)** | Strong tactician, needs positional mastery and opening repertoire. | Prophylaxis, pawn breaks, minor piece imbalances, deep endgame calculation. | Stage 5 & 6 master preparation, repertoire builder, deep engine analysis studio. |

---

## 3. Product Principles (Non-Negotiable)

1. **Education Precedes Gamification:** Badges and XP reinforce real learning rather than incentivizing mindless clicking.
2. **AI Teaches, Not Just Talks:** AI does not merely output chat bubbles; it manipulates the board through validated actions (`HIGHLIGHT_SQUARES`, `DRAW_ARROW`, `SET_POSITION`, `PLAY_MOVE`).
3. **Engine-Validated Truth:** All evaluations and puzzle solutions are verified by rules engines; no hallucinated legalities.
4. **Resilient Persistence:** User state, lesson attempts, and games are persisted with local storage fallback and Supabase schema compatibility.
5. **Universal Accessibility:** Responsive design across mobile, tablet, and desktop viewports, with keyboard accessibility and high-contrast board themes.
