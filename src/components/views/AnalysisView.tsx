import React, { useState } from 'react';
import {
  LineChart,
  Bot,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Brain,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Chessboard } from '../chess/Chessboard';
import { evaluateFen, findBestEngineMove } from '../../lib/engine/chessEngine';
import { makeMoveSafe, calculateMaterial, START_FEN } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';

const SAMPLE_GAMES = [
  {
    title: 'Morphy vs Duke of Brunswick (1858)',
    subtitle: 'The Opera Game — Critical Turning Point',
    fen: '4kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 14',
    move: 'Rxd7!',
    classification: 'Brilliant !!',
    explanation: 'Morphy gives up a whole rook to strip away Black\'s King defense, forcing an unstoppable checkmating combination.',
  },
  {
    title: 'Fischer vs Byrne (1956)',
    subtitle: 'Game of the Century — Queen Sacrifice',
    fen: 'r3kb1r/pp2pp1p/2p3p1/4q3/4n3/2N1B3/PPP1QPPP/R4RK1 b kq - 0 11',
    move: 'Be6!!',
    classification: 'Best Move',
    explanation: 'Fischer allows his Queen to be attacked, calculating a deep series of checks ending in windmill rook attacks.',
  },
  {
    title: 'Beginner Blunder Review',
    subtitle: 'Leaving a Piece Hanging on the 5th Rank',
    fen: 'r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5',
    move: 'Qe2?',
    classification: 'Inaccuracy',
    explanation: 'Instead of d4 striking at the center or O-O, Qe2 blocks the light-squared bishop and misplaces the Queen.',
  },
];

export const AnalysisView: React.FC = () => {
  const [currentFen, setCurrentFen] = useState(SAMPLE_GAMES[0].fen);
  const [selectedGameIdx, setSelectedGameIdx] = useState(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const evalResult = evaluateFen(currentFen);
  const material = calculateMaterial(currentFen);
  const bestMove = findBestEngineMove(currentFen, 3);

  // Convert centipawns to percentage for the eval bar (0% = -10, 50% = 0, 100% = +10)
  const evalPercent = Math.min(100, Math.max(0, 50 + (evalResult.centipawns / 100) * 5));

  const handleBoardMove = (from: string, to: string, promotion: string = 'q') => {
    const res = makeMoveSafe(currentFen, from, to, promotion);
    if (res.success) {
      setCurrentFen(res.newFen);
      setLastMove({ from, to });
      if (res.move?.captured) {
        chessAudio.playCapture();
      } else {
        chessAudio.playMove();
      }
    }
  };

  const loadSampleGame = (idx: number) => {
    setSelectedGameIdx(idx);
    setCurrentFen(SAMPLE_GAMES[idx].fen);
    setLastMove(null);
    chessAudio.playMove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sample Positions Switcher */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {SAMPLE_GAMES.map((game, idx) => (
          <button
            key={idx}
            onClick={() => loadSampleGame(idx)}
            className={`p-3 rounded-2xl border text-left whitespace-nowrap transition-all cursor-pointer ${
              selectedGameIdx === idx
                ? 'bg-[#19273a] border-[#d6b56d] text-[#f3f0e8] shadow-md shadow-[#d6b56d]/15'
                : 'bg-[#121d2e] border-[#19273a] text-[#aab5c4] hover:bg-[#152336]'
            }`}
          >
            <div className="text-xs font-bold text-[#f3f0e8]">{game.title}</div>
            <div className="text-[11px] text-[#d6b56d]">{game.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Eval Bar + Chessboard */}
        <div className="lg:col-span-7 flex items-center justify-center gap-4">
          {/* Vertical Centipawn Eval Bar */}
          <div className="w-5 h-[480px] bg-[#19273a] rounded-full overflow-hidden border border-[#26374f] flex flex-col justify-end relative shadow-inner">
            <div
              className="w-full bg-[#f3f0e8] transition-all duration-300"
              style={{ height: `${evalPercent}%` }}
            />
            <div className="absolute inset-x-0 top-1 text-center font-mono text-[9px] font-bold text-[#0b1220] mix-blend-difference">
              {evalResult.formatted}
            </div>
          </div>

          {/* Interactive Board */}
          <div className="w-full max-w-[500px]">
            <Chessboard
              fen={currentFen}
              interactive={true}
              lastMove={lastMove}
              onMove={handleBoardMove}
            />

            <div className="mt-4 flex items-center justify-between text-xs text-[#aab5c4] px-1">
              <button
                onClick={() => loadSampleGame(selectedGameIdx)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121d2e] hover:bg-[#19273a] text-[#f3f0e8] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Position</span>
              </button>

              <span className="font-mono text-xs font-bold text-[#d6b56d]">
                Eval: {evalResult.formatted} pawns
              </span>
            </div>
          </div>
        </div>

        {/* Right: Engine Breakdown & Pedagogical Insight */}
        <div className="lg:col-span-5 space-y-5">
          {/* Engine Analysis Card */}
          <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#0b1220] text-[#d6b56d] border border-[#d6b56d]/30 uppercase flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Engine Post-Mortem
              </span>
              <span className="text-xs text-[#aab5c4]">Depth 3 ply</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-[#f3f0e8]">
                {SAMPLE_GAMES[selectedGameIdx].title}
              </h3>
              <p className="text-xs text-[#aab5c4]">
                {SAMPLE_GAMES[selectedGameIdx].subtitle}
              </p>
            </div>

            {/* Move Classification Tag */}
            <div className="p-4 rounded-xl bg-[#0b1220] border border-[#19273a] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#728096] uppercase tracking-wider block">
                  Move Analyzed
                </span>
                <span className="font-mono text-base font-bold text-[#f3f0e8]">
                  {SAMPLE_GAMES[selectedGameIdx].move}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                {SAMPLE_GAMES[selectedGameIdx].classification}
              </span>
            </div>

            {/* Educational Explanation */}
            <div className="p-4 rounded-xl bg-[#19273a] border border-[#26374f] text-xs text-[#f3f0e8] leading-relaxed space-y-2">
              <div className="font-bold text-[#d6b56d] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" /> Master Instructor Takeaway
              </div>
              <p>{SAMPLE_GAMES[selectedGameIdx].explanation}</p>
            </div>

            {/* Recommended Engine Alternative */}
            {bestMove && (
              <div className="p-3 rounded-xl bg-[#0b1220] border border-[#19273a] text-xs text-[#aab5c4] flex items-center justify-between">
                <span>Top Engine Candidate Move:</span>
                <span className="font-mono font-bold text-[#d6b56d] px-2 py-0.5 rounded bg-[#19273a]">
                  {bestMove.san}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
