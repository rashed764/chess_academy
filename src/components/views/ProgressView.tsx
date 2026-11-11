import React from 'react';
import {
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { Lesson, StudentProfile } from '../../types';
import { CURRICULUM_STAGES } from '../../lib/curriculum/curriculumData';

interface ProgressViewProps {
  profile: StudentProfile;
  onLaunchLesson: (lesson: Lesson) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile, onLaunchLesson }) => {
  const completedCount = Object.keys(profile.completedLessons).length;
  const solvedPuzzlesCount = Object.keys(profile.solvedPuzzles).length;

  const skillsList = [
    { name: 'Opening Principles', score: profile.skills.openingPrinciples, icon: <Shield className="w-4 h-4 text-emerald-400" /> },
    { name: 'King Safety', score: profile.skills.kingSafety, icon: <Shield className="w-4 h-4 text-blue-400" /> },
    { name: 'Tactical Forks', score: profile.skills.tacticsForks, icon: <Zap className="w-4 h-4 text-[#d6b56d]" /> },
    { name: 'Tactical Pins', score: profile.skills.tacticsPins, icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { name: 'Tactical Skewers', score: profile.skills.tacticsSkewers, icon: <Zap className="w-4 h-4 text-purple-400" /> },
    { name: 'Endgame Technique', score: profile.skills.endgameBasics, icon: <Target className="w-4 h-4 text-red-400" /> },
  ];

  // Identify weakest skill for Smart Revision (Section 6.13)
  const weakestSkill = [...skillsList].sort((a, b) => a.score - b.score)[0];

  const handleStartRevision = () => {
    // Pick the recommended lesson in Stage 1 or Stage 3
    const targetLesson = CURRICULUM_STAGES[0].courses[0].lessons[1] || CURRICULUM_STAGES[0].courses[0].lessons[0];
    onLaunchLesson(targetLesson);
  };

  const achievements = [
    { id: 'ach-1', title: 'First Steps', desc: 'Complete your first legal game lesson', unlocked: true },
    { id: 'ach-2', title: 'Tactical Eye', desc: 'Solve 3 tactical puzzles without blunder', unlocked: solvedPuzzlesCount >= 1 },
    { id: 'ach-3', title: 'Dedicated Scholar', desc: 'Maintain a 3-day continuous learning streak', unlocked: profile.currentStreak >= 3 },
    { id: 'ach-4', title: 'King Protector', desc: 'Master King Safety and castling principles', unlocked: completedCount >= 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-[#121d2e] p-6 sm:p-8 rounded-3xl border border-[#19273a] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.displayName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#d6b56d] shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0b1220] border border-[#d6b56d]/30 text-[11px] font-semibold text-[#d6b56d]">
              Level {profile.level} Scholar
            </div>
            <h1 className="font-display text-2xl font-bold text-[#f3f0e8] mt-1">
              {profile.displayName}
            </h1>
            <p className="text-xs text-[#aab5c4]">Member of ChessMind Academy</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="bg-[#0b1220] p-3 rounded-2xl border border-[#19273a] text-center min-w-[100px]">
            <span className="text-[10px] text-[#aab5c4] block uppercase font-semibold">Streak</span>
            <span className="text-base font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-500" /> {profile.currentStreak}d
            </span>
          </div>

          <div className="bg-[#0b1220] p-3 rounded-2xl border border-[#19273a] text-center min-w-[100px]">
            <span className="text-[10px] text-[#aab5c4] block uppercase font-semibold">Total XP</span>
            <span className="text-base font-bold text-[#d6b56d] flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-4 h-4" /> {profile.xp}
            </span>
          </div>

          <div className="bg-[#0b1220] p-3 rounded-2xl border border-[#19273a] text-center min-w-[100px]">
            <span className="text-[10px] text-[#aab5c4] block uppercase font-semibold">Lessons</span>
            <span className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> {completedCount}
            </span>
          </div>

          <div className="bg-[#0b1220] p-3 rounded-2xl border border-[#19273a] text-center min-w-[100px]">
            <span className="text-[10px] text-[#aab5c4] block uppercase font-semibold">Puzzle Elo</span>
            <span className="text-base font-mono font-bold text-[#f3f0e8] mt-0.5 block">
              {profile.puzzleRating}
            </span>
          </div>
        </div>
      </div>

      {/* Smart Revision Recommendation (Section 6.13) */}
      <div className="bg-gradient-to-r from-[#19273a] to-[#121d2e] p-6 rounded-3xl border border-[#d6b56d]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#d6b56d]/15 border border-[#d6b56d] flex items-center justify-center text-[#d6b56d] shrink-0 mt-0.5">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#d6b56d] uppercase tracking-wider">
              Smart Revision Engine
            </div>
            <h3 className="font-display text-base font-bold text-[#f3f0e8] mt-0.5">
              Target Weakness Detected: {weakestSkill.name} ({weakestSkill.score}% mastery)
            </h3>
            <p className="text-xs text-[#aab5c4] mt-1 max-w-xl">
              Based on recent exercise attempts, targeted drills in this area will yield the highest rating jump.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartRevision}
          className="px-5 py-2.5 rounded-xl bg-[#d6b56d] hover:bg-[#e5c782] text-[#0b1220] font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Start Refresher Drill</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Skill Breakdown & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tactical Skill Mastery Bars */}
        <div className="lg:col-span-7 bg-[#121d2e] p-6 rounded-3xl border border-[#19273a] shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#f3f0e8]">
              Chess Competency Breakdown
            </h3>
            <span className="text-xs text-[#aab5c4]">Updated Real-Time</span>
          </div>

          <div className="space-y-4">
            {skillsList.map(skill => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-[#f3f0e8]">
                    {skill.icon}
                    <span>{skill.name}</span>
                  </span>
                  <span className="font-mono text-[#d6b56d]">{skill.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0b1220] rounded-full overflow-hidden border border-[#19273a]">
                  <div
                    className="h-full bg-gradient-to-r from-[#d6b56d] to-[#e5c782] rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unlocked Achievements */}
        <div className="lg:col-span-5 bg-[#121d2e] p-6 rounded-3xl border border-[#19273a] shadow-xl space-y-4">
          <h3 className="font-display text-lg font-bold text-[#f3f0e8] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d6b56d]" /> Academy Milestones
          </h3>

          <div className="space-y-3">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-[#152336] border-[#d6b56d]/30'
                    : 'bg-[#0b1220] border-[#19273a] opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-[#d6b56d]/20 text-[#d6b56d]'
                      : 'bg-[#19273a] text-[#728096]'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f3f0e8]">{ach.title}</div>
                  <div className="text-[11px] text-[#aab5c4]">{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
