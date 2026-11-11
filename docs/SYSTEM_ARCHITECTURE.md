# CHESSMIND ACADEMY — SYSTEM ARCHITECTURE

**Version:** 1.0.0  
**Status:** Approved  
**Architecture Category:** Modular TypeScript Web Application (SPA + Server-Side AI & Engine Adapter)

---

## 1. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  +--------------------+  +----------------------+  +----------------------------+ |
|  |   Navigation /     |  |   Interactive Board  |  |   AI Coach Studio UI       | |
|  |   App Layout       |  |   - SVG Pieces       |  |   - Chat & Speech Mode     | |
|  |   - TopNav         |  |   - Move Arrows      |  |   - Contextual Guidance    | |
|  |   - AcademyNav     |  |   - Square Highlight |  |   - Difficulty Selector    | |
|  +--------------------+  +----------------------+  +----------------------------+ |
|  +--------------------+  +----------------------+  +----------------------------+ |
|  |   Curriculum       |  |   Practice Arena     |  |   Game Analysis Studio     | |
|  |   Viewer & Tests   |  |   - Engine AI Bot    |  |   - Eval Graph & Mistakes  | |
|  |   - Stages 1 to 6  |  |   - Move History     |  |   - Blunder Classification | |
|  +--------------------+  +----------------------+  +----------------------------+ |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           CORE APPLICATION SERVICES                               |
|  +---------------------------+  +-----------------------------------------------+ |
|  | Chess Rules Engine        |  | AI Teaching Orchestrator (Layer C)            | |
|  | - chess.js (validation)   |  | - Lesson Goal Context                         | |
|  | - FEN/PGN state machine   |  | - Graduated Hints System                      | |
|  | - Legal move generation   |  | - Board Action Dispatcher                     | |
|  +---------------------------+  +-----------------------------------------------+ |
|  +---------------------------+  +-----------------------------------------------+ |
|  | Board Action Validator    |  | Engine Analysis Service                       | |
|  | - Schema guard (Layer D)  |  | - UCI / Evaluation provider                   | |
|  | - Move legality verify    |  | - Centipawn / Mate calculation                | |
|  +---------------------------+  +-----------------------------------------------+ |
|  +---------------------------+  +-----------------------------------------------+ |
|  | Adaptive Student Profile  |  | State Persistence Manager                     | |
|  | - Weakness detector       |  | - LocalStorage sync                           | |
|  | - XP, streaks, metrics    |  | - Supabase PostgreSQL compatible schema      | |
|  +---------------------------+  +-----------------------------------------------+ |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        EXTERNAL / SERVER-SIDE SERVICES                            |
|  - Google Gemini API / LLM Providers (Server-side proxy with fallback)            |
|  - Supabase Database & Auth (PostgreSQL with RLS policies)                        |
|  - Web Audio Synthesizer (Zero-latency move, capture, check sound effects)       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Layered Component Boundaries

### 2.1 UI Layer (`src/components/`)
- Purely presentation and user interaction.
- Dispatches user intent (e.g. piece drop, button click, chat input) to domain stores/services.
- Never runs unvalidated board state mutations.

### 2.2 Chess Domain Core (`src/lib/chess/`)
- Encapsulates `chess.js` for 100% legal chess rule compliance (castling rights, en passant, promotion, checkmate, stalemate, 50-move rule, threefold repetition).
- Generates legal moves, fen notation, sanity-checked move application.
- Exposes pure utility functions decoupled from UI rendering to enable millisecond unit testing via `node:test`.

### 2.3 AI Teaching Orchestration (`src/lib/ai/`)
- Implements the 5-layer teaching pipeline:
  - **Layer A**: Provider Adapter (Gemini, Claude, OpenAI).
  - **Layer B**: Chess Context Builder (FEN, history, student Elo, lesson objectives).
  - **Layer C**: Pedagogical Orchestrator (formulate prompt, select teaching posture).
  - **Layer D**: Action Validator (strictly validates structured actions before execution).
  - **Layer E**: Learning Assessment (exercise evaluation and weakness attribution).

### 2.4 Curriculum Knowledge Base (`src/lib/curriculum/`)
- Structured, data-driven course definitions covering Stages 1 to 6.
- Each lesson contains theory, demo positions, guided steps, exercises, and knowledge checks.
