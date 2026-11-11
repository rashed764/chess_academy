import { Chess } from 'chess.js';

// Piece values
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified piece-square table bonuses for positional awareness
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

export function evaluateBoardScore(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }

  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      let posBonus = 0;
      const index = r * 8 + c;
      const flippedIndex = (7 - r) * 8 + c;

      if (piece.type === 'p') {
        posBonus = piece.color === 'w' ? PAWN_TABLE[index] : PAWN_TABLE[flippedIndex];
      } else if (piece.type === 'n') {
        posBonus = piece.color === 'w' ? KNIGHT_TABLE[index] : KNIGHT_TABLE[flippedIndex];
      }

      const totalVal = baseVal + posBonus;
      if (piece.color === 'w') {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  return score;
}

export function evaluateFen(fen: string): { centipawns: number; formatted: string } {
  try {
    const game = new Chess(fen);
    const score = evaluateBoardScore(game);
    const pawns = (score / 100).toFixed(1);
    const formatted = score >= 0 ? `+${pawns}` : `${pawns}`;
    return { centipawns: score, formatted };
  } catch {
    return { centipawns: 0, formatted: '0.0' };
  }
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoardScore(game);
  }

  const moves = game.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function findBestEngineMove(
  fen: string,
  level: 1 | 2 | 3 | 4 | 5 = 2
): { from: string; to: string; san: string; promotion?: string } | null {
  try {
    const game = new Chess(fen);
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Level 1 (Novice): Pick semi-random move with slight capture bias
    if (level === 1) {
      const captures = moves.filter(m => m.captured);
      if (captures.length > 0 && Math.random() > 0.4) {
        const choice = captures[Math.floor(Math.random() * captures.length)];
        return { from: choice.from, to: choice.to, san: choice.san, promotion: choice.promotion };
      }
      const choice = moves[Math.floor(Math.random() * moves.length)];
      return { from: choice.from, to: choice.to, san: choice.san, promotion: choice.promotion };
    }

    // Level 2 (Apprentice): 1-ply search
    // Level 3 (Tactician): 2-ply search
    // Level 4/5 (Master): 3-ply minimax with alpha-beta pruning
    const depth = level <= 2 ? 1 : level === 3 ? 2 : 3;
    const isWhite = game.turn() === 'w';

    let bestMove = moves[0];
    let bestScore = isWhite ? -Infinity : Infinity;

    for (const move of moves) {
      game.move(move);
      const score = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
      game.undo();

      if (isWhite) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return { from: bestMove.from, to: bestMove.to, san: bestMove.san, promotion: bestMove.promotion };
  } catch {
    return null;
  }
}
