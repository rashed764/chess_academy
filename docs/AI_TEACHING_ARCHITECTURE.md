# CHESSMIND ACADEMY — AI TEACHING ARCHITECTURE

**Version:** 1.0.0  
**Status:** Approved Specification  
**Core Responsibility:** Convert raw chess positions, moves, and pedagogical goals into interactive, validated chess tutoring.

---

## 1. The 5-Layer AI Teaching Pipeline

```
+-------------------------------------------------------------+
| Layer E: Learning Assessment                                |
| - Evaluates move intent, tracks recurring error patterns   |
+-------------------------------------------------------------+
                              ^
                              |
+-------------------------------------------------------------+
| Layer D: Board Action Validator                             |
| - Verifies move legality via chess.js                       |
| - Sanitizes and rejects invalid square coordinates/arrows   |
+-------------------------------------------------------------+
                              ^
                              |
+-------------------------------------------------------------+
| Layer C: Teaching Orchestrator                              |
| - Determines pedagogical stance (Socratic hint vs demo)     |
| - Constructs structured JSON instructions                   |
+-------------------------------------------------------------+
                              ^
                              |
+-------------------------------------------------------------+
| Layer B: Chess Context Builder                              |
| - Compiles FEN, Move History, Student Elo, Lesson Goal      |
+-------------------------------------------------------------+
                              ^
                              |
+-------------------------------------------------------------+
| Layer A: LLM Provider Adapter                               |
| - Communicates with Gemini / Anthropic / OpenAI             |
| - Handles fallback, timeouts, and JSON parsing              |
+-------------------------------------------------------------+
```

---

## 2. Action Schema & Types

The AI cannot run arbitrary code on the client. It must return structured JSON conforming to the `TeachingAction` interface:

```typescript
export type BoardActionType =
  | 'SET_POSITION'
  | 'PLAY_MOVE'
  | 'HIGHLIGHT_SQUARE'
  | 'HIGHLIGHT_SQUARES'
  | 'DRAW_ARROW'
  | 'REMOVE_ARROWS'
  | 'SHOW_LEGAL_MOVES'
  | 'UNDO_MOVE'
  | 'RESET_BOARD'
  | 'SHOW_HINT'
  | 'WAIT_FOR_STUDENT_MOVE'
  | 'SHOW_FEEDBACK';

export interface BoardAction {
  type: BoardActionType;
  squares?: string[];     // e.g. ["e4", "e5"]
  arrow?: { from: string; to: string; color?: string };
  fen?: string;
  move?: { from: string; to: string; promotion?: string };
  hintText?: string;
  feedbackType?: 'success' | 'warning' | 'error' | 'info';
}

export interface TeachingResponse {
  message: string;
  teaching_intent: 'explain_concept' | 'give_hint' | 'demonstrate_move' | 'ask_question' | 'praise' | 'correct_mistake';
  student_level_targeted: 'beginner' | 'intermediate' | 'advanced';
  actions: BoardAction[];
  next_step: 'wait_for_student' | 'continue_explanation' | 'quiz_question';
  suggested_replies?: string[];
}
```

---

## 3. Graduated Hint Strategy

When a student struggles on an exercise, the coach does not immediately spoil the solution:
- **Hint Level 1 (Theme / Direction):** "Look for an unprotected piece on the 5th rank."
- **Hint Level 2 (Piece to Move):** "Can your knight move to a square where it attacks both the queen and rook?"
- **Hint Level 3 (Destination / Action):** "Try moving your knight to c7 with check."
