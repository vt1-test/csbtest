import { getSql } from "@/lib/db";
import { jsonText } from "./helpers";
import { DEMO_QUESTIONS } from "@/lib/seed/demo-questions";
import { CSB_QUESTIONS } from "@/lib/seed/csb-questions";
import type { SeedQuestion } from "@/lib/seed/demo-questions";

const DEMO_INSTRUCTIONS = `This short quiz validates every question type in the engine.

• Single choice, multiple choice, true/false, yes/no
• Matching, ordering, dropdown, and image choice
• Timer, autosave, mark for review, and navigator

You may move backward. Submit when finished. Practice mode shows feedback after each question.`;

const CSB_INSTRUCTIONS = `CSB Mock Exam 2 — Business Communications.

• 41 questions imported from the source exam document (42 listed in the original; one page did not capture a unique stem).
• Time limit is 70 minutes.
• You may mark questions for review and return to them.
• In Exam mode, explanations are hidden until you submit.
• In Practice mode, correctness and explanations appear after you answer.

When time expires the attempt is submitted automatically.`;

async function insertQuiz(params: {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  passing: number;
  feedbackMode: string;
  questions: SeedQuestion[];
}) {
  const sql = await getSql();
  await sql.query(
    `insert into quizzes (
      id, title, slug, description, instructions, category, difficulty,
      time_limit_seconds, passing_percentage, feedback_mode, show_explanation,
      show_score_immediately, randomize_questions, randomize_options,
      allow_back_navigation, allow_retake, max_attempts, published, active
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true,true,false,true,true,true,null,true,true)
    on conflict (id) do nothing`,
    [
      params.id,
      params.title,
      params.slug,
      params.description,
      params.instructions,
      params.category,
      params.difficulty,
      params.timeLimit,
      params.passing,
      params.feedbackMode,
    ],
  );

  for (let i = 0; i < params.questions.length; i += 1) {
    const q = params.questions[i];
    await sql.query(
      `insert into questions (
        id, quiz_id, type, stem, instruction, explanation, difficulty, points,
        required_answers, scoring_mode, position, status, source_id, needs_review, review_note, payload
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published',$12,$13,$14,$15::jsonb)
      on conflict (id) do nothing`,
      [
        q.id,
        params.id,
        q.type,
        q.stem,
        q.instruction,
        q.explanation,
        "Medium",
        q.points,
        q.requiredAnswers,
        q.scoringMode,
        i + 1,
        q.sourceId,
        q.needsReview,
        q.reviewNote,
        jsonText(q.payload),
      ],
    );
  }
}

export async function ensureSeeded() {
  const sql = await getSql();
  const rows = await sql.query<{ value: { ok?: boolean } | string }>(
    `select value from app_settings where key = 'seeded_v1'`,
  );
  if (rows[0]) return;
  await insertQuiz({
    id: "quiz-engine-demo",
    title: "Question Engine Demo",
    slug: "engine-demo",
    description:
      "Eight questions covering every interaction type. Use this to verify the exam player before taking a full mock.",
    instructions: DEMO_INSTRUCTIONS,
    category: "Platform",
    difficulty: "Beginner",
    timeLimit: 20 * 60,
    passing: 70,
    feedbackMode: "PRACTICE",
    questions: DEMO_QUESTIONS,
  });
  await insertQuiz({
    id: "quiz-csb-mock-2",
    title: "CSB Mock Exam 2 — Business Communications",
    slug: "csb-mock-2",
    description:
      "Full mock exam imported from the CSB Mock 2 source document. Communication, presentation, copyright, listening, and workplace writing.",
    instructions: CSB_INSTRUCTIONS,
    category: "Business Communications",
    difficulty: "Intermediate",
    timeLimit: 70 * 60,
    passing: 70,
    feedbackMode: "EXAM",
    questions: CSB_QUESTIONS,
  });
  await sql.query(`insert into app_settings (key, value) values ('seeded_v1', '{"ok":true}'::jsonb) on conflict do nothing`);
}
