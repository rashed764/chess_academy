import { Chess } from 'chess.js';
import type { BoardAction, TeachingResponse } from '../../types';
import { evaluateFen } from '../engine/chessEngine';
import { validateBoardAction } from '../chess/rules';

export interface CoachContext {
  fen: string;
  lastMove?: { from: string; to: string; san: string };
  studentRating?: number;
  lessonGoal?: string;
  hintLevel?: number;
}

export class CoachEngine {
  /**
   * Generates a pedagogical response to a user query or move
   */
  public static async getCoachFeedback(
    userMessage: string,
    context: CoachContext
  ): Promise<TeachingResponse> {
    const game = new Chess(context.fen);
    const evalData = evaluateFen(context.fen);
    const inCheck = game.inCheck();
    const isMate = game.isCheckmate();
    const isDraw = game.isDraw();

    const lowerQuery = userMessage.toLowerCase();

    // 1. If user is asking for a hint
    if (lowerQuery.includes('hint') || lowerQuery.includes('what should i do') || lowerQuery.includes('help')) {
      const hintLvl = context.hintLevel || 1;
      return this.generateGraduatedHint(context.fen, hintLvl);
    }

    // 2. If checkmate or check
    if (isMate) {
      return {
        message: 'Magnificent! The enemy King is in checkmate with nowhere to flee. The game is won.',
        teaching_intent: 'praise',
        actions: [
          { type: 'SHOW_FEEDBACK', feedbackType: 'success' },
        ],
        next_step: 'continue_explanation',
        suggested_replies: ['Analyze this game', 'Next challenge', 'Explain winning tactic'],
      };
    }

    if (inCheck) {
      const kingSquare = this.findKingSquare(game, game.turn());
      return {
        message: 'Notice that the King is in CHECK! In chess, King safety is absolute: you must move the King, block the attack, or capture the threatening piece (CPR).',
        teaching_intent: 'explain_concept',
        actions: [
          { type: 'HIGHLIGHT_SQUARES', squares: kingSquare ? [kingSquare] : [] },
          { type: 'SHOW_FEEDBACK', feedbackType: 'warning' },
        ],
        next_step: 'wait_for_student',
        suggested_replies: ['How do I block?', 'Can I capture the attacker?', 'Show safe squares'],
      };
    }

    // 3. Positional / Tactical questions
    if (lowerQuery.includes('center') || lowerQuery.includes('opening')) {
      return {
        message: 'The center squares (d4, e4, d5, e5) represent the vital high ground. Whoever controls the center enjoys mobility, shorter travel distance for knights, and free diagonals for bishops.',
        teaching_intent: 'explain_concept',
        actions: [
          { type: 'HIGHLIGHT_SQUARES', squares: ['d4', 'e4', 'd5', 'e5'] },
          { type: 'DRAW_ARROW', arrow: { from: 'e2', to: 'e4', color: '#d6b56d' } },
        ],
        next_step: 'wait_for_student',
        suggested_replies: ['Why is e4 good?', 'What about developing knights?', 'Show tactical ideas'],
      };
    }

    if (lowerQuery.includes('fork') || lowerQuery.includes('knight')) {
      return {
        message: 'A fork is a simultaneous double attack by a single piece. Knights are particularly deadly at forking because they jump over defenders, making their attacks impossible to block.',
        teaching_intent: 'explain_concept',
        actions: [
          { type: 'SHOW_FEEDBACK', feedbackType: 'info' },
        ],
        next_step: 'wait_for_student',
        suggested_replies: ['Show an example fork', 'How to defend against forks', 'Practice knight forks'],
      };
    }

    // Default pedagogical response
    const turnName = game.turn() === 'w' ? 'White' : 'Black';
    const evalText = evalData.formatted;

    return {
      message: `Position evaluation is ${evalText}. It is ${turnName}'s turn to move. Focus on active piece placement, king safety, and looking for undefended enemy pieces.`,
      teaching_intent: 'explain_concept',
      actions: [
        { type: 'SHOW_FEEDBACK', feedbackType: 'info' },
      ],
      next_step: 'wait_for_student',
      suggested_replies: ['Give me a hint', 'Which piece is weakest?', 'Recommend a lesson'],
    };
  }

  public static generateGraduatedHint(fen: string, level: number): TeachingResponse {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });

    if (moves.length === 0) {
      return {
        message: 'No legal moves remaining in this position.',
        teaching_intent: 'explain_concept',
        actions: [],
        next_step: 'continue_explanation',
      };
    }

    // Look for checks or captures first
    const checks = moves.filter(m => m.san.includes('+') || m.san.includes('#'));
    const captures = moves.filter(m => m.captured);

    const targetMove = checks[0] || captures[0] || moves[0];

    if (level === 1) {
      return {
        message: 'Hint 1 (Theme): Look closely for tactical opportunities. Is there an unprotected piece or a way to deliver a check?',
        teaching_intent: 'give_hint',
        actions: [
          { type: 'HIGHLIGHT_SQUARES', squares: [targetMove.from] },
        ],
        next_step: 'wait_for_student',
        suggested_replies: ['Show which piece to move', 'Give me Hint 2'],
      };
    }

    if (level === 2) {
      return {
        message: `Hint 2 (Piece): Focus on your ${targetMove.piece.toUpperCase()} on square ${targetMove.from}. It has a very active square to jump to.`,
        teaching_intent: 'give_hint',
        actions: [
          { type: 'HIGHLIGHT_SQUARE', squares: [targetMove.from] },
          { type: 'DRAW_ARROW', arrow: { from: targetMove.from, to: targetMove.to, color: '#d6b56d' } },
        ],
        next_step: 'wait_for_student',
        suggested_replies: ['Show the exact move', 'I will try it!'],
      };
    }

    return {
      message: `Hint 3 (Direct Move): Play ${targetMove.san}! Move your ${targetMove.piece.toUpperCase()} from ${targetMove.from} to ${targetMove.to}.`,
      teaching_intent: 'demonstrate_move',
      actions: [
        { type: 'PLAY_MOVE', move: { from: targetMove.from, to: targetMove.to, promotion: targetMove.promotion } },
      ],
      next_step: 'continue_explanation',
      suggested_replies: ['Why is this best?', 'Show next step'],
    };
  }

  private static findKingSquare(game: Chess, color: 'w' | 'b'): string | null {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          const file = String.fromCharCode('a'.charCodeAt(0) + c);
          const rank = 8 - r;
          return `${file}${rank}`;
        }
      }
    }
    return null;
  }
}
