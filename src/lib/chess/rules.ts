import { Chess } from 'chess.js';
import type { BoardAction, MoveResult, PieceColor, PieceType } from '../../types';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function createGame(fen: string = START_FEN): Chess {
  try {
    return new Chess(fen);
  } catch {
    return new Chess(START_FEN);
  }
}

export function isValidFen(fen: string): boolean {
  try {
    const c = new Chess(fen);
    return Boolean(c.fen());
  } catch {
    return false;
  }
}

export function getLegalMovesForSquare(fen: string, square: string): string[] {
  try {
    const game = new Chess(fen);
    const moves = game.moves({ square: square as any, verbose: true });
    return moves.map(m => m.to);
  } catch {
    return [];
  }
}

export function makeMoveSafe(
  fen: string,
  from: string,
  to: string,
  promotion: string = 'q'
): { success: boolean; newFen: string; move?: MoveResult; error?: string } {
  try {
    const game = new Chess(fen);
    const result = game.move({ from, to, promotion: promotion as any });
    if (!result) {
      return { success: false, newFen: fen, error: 'Illegal move' };
    }
    return {
      success: true,
      newFen: game.fen(),
      move: {
        from: result.from,
        to: result.to,
        san: result.san,
        piece: result.piece as PieceType,
        captured: result.captured ? (result.captured as PieceType) : undefined,
        promotion: result.promotion,
        flags: result.flags,
      },
    };
  } catch (_err: any) {
    return { success: false, newFen: fen, error: 'Illegal move' };
  }
}

export function getGameState(fen: string) {
  try {
    const game = new Chess(fen);
    return {
      isCheck: game.inCheck(),
      isCheckmate: game.isCheckmate(),
      isStalemate: game.isStalemate(),
      isDraw: game.isDraw(),
      isGameOver: game.isGameOver(),
      turn: game.turn() as PieceColor,
      moveCount: game.history().length,
      fen: game.fen(),
    };
  } catch {
    return {
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      isGameOver: false,
      turn: 'w' as PieceColor,
      moveCount: 0,
      fen: START_FEN,
    };
  }
}

/**
 * Validates whether an AI or lesson BoardAction contains valid coordinates and legal moves
 */
export function validateBoardAction(action: BoardAction, currentFen: string): { valid: boolean; reason?: string } {
  const squareRegex = /^[a-h][1-8]$/;

  if (action.squares) {
    for (const sq of action.squares) {
      if (!squareRegex.test(sq)) {
        return { valid: false, reason: `Invalid square coordinate: ${sq}` };
      }
    }
  }

  if (action.arrow) {
    if (!squareRegex.test(action.arrow.from) || !squareRegex.test(action.arrow.to)) {
      return { valid: false, reason: `Invalid arrow coordinates: ${action.arrow.from} -> ${action.arrow.to}` };
    }
  }

  if (action.type === 'PLAY_MOVE' && action.move) {
    const result = makeMoveSafe(currentFen, action.move.from, action.move.to, action.move.promotion);
    if (!result.success) {
      return { valid: false, reason: `Move ${action.move.from}-${action.move.to} is illegal in current position` };
    }
  }

  if (action.type === 'SET_POSITION' && action.fen) {
    if (!isValidFen(action.fen)) {
      return { valid: false, reason: `Invalid FEN string` };
    }
  }

  return { valid: true };
}

/**
 * Evaluates basic material balance: + positive is White advantage, - negative is Black advantage
 */
export function calculateMaterial(fen: string): { white: number; black: number; balance: number } {
  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  const [boardPart] = fen.split(' ');
  let white = 0;
  let black = 0;

  for (const char of boardPart) {
    const lower = char.toLowerCase();
    if (pieceValues[lower] !== undefined) {
      if (char === char.toUpperCase()) {
        white += pieceValues[lower];
      } else {
        black += pieceValues[lower];
      }
    }
  }

  return { white, black, balance: white - black };
}
