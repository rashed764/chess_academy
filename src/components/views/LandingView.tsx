import React, { useState } from 'react';
import {
  GraduationCap,
  Bot,
  Swords,
  Puzzle,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Brain,
  Sparkles,
  Award,
} from 'lucide-react';
import type { AppView } from '../../types';
import { Chessboard } from '../chess/Chessboard';
import { CURRICULUM_STAGES } from '../../lib/curriculum/curriculumData';

interface LandingViewProps {
  onStartLearning: () => void;
  onSelectView: (view: AppView) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStartLearning, onSelectView }) => {
  const [demoFen, setDemoFen] = useState('r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5');
  const [demoHighlights, setDemoHighlights] = useState<string[]>(['c4', 'f7']);
  const [demoArrows, setDemoArrows] = useState<{ from: string; to: string; color?: string }[]>([
    { from: 'c4', to: 'f7', color: '#ef4444' },
    { from: 'd1', to: 'h5', color: '#d6b56d' },
  ]);

  const handleDemoMove = (from: string, to: string) => {
    // Interactive demo allows trying moves
    setDemoHighlights([from, to]);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-[#f3f0e8] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d6b56d]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#19273a] border border-[#d6b56d]/30 text-[#d6b56d] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE DIGITAL CHESS UNIVERSITY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#f3f0e8]">
              From Zero to Legend.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d6b56d] via-[#f5e2b3] to-[#d6b56d]">
                Master the Royal Game.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#aab5c4] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Not merely a place to play blitz. ChessMind Academy is a structured, AI-guided academy that takes complete beginners who don't even know how pieces move and transforms them systematically into tournament-grade chess minds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] hover:from-[#e5c782] hover:to-[#c49f50] text-[#0b1220] font-bold text-base shadow-xl shadow-[#d6b56d]/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Start Stage 1 (Free)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectView('coach')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#19273a] hover:bg-[#22344d] border border-[#2b3e59] text-[#f3f0e8] font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-[#d6b56d]" />
                <span>Meet AI Coach</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#aab5c4]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Rules Validated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#d6b56d]" />
                <span>Engine Tactical Proof</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Persisted Progress & XP</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Interactive Chessboard */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[420px] bg-[#121d2e] p-4 rounded-2xl border border-[#19273a] shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#19273a] text-xs">
                <span className="font-semibold text-[#d6b56d] flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> Stage 2: Tactical Threat
                </span>
                <span className="text-[#aab5c4]">Try moving pieces</span>
              </div>

              <Chessboard
                fen={demoFen}
                highlightSquares={demoHighlights}
                arrows={demoArrows}
                interactive={true}
                onMove={handleDemoMove}
              />

              <div className="mt-3 p-2.5 rounded-lg bg-[#0b1220] border border-[#19273a] text-xs text-[#aab5c4] flex items-start gap-2">
                <Bot className="w-4 h-4 text-[#d6b56d] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#f3f0e8]">AI Coach Tip:</strong> Notice the White bishop on c4 aiming directly at f7, the weakest square in Black's camp!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Stages Preview */}
      <section className="py-16 bg-[#121d2e]/60 border-y border-[#19273a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e8] mb-3">
              The 6-Stage Grandmaster Curriculum
            </h2>
            <p className="text-[#aab5c4] text-base">
              A comprehensive educational journey developed step-by-step from zero knowledge to competitive tournament mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRICULUM_STAGES.map(stage => (
              <div
                key={stage.id}
                onClick={onStartLearning}
                className="bg-[#121d2e] hover:bg-[#19273a] p-6 rounded-2xl border border-[#19273a] hover:border-[#d6b56d]/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#0b1220] text-[#d6b56d] border border-[#d6b56d]/20">
                      Elo {stage.targetElo}
                    </span>
                    <span className="text-xs text-[#aab5c4]">{stage.courses.length} Course</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#f3f0e8] group-hover:text-[#d6b56d] transition-colors mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-medium text-[#d6b56d] mb-2">{stage.subtitle}</p>
                  <p className="text-sm text-[#aab5c4] leading-relaxed mb-4">{stage.description}</p>
                </div>

                <div className="pt-4 border-t border-[#19273a] flex items-center justify-between text-xs font-semibold text-[#f3f0e8] group-hover:text-[#d6b56d]">
                  <span>Explore Lessons</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ChessMind Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a]">
            <div className="w-12 h-12 rounded-xl bg-[#d6b56d]/10 border border-[#d6b56d]/30 flex items-center justify-center text-[#d6b56d] mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-[#f3f0e8] mb-2">Pedagogy First</h4>
            <p className="text-sm text-[#aab5c4] leading-relaxed">
              Every lesson begins with a clear learning outcome, walks through step-by-step positions with arrows and highlights, tests your understanding with exercises, and rewards XP.
            </p>
          </div>

          <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-[#f3f0e8] mb-2">Socratic AI Coach</h4>
            <p className="text-sm text-[#aab5c4] leading-relaxed">
              Our coach doesn't just blurt out puzzle answers. It gives graduated hints (Theme - Piece - Solution), demonstrates moves, and explains the tactical "why" behind every move.
            </p>
          </div>

          <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Swords className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-[#f3f0e8] mb-2">Engine Practice & Analysis</h4>
            <p className="text-sm text-[#aab5c4] leading-relaxed">
              Play against calibrated AI opponents from 600 Elo novice to 1800 Elo master. Review every move post-game with centipawn accuracy graphs and blunder classifications.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-b from-[#121d2e] to-[#0b1220] p-10 sm:p-14 rounded-3xl border border-[#d6b56d]/30 shadow-2xl relative overflow-hidden">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e8] mb-4">
            Your First Step Toward Mastery Starts Here
          </h2>
          <p className="text-[#aab5c4] max-w-xl mx-auto mb-8 text-base">
            No registration fee, no fake progress, no gimmicks. Just genuine, world-class chess education.
          </p>
          <button
            onClick={onStartLearning}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] hover:from-[#e5c782] hover:to-[#c49f50] text-[#0b1220] font-bold text-lg shadow-xl shadow-[#d6b56d]/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Begin Stage 1 Now</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
