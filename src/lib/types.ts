export const QUESTION_TYPES = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "YES_NO",
  "MATCHING",
  "ORDERING",
  "DROPDOWN",
  "IMAGE_CHOICE",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const ATTEMPT_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "EXPIRED",
  "ABANDONED",
] as const;
export type AttemptStatus = (typeof ATTEMPT_STATUSES)[number];

export const QUIZ_MODES = ["PRACTICE", "EXAM"] as const;
export type QuizMode = (typeof QUIZ_MODES)[number];

export const SCORING_MODES = ["all_or_nothing", "proportional", "per_blank"] as const;
export type ScoringMode = (typeof SCORING_MODES)[number];

export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "DEACTIVATED";

export type ChoiceOption = {
  id: string;
  text: string;
  imageUrl?: string;
  alt?: string;
};

export type MatchPair = { sourceId: string; targetId: string };
export type MatchItem = { id: string; text: string };

export type OrderItem = { id: string; text: string; correctPosition: number };

export type DropdownBlank = {
  id: string;
  prompt: string;
  choices: string[];
  correct: string;
};

export type QuestionPayload = {
  options?: ChoiceOption[];
  correctOptionIds?: string[];
  sources?: MatchItem[];
  targets?: MatchItem[];
  pairs?: MatchPair[];
  orderItems?: OrderItem[];
  blanks?: DropdownBlank[];
};

export type QuestionRecord = {
  id: string;
  quizId: string;
  type: QuestionType;
  stem: string;
  instruction: string;
  explanation: string;
  difficulty: string;
  points: number;
  requiredAnswers: number | null;
  scoringMode: ScoringMode;
  position: number;
  status: "draft" | "published";
  sourceId: string | null;
  needsReview: boolean;
  reviewNote: string | null;
  payload: QuestionPayload;
};

/** Public question sent to the exam client — no answer key. */
export type ExamQuestion = {
  id: string;
  type: QuestionType;
  stem: string;
  instruction: string;
  points: number;
  requiredAnswers: number | null;
  options?: ChoiceOption[];
  sources?: MatchItem[];
  targets?: MatchItem[];
  orderItems?: { id: string; text: string }[];
  blanks?: { id: string; prompt: string; choices: string[] }[];
};

export type AnswerValue =
  | { optionId: string }
  | { optionIds: string[] }
  | { pairs: Record<string, string> }
  | { itemIds: string[] }
  | { blanks: Record<string, string> };

export type QuizSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: string;
  timeLimitSeconds: number;
  passingPercentage: number;
  feedbackMode: QuizMode;
  showExplanation: boolean;
  showScoreImmediately: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  allowBackNavigation: boolean;
  allowRetake: boolean;
  maxAttempts: number | null;
  matchingScoring: ScoringMode;
  orderingScoring: ScoringMode;
  dropdownScoring: ScoringMode;
  published: boolean;
  active: boolean;
  archived: boolean;
  questionCount: number;
  attemptCount?: number;
  averageScore?: number | null;
};

export type Profile = {
  userId: string;
  fullName: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
};

export type AttemptSummary = {
  id: string;
  quizId: string;
  quizTitle: string;
  attemptNumber: number;
  mode: QuizMode;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  durationSeconds: number;
  timeUsedSeconds: number | null;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  passed: boolean | null;
  correctCount: number | null;
  incorrectCount: number | null;
  unansweredCount: number | null;
};

export type SaveState = "idle" | "saving" | "saved" | "error";
