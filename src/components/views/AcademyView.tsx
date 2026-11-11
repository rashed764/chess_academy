import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Crown,
  Award,
  Trophy,
} from 'lucide-react';
import type { Lesson, Stage, StudentProfile } from '../../types';
import { CURRICULUM_STAGES } from '../../lib/curriculum/curriculumData';

interface AcademyViewProps {
  profile: StudentProfile;
  onSelectLesson: (lesson: Lesson) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ profile, onSelectLesson }) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-1');

  const selectedStage = CURRICULUM_STAGES.find(s => s.id === selectedStageId) || CURRICULUM_STAGES[0];

  // Calculate completed count in this stage
  const allLessonsInStage = selectedStage.courses.flatMap(c => c.lessons);
  const completedInStage = allLessonsInStage.filter(l => Boolean(profile.completedLessons[l.id])).length;
  const stageProgressPercent = allLessonsInStage.length > 0 ? Math.round((completedInStage / allLessonsInStage.length) * 100) : 0;

  const stageIcons: Record<string, React.ReactNode> = {
    'stage-1': <GraduationCap className="w-5 h-5" />,
    'stage-2': <Shield className="w-5 h-5" />,
    'stage-3': <Zap className="w-5 h-5" />,
    'stage-4': <Crown className="w-5 h-5" />,
    'stage-5': <Award className="w-5 h-5" />,
    'stage-6': <Trophy className="w-5 h-5" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Academy Header Banner */}
      <div className="bg-gradient-to-r from-[#121d2e] to-[#19273a] p-6 sm:p-8 rounded-3xl border border-[#19273a] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b1220] border border-[#d6b56d]/30 text-xs font-semibold text-[#d6b56d]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>PROGRESSIVE CURRICULUM</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#f3f0e8]">
            The Academy Curriculum
          </h1>
          <p className="text-sm text-[#aab5c4] max-w-xl">
            Choose your learning level below. Complete lessons sequentially to build rock-solid foundational instincts.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-[#0b1220]/80 p-4 rounded-2xl border border-[#19273a] w-full md:w-64 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#aab5c4]">Stage Completion</span>
            <span className="font-bold text-[#d6b56d]">{stageProgressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#19273a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d6b56d] to-[#e5c782] rounded-full transition-all duration-500"
              style={{ width: `${stageProgressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-[#aab5c4] text-right">
            {completedInStage} of {allLessonsInStage.length} lessons mastered
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CURRICULUM_STAGES.map(stage => {
          const isSelected = stage.id === selectedStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#19273a] border-[#d6b56d] text-[#f3f0e8] shadow-lg shadow-[#d6b56d]/10'
                  : 'bg-[#121d2e] border-[#19273a] text-[#aab5c4] hover:border-[#2b3e59] hover:bg-[#152336]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={isSelected ? 'text-[#d6b56d]' : 'text-[#728096]'}>
                  {stageIcons[stage.id]}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0b1220] text-[#aab5c4]">
                  {stage.targetElo}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#f3f0e8] truncate">
                  Stage {stage.orderIndex}
                </div>
                <div className="text-[11px] text-[#aab5c4] truncate">{stage.title.split('—')[1] || stage.title}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail & Courses */}
      <div className="space-y-6">
        <div className="border-b border-[#19273a] pb-4">
          <h2 className="font-display text-2xl font-bold text-[#f3f0e8]">
            {selectedStage.title}
          </h2>
          <p className="text-sm text-[#aab5c4] mt-1">{selectedStage.description}</p>
        </div>

        {/* Courses & Lessons */}
        <div className="space-y-8">
          {selectedStage.courses.map(course => (
            <div key={course.id} className="bg-[#121d2e] rounded-3xl border border-[#19273a] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#f3f0e8]">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#aab5c4] mt-0.5">{course.description}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#19273a] text-[#d6b56d]">
                  {course.lessons.length} Lessons
                </span>
              </div>

              {/* Lesson Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {course.lessons.map(lesson => {
                  const isCompleted = Boolean(profile.completedLessons[lesson.id]);
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                        isCompleted
                          ? 'bg-[#152336] border-emerald-500/30 hover:border-emerald-500/60'
                          : 'bg-[#0b1220] border-[#19273a] hover:border-[#d6b56d]/50 hover:bg-[#101b2d]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-semibold text-[#aab5c4] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} min
                          </span>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Done
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d6b56d]">
                              <Sparkles className="w-3.5 h-3.5" /> +{lesson.xpReward} XP
                            </span>
                          )}
                        </div>

                        <h4 className="font-display text-base font-bold text-[#f3f0e8] group-hover:text-[#d6b56d] transition-colors mb-1">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-[#aab5c4] line-clamp-2 leading-relaxed">
                          {lesson.learningObjective}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-[#19273a] flex items-center justify-between text-xs font-bold text-[#f3f0e8] group-hover:text-[#d6b56d]">
                        <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
