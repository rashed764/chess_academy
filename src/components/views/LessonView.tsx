import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
} from 'lucide-react';
import type { Lesson, StudentProfile } from '../../types';
import { Chessboard } from '../chess/Chessboard';
import { makeMoveSafe } from '../../lib/chess/rules';
import { chessAudio } from '../../lib/sound/chessAudio';
import { recordLessonCompletion } from '../../lib/storage/studentStorage';

interface LessonViewProps {
  lesson: Lesson;
  profile: StudentProfile;
  onBackToAcademy: () => void;
  onProfileUpdated: (profile: StudentProfile) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  profile,
  onBackToAcademy,
  onProfileUpdated,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentFen, setCurrentFen] = useState(lesson.steps[0]?.fen || lesson.initialFen);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<'pending' | 'success' | 'mistake'>('pending');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const step = lesson.steps[currentStepIndex];
  const hasExercise = Boolean(step?.exercise);
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  // Reset step state when moving between steps
  useEffect(() => {
    if (step) {
      setCurrentFen(step.fen);
      setLastMove(null);
      setExerciseStatus('pending');
      setHintLevel(0);
    }
  }, [currentStepIndex, step]);

  const handleStudentMove = (from: string, to: string, promotion: string = 'q') => {
    if (!step.exercise || exerciseStatus === 'success') return;

    const result = makeMoveSafe(currentFen, from, to, promotion);
    if (!result.success) {
      chessAudio.playError();
      return;
    }

    // Check if the move matches any target moves
    const san = result.move?.san || '';
    const fromTo = `${from}${to}`;
    const targetMoves = step.exercise.targetMoves.map(m => m.replace(/[\+#]/g, '').trim());

    const isMatch =
      targetMoves.includes(san.replace(/[\+#]/g, '')) ||
      targetMoves.includes(fromTo) ||
      targetMoves.includes(san);

    if (isMatch) {
      setCurrentFen(result.newFen);
      setLastMove({ from, to });
      setExerciseStatus('success');
      chessAudio.playVictory();
    } else {
      setExerciseStatus('mistake');
      chessAudio.playError();
    }
  };

  const resetCurrentStep = () => {
    setCurrentFen(step.fen);
    setLastMove(null);
    setExerciseStatus('pending');
    setHintLevel(0);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      // Check if there is a quiz
      if (lesson.quiz && lesson.quiz.length > 0 && quizIndex === null) {
        setQuizIndex(0);
        return;
      }
      finishLesson();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const finishLesson = () => {
    setLessonCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    chessAudio.playVictory();
    const updated = recordLessonCompletion(lesson.id, 100, lesson.xpReward);
    onProfileUpdated(updated);
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizOption(optionIdx);
  };

  const submitQuizAnswer = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const quiz = lesson.quiz?.[quizIndex || 0];
    if (quiz && selectedQuizOption === quiz.correctIndex) {
      chessAudio.playVictory();
    } else {
      chessAudio.playError();
    }
  };

  const advanceQuiz = () => {
    if (!lesson.quiz) return;
    if (quizIndex !== null && quizIndex < lesson.quiz.length - 1) {
      setQuizIndex(prev => (prev !== null ? prev + 1 : null));
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    } else {
      finishLesson();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#19273a]">
        <button
          onClick={onBackToAcademy}
          className="flex items-center gap-2 text-sm font-semibold text-[#aab5c4] hover:text-[#f3f0e8] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#19273a] text-[#d6b56d] border border-[#d6b56d]/20">
            {lesson.stageId.toUpperCase()}
          </span>
          <span className="text-xs text-[#aab5c4]">+{lesson.xpReward} XP Reward</span>
        </div>
      </div>

      {/* Main Lesson Player Layout */}
      {lessonCompleted ? (
        /* Completion Screen */
        <div className="max-w-2xl mx-auto bg-[#121d2e] p-8 sm:p-12 rounded-3xl border border-[#d6b56d]/40 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#d6b56d]/15 border-2 border-[#d6b56d] flex items-center justify-center mx-auto text-[#d6b56d]">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="font-display text-3xl font-bold text-[#f3f0e8]">
            Lesson Mastered!
          </h2>

          <p className="text-sm text-[#aab5c4] max-w-md mx-auto">
            You successfully completed <strong className="text-[#f3f0e8]">{lesson.title}</strong> and earned{' '}
            <strong className="text-[#d6b56d]">+{lesson.xpReward} XP</strong>.
          </p>

          <div className="p-4 rounded-xl bg-[#0b1220] border border-[#19273a] text-xs text-[#aab5c4] text-left space-y-2">
            <div className="font-semibold text-[#d6b56d] uppercase tracking-wider text-[11px]">
              Key Learning Outcome
            </div>
            <div>{lesson.learningObjective}</div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onBackToAcademy}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] text-[#0b1220] font-bold text-sm shadow-lg shadow-[#d6b56d]/20 hover:brightness-110 cursor-pointer"
            >
              Continue Next Lesson
            </button>
            <button
              onClick={() => {
                setLessonCompleted(false);
                setCurrentStepIndex(0);
                setQuizIndex(null);
              }}
              className="px-5 py-3 rounded-xl bg-[#19273a] hover:bg-[#22344d] text-[#f3f0e8] font-semibold text-sm cursor-pointer"
            >
              Review Lesson Again
            </button>
          </div>
        </div>
      ) : quizIndex !== null && lesson.quiz ? (
        /* Quiz Mode */
        <div className="max-w-2xl mx-auto bg-[#121d2e] p-8 rounded-3xl border border-[#19273a] shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs text-[#aab5c4] pb-2 border-b border-[#19273a]">
            <span className="font-semibold text-[#d6b56d] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Knowledge Check
            </span>
            <span>
              Question {quizIndex + 1} of {lesson.quiz.length}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-[#f3f0e8]">
            {lesson.quiz[quizIndex].question}
          </h3>

          <div className="space-y-3 pt-2">
            {lesson.quiz[quizIndex].options.map((option, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === lesson.quiz![quizIndex].correctIndex;
              let btnClass = 'border-[#19273a] bg-[#0b1220] text-[#f3f0e8] hover:border-[#d6b56d]/40';

              if (quizSubmitted) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                } else if (isSelected) {
                  btnClass = 'border-red-500 bg-red-500/15 text-red-300';
                }
              } else if (isSelected) {
                btnClass = 'border-[#d6b56d] bg-[#d6b56d]/10 text-[#d6b56d] ring-1 ring-[#d6b56d]';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <span>{option}</span>
                  {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="p-4 rounded-xl bg-[#0b1220] border border-[#19273a] text-xs text-[#aab5c4] space-y-1">
              <span className="font-bold text-[#f3f0e8]">Explanation: </span>
              {lesson.quiz[quizIndex].explanation}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            {!quizSubmitted ? (
              <button
                onClick={submitQuizAnswer}
                disabled={selectedQuizOption === null}
                className="px-6 py-2.5 rounded-xl bg-[#d6b56d] disabled:opacity-50 text-[#0b1220] font-bold text-sm cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={advanceQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] text-[#0b1220] font-bold text-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>{quizIndex < lesson.quiz.length - 1 ? 'Next Question' : 'Complete Lesson'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Standard Step Player Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Chessboard */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-[540px]">
              <Chessboard
                fen={currentFen}
                highlightSquares={step?.highlights || []}
                arrows={step?.arrows || []}
                lastMove={lastMove}
                interactive={hasExercise && exerciseStatus !== 'success'}
                onMove={handleStudentMove}
              />

              {/* Board Controls Toolbar */}
              <div className="mt-4 flex items-center justify-between text-xs text-[#aab5c4] px-1">
                <button
                  onClick={resetCurrentStep}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121d2e] hover:bg-[#19273a] text-[#aab5c4] hover:text-[#f3f0e8] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Board</span>
                </button>

                <div className="text-xs">
                  Step <strong className="text-[#f3f0e8]">{currentStepIndex + 1}</strong> of{' '}
                  <strong className="text-[#f3f0e8]">{lesson.steps.length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pedagogy & Exercise Panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step Content Card */}
            <div className="bg-[#121d2e] p-6 rounded-2xl border border-[#19273a] shadow-xl space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#d6b56d] uppercase tracking-wider">
                  {lesson.title}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#f3f0e8] mt-1">
                  {step?.title}
                </h2>
              </div>

              <p className="text-sm text-[#f3f0e8]/90 leading-relaxed">
                {step?.explanation}
              </p>

              {/* Exercise Box */}
              {hasExercise && step.exercise && (
                <div className="p-4 rounded-xl bg-[#0b1220] border border-[#d6b56d]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d6b56d] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Student Exercise
                    </span>

                    {exerciseStatus === 'pending' && (
                      <button
                        onClick={() => setHintLevel(prev => Math.min(2, prev + 1))}
                        className="text-xs text-[#d6b56d] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Need a hint?</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#f3f0e8]">
                    {step.exercise.instruction}
                  </p>

                  {/* Graduated Hints */}
                  {hintLevel >= 1 && (
                    <div className="p-2.5 rounded-lg bg-[#19273a] text-xs text-amber-300 border border-amber-500/30">
                      <strong>Hint 1:</strong> {step.exercise.hint1}
                    </div>
                  )}
                  {hintLevel >= 2 && (
                    <div className="p-2.5 rounded-lg bg-[#19273a] text-xs text-amber-300 border border-amber-500/30">
                      <strong>Hint 2:</strong> {step.exercise.hint2}
                    </div>
                  )}

                  {/* Exercise Feedback */}
                  {exerciseStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        <strong className="block text-emerald-200">Excellent move!</strong>
                        {step.exercise.solutionExplanation}
                      </div>
                    </div>
                  )}

                  {exerciseStatus === 'mistake' && (
                    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <strong className="block text-red-200">Not quite the right move.</strong>
                        Try again, or click 'Need a hint?' for guidance.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-[#121d2e] hover:bg-[#19273a] disabled:opacity-30 text-[#f3f0e8] text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={hasExercise && exerciseStatus !== 'success'}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d6b56d] to-[#b38f44] disabled:opacity-40 text-[#0b1220] font-bold text-sm shadow-md flex items-center gap-1.5 cursor-pointer hover:brightness-110"
              >
                <span>
                  {isLastStep
                    ? lesson.quiz && lesson.quiz.length > 0
                      ? 'Take Quiz'
                      : 'Complete Lesson'
                    : 'Next Step'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
