import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { BoardArrow, PieceColor, PieceType } from '../../types';
import { getLegalMovesForSquare, makeMoveSafe } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';

// High-fidelity classical chess piece SVGs (vector paths)
export const ChessPieceIcon: React.FC<{ type: PieceType; color: PieceColor; className?: string }> = ({
  type,
  color,
  className = 'w-full h-full',
}) => {
  const isWhite = color === 'w';
  const fill = isWhite ? '#FDFBF7' : '#26282B';
  const stroke = isWhite ? '#4A4844' : '#141416';
  const highlight = isWhite ? '#FFFFFF' : '#4E5054';

  switch (type) {
    case 'k':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <g fill="none" fillRule="evenodd" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" stroke={stroke} />
            <path
              d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
              fill={fill}
              stroke={stroke}
            />
            <path
              d="M11.5 37c5.5 3.5 16.5 3.5 22 0l-1-7.5c-3-2-7.5-2.5-10-2.5s-7 0.5-10 2.5l-1 7.5z"
              fill={fill}
              stroke={stroke}
            />
            <path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0" stroke={stroke} />
          </g>
        </svg>
      );
    case 'q':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <g fill="none" fillRule="evenodd" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-4-14-4.5 14-4.5-14-4 14-7-11 2 12z"
              fill={fill}
              stroke={stroke}
            />
            <path
              d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 1.5 3.5 1.5 1.5 2 1.5 3.5 2 1 0 1.5-1 3.5-1s2.5 1 3.5 1 2-0.5 3.5-2c0.5-2.5 0.5-2 1.5-3.5 1-2 2.5-2 2.5-4"
              fill={fill}
              stroke={stroke}
            />
            <path d="M11.5 30c3.5-1 18.5-1 22 0m-21.5 4c3-1 15-1 21 0m-21 3.5c3-1 15-1 21 0" stroke={stroke} />
            <circle cx="6" cy="12" r="2" fill={fill} stroke={stroke} />
            <circle cx="14" cy="9" r="2" fill={fill} stroke={stroke} />
            <circle cx="22.5" cy="8" r="2" fill={fill} stroke={stroke} />
            <circle cx="31" cy="9" r="2" fill={fill} stroke={stroke} />
            <circle cx="39" cy="12" r="2" fill={fill} stroke={stroke} />
          </g>
        </svg>
      );
    case 'r':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <g fill="none" fillRule="evenodd" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-12.5h14L31 31.5H14zM11 14h23v5H11v-5zm0-3h5v3h-5v-3zm9 0h5v3h-5v-3zm9 0h5v3h-5v-3z"
              fill={fill}
              stroke={stroke}
            />
            <path d="M12 35.5h21m-20-4h19m-18-12.5h17" stroke={stroke} />
          </g>
        </svg>
      );
    case 'b':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <g fill="none" fillRule="evenodd" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"
              fill={fill}
              stroke={stroke}
            />
            <path d="M17.5 26h10M15 30h15m-7.5-14v5m-3-2.5h6" stroke={stroke} />
          </g>
        </svg>
      );
    case 'n':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <g fill="none" fillRule="evenodd" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
              fill={fill}
              stroke={stroke}
            />
            <path
              d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-4.04 3-5 2.1-1.27 4.21-2.11 4-4.5-.2-2.36-2-3-4-3-1.61.05-3.4 1.14-4 2-.5.5-1.5.5-1.5-1 0-2.5 5-5.5 10-5.5 3.38 0 5.12 1.5 5.5 4z"
              fill={fill}
              stroke={stroke}
            />
            <circle cx="9.5" cy="25.5" r="1.5" fill={stroke} />
            <path d="M14.5 35.5h21" stroke={stroke} />
          </g>
        </svg>
      );
    case 'p':
      return (
        <svg viewBox="0 0 45 45" className={className} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

interface ChessboardProps {
  fen: string;
  onMove?: (from: string, to: string, promotion?: string) => void;
  orientation?: 'white' | 'black';
  highlightSquares?: string[];
  arrows?: BoardArrow[];
  interactive?: boolean;
  lastMove?: { from: string; to: string } | null;
  showCoordinates?: boolean;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  onMove,
  orientation = 'white',
  highlightSquares = [],
  arrows = [],
  interactive = true,
  lastMove = null,
  showCoordinates = true,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const game = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  }, [fen]);

  const boardMatrix = useMemo(() => {
    const matrix = game.board();
    return orientation === 'white' ? matrix : [...matrix].reverse().map(row => [...row].reverse());
  }, [game, orientation]);

  const files = useMemo(
    () => (orientation === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']),
    [orientation]
  );
  const ranks = useMemo(
    () => (orientation === 'white' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8']),
    [orientation]
  );

  const kingInCheckSquare = useMemo(() => {
    if (!game.inCheck()) return null;
    const turn = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          const file = String.fromCharCode('a'.charCodeAt(0) + c);
          const rank = 8 - r;
          return `${file}${rank}`;
        }
      }
    }
    return null;
  }, [game]);

  const handleSquareClick = (square: string) => {
    if (!interactive) return;

    // If already selected and clicking legal move
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        // Execute move
        const piece = game.get(selectedSquare as any);
        const isCapture = Boolean(game.get(square as any));

        if (onMove) {
          onMove(selectedSquare, square, 'q');
        }

        if (isCapture) {
          chessAudio.playCapture();
        } else {
          chessAudio.playMove();
        }

        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // If clicked the same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Select piece on square if it's the current turn
    const piece = game.get(square as any);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = getLegalMovesForSquare(fen, square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Convert square like "e4" to coordinates percentage for arrows
  const getSquarePercent = (sq: string) => {
    const file = sq[0];
    const rank = sq[1];
    const fileIndex = files.indexOf(file);
    const rankIndex = ranks.indexOf(rank);

    if (fileIndex === -1 || rankIndex === -1) return { x: 50, y: 50 };
    return {
      x: fileIndex * 12.5 + 6.25,
      y: rankIndex * 12.5 + 6.25,
    };
  };

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto select-none rounded-xl overflow-hidden shadow-2xl border-4 border-[#19273a] bg-[#0b1220]">
      {/* 8x8 Board Grid */}
      <div ref={boardRef} className="w-full h-full grid grid-cols-8 grid-rows-8 relative">
        {ranks.map((rank, rIdx) =>
          files.map((file, fIdx) => {
            const square = `${file}${rank}`;
            const isDark = (fIdx + rIdx) % 2 === 1;
            const piece = orientation === 'white' ? game.board()[rIdx][fIdx] : game.board()[7 - rIdx][7 - fIdx];

            const isSelected = selectedSquare === square;
            const isLegalTarget = legalMoves.includes(square);
            const isHighlighted = highlightSquares.includes(square);
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheckSquare = kingInCheckSquare === square;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-100 ${
                  isDark ? 'bg-[#8c6747]' : 'bg-[#ece2c6]'
                } ${isSelected ? 'ring-4 ring-inset ring-[#d6b56d] z-10' : ''} ${
                  isHighlighted ? 'bg-amber-400/50' : ''
                } ${isLastMove ? 'bg-amber-300/40' : ''} ${
                  isCheckSquare ? 'ring-4 ring-inset ring-red-500 bg-red-500/40 animate-pulse z-10' : ''
                }`}
                data-square={square}
                aria-label={`Square ${square}`}
              >
                {/* Coordinates */}
                {showCoordinates && fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[10px] font-bold select-none pointer-events-none ${
                      isDark ? 'text-[#ece2c6]/80' : 'text-[#8c6747]/80'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {showCoordinates && rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] font-bold select-none pointer-events-none ${
                      isDark ? 'text-[#ece2c6]/80' : 'text-[#8c6747]/80'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Legal Move Indicators */}
                {isLegalTarget && (
                  <div
                    className={`absolute rounded-full pointer-events-none z-20 ${
                      piece
                        ? 'w-[85%] h-[85%] border-4 border-[#d6b56d]/90 rounded-full animate-pulse'
                        : 'w-4 h-4 bg-[#d6b56d] shadow-md'
                    }`}
                  />
                )}

                {/* Piece Rendering */}
                {piece && (
                  <div className="w-[84%] h-[84%] z-10 transition-transform active:scale-95 hover:scale-105 duration-75 flex items-center justify-center">
                    <ChessPieceIcon type={piece.type} color={piece.color} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SVG Arrows Overlay */}
      {arrows.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100">
          <defs>
            <marker
              id="arrowhead-gold"
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill="#d6b56d" opacity="0.9" />
            </marker>
            <marker
              id="arrowhead-red"
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill="#ef4444" opacity="0.9" />
            </marker>
            <marker
              id="arrowhead-blue"
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill="#3b82f6" opacity="0.9" />
            </marker>
          </defs>
          {arrows.map((arr, idx) => {
            const start = getSquarePercent(arr.from);
            const end = getSquarePercent(arr.to);
            const color = arr.color || '#d6b56d';
            const markerId = color === '#ef4444' ? 'arrowhead-red' : color === '#3b82f6' ? 'arrowhead-blue' : 'arrowhead-gold';

            return (
              <line
                key={idx}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};
