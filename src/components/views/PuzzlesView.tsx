import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Puzzle as PuzzleIcon,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { Puzzle, StudentProfile } from '../../types';
import { Chessboard } from '../chess/Chessboard';
import { PUZZLES_DATA } from '../../lib/puzzles/puzzleData';
import { makeMoveSafe } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';
import { recordPuzzleSolved } from '../../lib/storage/studentStorage';

interface PuzzlesViewProps {
  profile: StudentProfile;
  onProfileUpdated: (profile: StudentProfile) => void;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({ profile, onProfileUpdated }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);

  const filteredPuzzles = selectedTheme === 'all'
    ? PUZZLES_DATA
    : PUZZLES_DATA.filter(p => p.theme === selectedTheme);

  const puzzle = filteredPuzzles[currentPuzzleIndex] || PUZZLES_DATA[0];

  const [boardFen, setBoardFen] = useState(puzzle.fen);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [status, setStatus] = useState<'solving' | 'solved' | 'failed'>('solving');
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Reset when puzzle changes
  useEffect(() => {
    if (puzzle) {
      setBoardFen(puzzle.fen);
      setLastMove(null);
      setStatus('solving');
      setHintLevel(0);
    }
  }, [puzzle]);

  const handlePlayerMove = (from: string, to: string, promotion: string = 'q') => {
    if (status === 'solved') return;

    const res = makeMoveSafe(boardFen, from, to, promotion);
    if (!res.success) {
      chessAudio.playError();
      return;
    }

    const playedSan = res.move?.san || '';
    const playedFromTo = `${from}${to}`;
    const targetMove = puzzle.solutionMoves[0];

    const isCorrect =
      playedSan.replace(/[\+#]/g, '') === targetMove.replace(/[\+#]/g, '') ||
      playedFromTo === targetMove;

    if (isCorrect) {
      setBoardFen(res.newFen);
      setLastMove({ from, to });
      setStatus('solved');
      chessAudio.playVictory();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      const updated = recordPuzzleSolved(puzzle.id, 15);
      onProfileUpdated(updated);
    } else {
      setStatus('failed');
      chessAudio.playError();
    }
  };

  const handleNextPuzzle = () => {
    setCurrentPuzzleIndex(prev => (prev + 1) % filteredPuzzles.length);
  };

  const resetPuzzle = () => {
    setBoardFen(puzzle.fen);
    setLastMove(null);
    setStatus('solving');
    setHintLevel(0);
    chessAudio.playMove();
  };

  const themes = [
    { id: 'all', label: 'All Themes' },
    { id: 'fork', label: 'Forks' },
    { id: 'pin', label: 'Pins' },
    { id: 'skewer', label: 'Skewers' },
    { id: 'mate_in_1', label: 'Mate in 1' },
    { id: 'mate_in_2', label: 'Mate in 2' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Themes Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTheme(t.id);
              setCurrentPuzzleIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTheme === t.id
                ? 'bg-[#d6b56d] text-[#0b1220] shadow-md shadow-[#d6b56d]/15'
                : 'bg-[#121d2e] text-[#aab5c4] hover:bg-[#19273a] hover:text-[#f3f0e8] border border-[#19273a]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Puzzle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chessboard */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[540px]">
            <Chessboard
              fen={boardFen}
              orientation={puzzle.playerColor === 'w' ? 'white' : 'black'}
              interactive={status !== 'solved'}
              lastMove={lastMove}
              onMove={handlePlayerMove}
            />

            <div className="mt-4 flex items-center justify-between text-xs text-[#aab5c4] px-1">
              <button
                onClick={resetPuzzle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121d2e] hover:bg-[#19273a] text-[#f3f0e8] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Puzzle</span>
              </button>

              <div className="text-xs">
                Turn to move:{' '}
                <strong className="text-[#f3f0e8]">
                  {puzzle.playerColor === 'w' ? 'White' : 'Black'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Puzzle Info & Hints */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#0b1220] text-[#d6b56d] border border-[#d6b56d]/20 uppercase">
                {puzzle.theme.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono font-bold text-[#aab5c4]">
                Rating {puzzle.rating} Elo
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-[#f3f0e8]">
              {puzzle.title}
            </h3>

            <p className="text-xs text-[#aab5c4] leading-relaxed">
              Find the decisive winning move for {puzzle.playerColor === 'w' ? 'White' : 'Black'}.
            </p>

            {/* Hints Box */}
            <div className="pt-2 border-t border-[#19273a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f3f0e8] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#d6b56d]" /> Need Assistance?
                </span>
                {hintLevel < 2 && (
                  <button
                    onClick={() => setHintLevel(prev => prev + 1)}
                    className="text-xs text-[#d6b56d] hover:underline cursor-pointer"
                  >
                    Unlock Hint {hintLevel + 1}
                  </button>
                )}
              </div>

              {hintLevel >= 1 && (
                <div className="p-3 rounded-xl bg-[#0b1220] border border-amber-500/30 text-xs text-amber-300">
                  <strong>Hint 1:</strong> {puzzle.hintLevel1}
                </div>
              )}
              {hintLevel >= 2 && (
                <div className="p-3 rounded-xl bg-[#0b1220] border border-amber-500/30 text-xs text-amber-300">
                  <strong>Hint 2:</strong> {puzzle.hintLevel2}
                </div>
              )}
            </div>

            {/* Solution Feedback */}
            {status === 'solved' && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Brilliant Tactical Move! (+15 Puzzle Elo)</span>
                </div>
                <p className="text-emerald-100/90 leading-relaxed">{puzzle.explanation}</p>
              </div>
            )}

            {status === 'failed' && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-200">That was not the best continuation.</strong>
                  Take your time and examine all forcing moves (checks, captures, threats).
                </div>
              </div>
            )}
          </div>

          {/* Next Puzzle Action */}
          <div className="flex justify-end">
            <button
              onClick={handleNextPuzzle}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] text-[#0b1220] font-bold text-sm shadow-md hover:brightness-110 flex items-center gap-2 cursor-pointer"
            >
              <span>Next Puzzle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
