export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export type Square = string; // e.g. "e4"

export interface MoveResult {
  from: string;
  to: string;
  san: string;
  piece: PieceType;
  captured?: PieceType;
  promotion?: string;
  flags: string;
}

export interface BoardArrow {
  from: string;
  to: string;
  color?: string; // e.g. "#d6b56d"
}

export type BoardActionType =
  | 'SET_POSITION'
  | 'PLAY_MOVE'
  | 'HIGHLIGHT_SQUARE'
  | 'HIGHLIGHT_SQUARES'
  | 'DRAW_ARROW'
  | 'REMOVE_ARROWS'
  | 'SHOW_LEGAL_MOVES'
  | 'RESET_BOARD'
  | 'SHOW_HINT'
  | 'WAIT_FOR_STUDENT_MOVE'
  | 'SHOW_FEEDBACK';

export interface BoardAction {
  type: BoardActionType;
  squares?: string[];
  arrow?: BoardArrow;
  fen?: string;
  move?: { from: string; to: string; promotion?: string };
  hintText?: string;
  feedbackType?: 'success' | 'warning' | 'error' | 'info';
}

export interface TeachingResponse {
  message: string;
  teaching_intent: 'explain_concept' | 'give_hint' | 'demonstrate_move' | 'ask_question' | 'praise' | 'correct_mistake';
  actions: BoardAction[];
  next_step: 'wait_for_student' | 'continue_explanation' | 'quiz_question';
  suggested_replies?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonStep {
  title: string;
  explanation: string;
  fen: string;
  arrows?: BoardArrow[];
  highlights?: string[];
  demonstrationMove?: { from: string; to: string };
  exercise?: {
    instruction: string;
    targetMoves: string[]; // Legal target SAN or from-to combinations, e.g. ["Nf3", "e2e4"]
    hint1: string;
    hint2: string;
    solutionExplanation: string;
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  stageId: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  xpReward: number;
  learningObjective: string;
  initialFen: string;
  steps: LessonStep[];
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  stageId: string;
  orderIndex: number;
  title: string;
  description: string;
  iconName: string;
  lessons: Lesson[];
}

export interface Stage {
  id: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  description: string;
  targetElo: string;
  courses: Course[];
}

export interface Puzzle {
  id: string;
  title: string;
  theme: 'fork' | 'pin' | 'skewer' | 'discovered_attack' | 'mate_in_1' | 'mate_in_2' | 'deflection';
  rating: number;
  fen: string;
  playerColor: PieceColor;
  solutionMoves: string[]; // SAN moves e.g. ["Nf7+", "Kg8", "Nh6#"]
  hintLevel1: string;
  hintLevel2: string;
  explanation: string;
}

export interface StudentProfile {
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  xp: number;
  currentStreak: number;
  highestStreak: number;
  estimatedElo: number;
  puzzleRating: number;
  dailyGoalMinutes: number;
  dailyGoalProgressMinutes: number;
  completedLessons: Record<string, { completedAt: string; score: number }>;
  solvedPuzzles: Record<string, boolean>;
  skills: {
    tacticsForks: number;
    tacticsPins: number;
    tacticsSkewers: number;
    openingPrinciples: number;
    kingSafety: number;
    endgameBasics: number;
  };
}

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'academy'
  | 'lesson'
  | 'coach'
  | 'practice'
  | 'puzzles'
  | 'analysis'
  | 'progress';
