import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { nid } from "@/lib/utils";
import { parseDocxBuffer, type ImportRecord, type ImportReport } from "@/lib/import/docx";
import { AppError, audit, jsonText, requireAdmin } from "./helpers";

export const parseDocxUpload = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ filename: z.string(), base64: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.base64.length > 12_000_000) throw new AppError("File too large (max ~8MB)");
    const binary = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const parsed = await parseDocxBuffer(binary.buffer, data.filename);
    const id = nid("impjob");
    const sql = await getSql();
    await sql.query(
      `insert into import_jobs (id, created_by, filename, status, report, records)
       values ($1,$2,$3,'parsed',$4::jsonb,$5::jsonb)`,
      [id, context.userId, data.filename, jsonText(parsed.report), jsonText(parsed.records)],
    );
    await audit(context.userId, "import.parsed", "import_job", id, parsed.report);
    return { jobId: id, report: parsed.report, records: parsed.records };
  });

export const getImportJob = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ jobId: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      filename: string;
      status: string;
      report: ImportReport;
      records: ImportRecord[] | string;
    }>(`select * from import_jobs where id = $1`, [data.jobId]);
    if (!rows[0]) throw new AppError("Import job not found", 404);
    const records = typeof rows[0].records === "string" ? (JSON.parse(rows[0].records) as ImportRecord[]) : rows[0].records;
    return {
      id: rows[0].id,
      filename: rows[0].filename,
      status: rows[0].status,
      report: rows[0].report,
      records,
    };
  });

export const saveImportRecords = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ jobId: z.string(), records: z.array(z.custom<ImportRecord>()) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql.query(`update import_jobs set records = $2::jsonb where id = $1`, [
      data.jobId,
      jsonText(data.records),
    ]);
    return { ok: true };
  });

export const commitImport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      jobId: z.string(),
      quizId: z.string(),
      onlyReady: z.boolean().default(false),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const job = await sql.query<{ records: ImportRecord[] | string }>(
      `select records from import_jobs where id = $1`,
      [data.jobId],
    );
    if (!job[0]) throw new AppError("Import job not found", 404);
    const records = typeof job[0].records === "string" ? JSON.parse(job[0].records) : job[0].records;
    const quiz = await sql.query(`select id from quizzes where id = $1`, [data.quizId]);
    if (!quiz[0]) throw new AppError("Quiz not found", 404);
    const posRow = await sql.query<{ n: number }>(
      `select coalesce(max(position),0)::int as n from questions where quiz_id = $1`,
      [data.quizId],
    );
    let pos = posRow[0]?.n ?? 0;
    let imported = 0;
    let skipped = 0;
    for (const rec of records as ImportRecord[]) {
      if (data.onlyReady && rec.status !== "READY") {
        skipped += 1;
        continue;
      }
      if (rec.status === "UNSUPPORTED") {
        skipped += 1;
        continue;
      }
      pos += 1;
      await sql.query(
        `insert into questions (
          id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
          scoring_mode, position, status, source_id, needs_review, review_note, payload
        ) values ($1,$2,$3,$4,$5,$6,'Medium',$7,$8,$9,$10,'draft',$11,$12,$13,$14::jsonb)`,
        [
          nid("q"),
          data.quizId,
          rec.type,
          rec.stem,
          rec.instruction,
          rec.explanation,
          rec.points,
          rec.requiredAnswers,
          rec.scoringMode,
          pos,
          rec.sourceId,
          rec.needsReview || rec.status === "NEEDS_REVIEW",
          rec.reviewNote,
          jsonText(rec.payload),
        ],
      );
      imported += 1;
    }
    await sql.query(`update import_jobs set status = 'imported' where id = $1`, [data.jobId]);
    await audit(context.userId, "import.performed", "import_job", data.jobId, { imported, skipped });
    return { imported, skipped };
  });
