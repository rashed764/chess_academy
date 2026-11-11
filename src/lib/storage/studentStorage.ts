import type { StudentProfile } from '../../types';

const STORAGE_KEY = 'chessmind_academy_student_v1';

const DEFAULT_PROFILE: StudentProfile = {
  username: 'ScholarOfChess',
  displayName: 'Grandmaster Candidate',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 1,
  xp: 120,
  currentStreak: 3,
  highestStreak: 7,
  estimatedElo: 750,
  puzzleRating: 820,
  dailyGoalMinutes: 20,
  dailyGoalProgressMinutes: 12,
  completedLessons: {
    'l-101-1': { completedAt: new Date(Date.now() - 86400000).toISOString(), score: 100 },
  },
  solvedPuzzles: {
    'puz-104': true,
  },
  skills: {
    tacticsForks: 45,
    tacticsPins: 40,
    tacticsSkewers: 35,
    openingPrinciples: 60,
    kingSafety: 55,
    endgameBasics: 30,
  },
};

export function loadStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStudentProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage best effort
  }
}

export function recordLessonCompletion(lessonId: string, score: number, xpReward: number): StudentProfile {
  const profile = loadStudentProfile();
  const alreadyDone = Boolean(profile.completedLessons[lessonId]);

  const updated: StudentProfile = {
    ...profile,
    completedLessons: {
      ...profile.completedLessons,
      [lessonId]: { completedAt: new Date().toISOString(), score },
    },
    // Only award XP if not already completed, or bonus for higher score
    xp: alreadyDone ? profile.xp + 10 : profile.xp + xpReward,
    level: Math.floor((alreadyDone ? profile.xp + 10 : profile.xp + xpReward) / 200) + 1,
    dailyGoalProgressMinutes: Math.min(profile.dailyGoalMinutes, profile.dailyGoalProgressMinutes + 8),
  };

  saveStudentProfile(updated);
  return updated;
}

export function recordPuzzleSolved(puzzleId: string, ratingDelta: number = 15): StudentProfile {
  const profile = loadStudentProfile();
  const alreadySolved = Boolean(profile.solvedPuzzles[puzzleId]);

  const updated: StudentProfile = {
    ...profile,
    solvedPuzzles: {
      ...profile.solvedPuzzles,
      [puzzleId]: true,
    },
    puzzleRating: alreadySolved ? profile.puzzleRating : profile.puzzleRating + ratingDelta,
    xp: profile.xp + (alreadySolved ? 5 : 25),
    level: Math.floor((profile.xp + (alreadySolved ? 5 : 25)) / 200) + 1,
  };

  saveStudentProfile(updated);
  return updated;
}
