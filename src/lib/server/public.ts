import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { ensureSeeded } from "./seed";
import type { QuizSummary } from "@/lib/types";
import { z } from "zod";

type QuizRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: string;
  time_limit_seconds: number;
  passing_percentage: number;
  feedback_mode: QuizSummary["feedbackMode"];
  show_explanation: boolean;
  show_score_immediately: boolean;
  randomize_questions: boolean;
  randomize_options: boolean;
  allow_back_navigation: boolean;
  allow_retake: boolean;
  max_attempts: number | null;
  matching_scoring: QuizSummary["matchingScoring"];
  ordering_scoring: QuizSummary["orderingScoring"];
  dropdown_scoring: QuizSummary["dropdownScoring"];
  published: boolean;
  active: boolean;
  archived: boolean;
  question_count: number;
  attempt_count: number;
  average_score: string | number | null;
};

function mapQuiz(row: QuizRow): QuizSummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    instructions: row.instructions,
    category: row.category,
    difficulty: row.difficulty,
    timeLimitSeconds: row.time_limit_seconds,
    passingPercentage: row.passing_percentage,
    feedbackMode: row.feedback_mode,
    showExplanation: row.show_explanation,
    showScoreImmediately: row.show_score_immediately,
    randomizeQuestions: row.randomize_questions,
    randomizeOptions: row.randomize_options,
    allowBackNavigation: row.allow_back_navigation,
    allowRetake: row.allow_retake,
    maxAttempts: row.max_attempts,
    matchingScoring: row.matching_scoring,
    orderingScoring: row.ordering_scoring,
    dropdownScoring: row.dropdown_scoring,
    published: row.published,
    active: row.active,
    archived: row.archived,
    questionCount: Number(row.question_count),
    attemptCount: Number(row.attempt_count ?? 0),
    averageScore: row.average_score == null ? null : Number(row.average_score),
  };
}

const QUIZ_SELECT = `
  select q.*,
    (select count(*)::int from questions qq where qq.quiz_id = q.id and qq.status = 'published') as question_count,
    (select count(*)::int from quiz_attempts a where a.quiz_id = q.id and a.status in ('SUBMITTED','EXPIRED')) as attempt_count,
    (select avg(percentage) from quiz_attempts a where a.quiz_id = q.id and a.status in ('SUBMITTED','EXPIRED')) as average_score
  from quizzes q
`;

export const listPublishedQuizzes = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql.query<QuizRow>(
    `${QUIZ_SELECT} where q.published = true and q.active = true and q.archived = false order by q.title`,
  );
  return rows.map(mapQuiz);
});

export const getQuizBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql.query<QuizRow>(`${QUIZ_SELECT} where q.slug = $1`, [data.slug]);
    const quiz = rows[0];
    if (!quiz || !quiz.published || !quiz.active || quiz.archived) return null;
    return mapQuiz(quiz);
  });

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeeded();
  const sql = await getSql();
  const rows = await sql.query<{ category: string; n: number }>(
    `select category, count(*)::int as n from quizzes
     where published = true and active = true and archived = false
     group by category order by category`,
  );
  return rows;
});
