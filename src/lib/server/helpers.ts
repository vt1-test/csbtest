import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";
import type { Profile, QuestionPayload, QuestionRecord, QuestionType, ScoringMode } from "@/lib/types";

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

export function jsonText(value: unknown): string {
  return JSON.stringify(value);
}

export async function audit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const sql = await getSql();
  await sql.query(
    `insert into audit_logs (id, actor_id, action, entity_type, entity_id, metadata)
     values ($1, $2, $3, $4, $5, $6::jsonb)`,
    [nid("aud"), actorId, action, entityType, entityId, jsonText(metadata)],
  );
}

type ProfileRow = {
  user_id: string;
  full_name: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "DEACTIVATED";
};

export async function ensureProfile(
  userId: string,
  name: string | null,
  email: string | null,
): Promise<Profile> {
  const sql = await getSql();
  const authUser = await sql.query<{ name: string; email: string }>(
    `select name, email from "user" where id = $1`,
    [userId],
  );
  const fullName = name || authUser[0]?.name || "";
  const resolvedEmail = email || authUser[0]?.email || null;
  const existing = await sql.query<ProfileRow>(
    `select user_id, full_name, role, status from user_profiles where user_id = $1`,
    [userId],
  );
  if (existing[0]) {
    if (!existing[0].full_name && fullName) {
      await sql.query(`update user_profiles set full_name = $2, last_login_at = now(), updated_at = now() where user_id = $1`, [
        userId,
        fullName,
      ]);
    } else {
      await sql.query(`update user_profiles set last_login_at = now(), updated_at = now() where user_id = $1`, [
        userId,
      ]);
    }
    return {
      userId: existing[0].user_id,
      fullName: existing[0].full_name || fullName,
      email: resolvedEmail,
      role: existing[0].role,
      status: existing[0].status,
    };
  }
  const admins = await sql.query<{ n: number }>(`select count(*)::int as n from user_profiles where role = 'ADMIN'`);
  const role = (admins[0]?.n ?? 0) === 0 ? "ADMIN" : "USER";
  await sql.query(
    `insert into user_profiles (user_id, full_name, role, status, last_login_at)
     values ($1, $2, $3, 'ACTIVE', now())`,
    [userId, fullName, role],
  );
  return { userId, fullName, email: resolvedEmail, role, status: "ACTIVE" };
}

export async function requireAdmin(userId: string): Promise<Profile> {
  const sql = await getSql();
  const rows = await sql.query<ProfileRow>(
    `select user_id, full_name, role, status from user_profiles where user_id = $1`,
    [userId],
  );
  const row = rows[0];
  if (!row) throw new AppError("Forbidden", 403);
  if (row.role !== "ADMIN" || row.status !== "ACTIVE") throw new AppError("Forbidden", 403);
  return { userId: row.user_id, fullName: row.full_name, email: null, role: row.role, status: row.status };
}

export async function requireActiveUser(userId: string): Promise<Profile> {
  const sql = await getSql();
  const rows = await sql.query<ProfileRow>(
    `select user_id, full_name, role, status from user_profiles where user_id = $1`,
    [userId],
  );
  const row = rows[0];
  if (!row) throw new AppError("Account not found", 401);
  if (row.status !== "ACTIVE") throw new AppError("Account deactivated", 403);
  return { userId: row.user_id, fullName: row.full_name, email: null, role: row.role, status: row.status };
}

type QuestionRow = {
  id: string;
  quiz_id: string;
  type: QuestionType;
  stem: string;
  instruction: string;
  explanation: string;
  difficulty: string;
  points: string | number;
  required_answers: number | null;
  scoring_mode: ScoringMode;
  position: number;
  status: "draft" | "published";
  source_id: string | null;
  needs_review: boolean;
  review_note: string | null;
  payload: QuestionPayload | string;
};

export function mapQuestion(row: QuestionRow): QuestionRecord {
  const payload =
    typeof row.payload === "string" ? (JSON.parse(row.payload) as QuestionPayload) : row.payload ?? {};
  return {
    id: row.id,
    quizId: row.quiz_id,
    type: row.type,
    stem: row.stem,
    instruction: row.instruction,
    explanation: row.explanation,
    difficulty: row.difficulty,
    points: Number(row.points),
    requiredAnswers: row.required_answers,
    scoringMode: row.scoring_mode,
    position: row.position,
    status: row.status,
    sourceId: row.source_id,
    needsReview: Boolean(row.needs_review),
    reviewNote: row.review_note,
    payload,
  };
}

export async function loadQuestions(quizId: string, publishedOnly = true): Promise<QuestionRecord[]> {
  const sql = await getSql();
  const rows = await sql.query<QuestionRow>(
    `select * from questions where quiz_id = $1 ${publishedOnly ? "and status = 'published'" : ""} order by position, id`,
    [quizId],
  );
  return rows.map(mapQuestion);
}
