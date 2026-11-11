import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  RotateCcw,
  Flag,
  Handshake,
  Bot,
  User,
  Clock,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { MoveResult, PieceColor, StudentProfile } from '../../types';
import { Chessboard } from '../chess/Chessboard';
import { findBestEngineMove } from '../../lib/engine/chessEngine';
import { makeMoveSafe, getGameState, START_FEN, calculateMaterial } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';

interface PracticeViewProps {
  profile: StudentProfile;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ profile }) => {
  const [boardFen, setBoardFen] = useState<string>(START_FEN);
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');
  const [engineLevel, setEngineLevel] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [isEngineThinking, setIsEngineThinking] = useState(false);

  const gameState = getGameState(boardFen);
  const material = calculateMaterial(boardFen);

  // Trigger engine response when it's engine's turn
  useEffect(() => {
    if (gameState.isGameOver || isEngineThinking) return;

    const isEngineTurn =
      (playerColor === 'w' && gameState.turn === 'b') ||
      (playerColor === 'b' && gameState.turn === 'w');

    if (isEngineTurn) {
      setIsEngineThinking(true);
      const timer = setTimeout(() => {
        const engineMove = findBestEngineMove(boardFen, engineLevel);
        if (engineMove) {
          const res = makeMoveSafe(boardFen, engineMove.from, engineMove.to, engineMove.promotion);
          if (res.success) {
            setBoardFen(res.newFen);
            setLastMove({ from: engineMove.from, to: engineMove.to });
            setMoveHistory(prev => [...prev, engineMove.san]);

            if (res.move?.captured) {
              chessAudio.playCapture();
            } else {
              chessAudio.playMove();
            }

            const afterState = getGameState(res.newFen);
            if (afterState.isCheckmate) {
              setGameResult('AI wins by checkmate!');
              chessAudio.playError();
            } else if (afterState.isDraw) {
              setGameResult('Game drawn (stalemate or repetition)');
            }
          }
        }
        setIsEngineThinking(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [boardFen, gameState.turn, playerColor, engineLevel, gameState.isGameOver, isEngineThinking]);

  const handlePlayerMove = (from: string, to: string, promotion: string = 'q') => {
    if (gameState.isGameOver || isEngineThinking) return;

    // Check if it's player's turn
    if (gameState.turn !== playerColor) return;

    const res = makeMoveSafe(boardFen, from, to, promotion);
    if (!res.success) {
      chessAudio.playError();
      return;
    }

    setBoardFen(res.newFen);
    setLastMove({ from, to });
    setMoveHistory(prev => [...prev, res.move?.san || '']);

    if (res.move?.captured) {
      chessAudio.playCapture();
    } else {
      chessAudio.playMove();
    }

    const nextState = getGameState(res.newFen);
    if (nextState.isCheckmate) {
      setGameResult('You win by checkmate! Spectacular!');
      chessAudio.playVictory();
    } else if (nextState.isDraw) {
      setGameResult('Game drawn');
    }
  };

  const startNewGame = () => {
    setBoardFen(START_FEN);
    setMoveHistory([]);
    setLastMove(null);
    setGameResult(null);
    setIsEngineThinking(false);
    chessAudio.playMove();
  };

  const handleResign = () => {
    if (gameState.isGameOver || gameResult) return;
    setGameResult('Game ended by resignation');
    chessAudio.playError();
  };

  const levelLabels: Record<number, { name: string; elo: number }> = {
    1: { name: 'Novice Bot', elo: 600 },
    2: { name: 'Apprentice Bot', elo: 1000 },
    3: { name: 'Tactician Bot', elo: 1300 },
    4: { name: 'Master Bot', elo: 1700 },
    5: { name: 'Grandmaster Bot', elo: 1900 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chessboard */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[540px]">
            {/* Opponent Top Bar */}
            <div className="flex items-center justify-between pb-3 px-1 text-xs text-[#aab5c4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#19273a] flex items-center justify-center text-[#d6b56d] border border-[#26374f]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#f3f0e8]">{levelLabels[engineLevel].name}</div>
                  <div className="text-[10px] text-[#d6b56d]">Rating ~{levelLabels[engineLevel].elo} Elo</div>
                </div>
              </div>
              {isEngineThinking && (
                <span className="text-xs font-semibold text-[#d6b56d] flex items-center gap-1.5 animate-pulse">
                  <Bot className="w-3.5 h-3.5" /> Calculating move...
                </span>
              )}
            </div>

            <Chessboard
              fen={boardFen}
              orientation={playerColor === 'w' ? 'white' : 'black'}
              interactive={!gameState.isGameOver && !isEngineThinking && !gameResult}
              lastMove={lastMove}
              onMove={handlePlayerMove}
            />

            {/* Player Bottom Bar */}
            <div className="flex items-center justify-between pt-3 px-1 text-xs text-[#aab5c4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#19273a] flex items-center justify-center text-[#f3f0e8] border border-[#26374f]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#f3f0e8]">{profile.displayName}</div>
                  <div className="text-[10px] text-[#aab5c4]">Rating {profile.estimatedElo} Elo</div>
                </div>
              </div>

              {/* Material Balance */}
              <div className="font-mono text-xs font-bold text-[#d6b56d]">
                {material.balance !== 0 && (
                  <span>
                    Material: {material.balance > 0 ? `+${material.balance} White` : `${material.balance} Black`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Move History */}
        <div className="lg:col-span-5 space-y-5">
          {/* Game Status Banner */}
          {gameResult && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-center space-y-2">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="font-display font-bold text-base text-[#f3f0e8]">{gameResult}</div>
              <button
                onClick={startNewGame}
                className="px-4 py-1.5 rounded-lg bg-[#d6b56d] text-[#0b1220] font-bold text-xs cursor-pointer"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Engine Opponent Difficulty Settings */}
          <div className="bg-[#121d2e] p-5 rounded-2xl border border-[#19273a] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[#f3f0e8] flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#d6b56d]" /> Engine Difficulty
              </span>
              <span className="text-xs text-[#d6b56d] font-semibold">
                {levelLabels[engineLevel].name}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setEngineLevel(lvl as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    engineLevel === lvl
                      ? 'bg-[#d6b56d] text-[#0b1220]'
                      : 'bg-[#0b1220] text-[#aab5c4] hover:bg-[#19273a]'
                  }`}
                >
                  Lvl {lvl}
                </button>
              ))}
            </div>

            {/* Color Selection */}
            <div className="pt-2 flex items-center justify-between text-xs text-[#aab5c4]">
              <span>Play as:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPlayerColor('w');
                    startNewGame();
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    playerColor === 'w'
                      ? 'bg-[#19273a] border-[#d6b56d] text-[#f3f0e8]'
                      : 'border-[#19273a] text-[#728096]'
                  }`}
                >
                  White
                </button>
                <button
                  onClick={() => {
                    setPlayerColor('b');
                    startNewGame();
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    playerColor === 'b'
                      ? 'bg-[#19273a] border-[#d6b56d] text-[#f3f0e8]'
                      : 'border-[#19273a] text-[#728096]'
                  }`}
                >
                  Black
                </button>
              </div>
            </div>
          </div>

          {/* Move History Log */}
          <div className="bg-[#121d2e] p-5 rounded-2xl border border-[#19273a] shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-[#aab5c4]">
              <span className="font-bold text-[#f3f0e8]">Move History</span>
              <span>{Math.ceil(moveHistory.length / 2)} Moves</span>
            </div>

            <div className="h-44 overflow-y-auto bg-[#0b1220] rounded-xl p-3 font-mono text-xs text-[#f3f0e8] space-y-1">
              {moveHistory.length === 0 ? (
                <div className="text-center text-[#728096] py-8">Game has not started</div>
              ) : (
                Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, idx) => {
                  const whiteMove = moveHistory[idx * 2];
                  const blackMove = moveHistory[idx * 2 + 1];
                  return (
                    <div key={idx} className="flex items-center gap-4 py-0.5">
                      <span className="text-[#728096] w-6 text-right">{idx + 1}.</span>
                      <span className="w-16 font-semibold">{whiteMove}</span>
                      <span className="w-16 font-semibold text-[#d6b56d]">{blackMove || ''}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={startNewGame}
                className="px-4 py-2 rounded-xl bg-[#19273a] hover:bg-[#22344d] text-xs font-semibold text-[#f3f0e8] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Game</span>
              </button>

              <button
                onClick={handleResign}
                disabled={Boolean(gameResult) || moveHistory.length === 0}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 border border-red-500/30 text-xs font-semibold text-red-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Resign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
