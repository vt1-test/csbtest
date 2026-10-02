import { o as __toESM } from "../_runtime.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CZxOMQ2J.mjs";
import { o as nid } from "./utils-DtDPPULZ.mjs";
import { a as jsonText, l as requireAdmin, n as audit, r as createServerRpc, t as AppError } from "./helpers-VgSEk9M3.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { _n as object, bn as string, dn as boolean, fn as custom, un as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-api-K43d1VKw.js
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function xmlToText(xml) {
	let text = xml.replace(/<\/w:p>/g, "\n");
	text = text.replace(/<w:tab[^/]*\/>/g, "	");
	text = text.replace(/<w:br[^/]*\/>/g, "\n");
	text = text.replace(/<[^>]+>/g, "");
	text = text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;/g, "'");
	return text;
}
var ARTIFACT = /^(top of form|bottom of form|end of page|back|next|backnext|finish|your answer is correct!?|your answers|correct answers|mark for review|skip|explanation:?)$/i;
function cleanBlocks(raw) {
	const pages = raw.split(/End of page/i);
	const out = [];
	for (const page of pages) {
		const lines = page.split(/\n/).map((l) => l.replace(/\u00a0/g, " ").trim()).filter((l) => l && !ARTIFACT.test(l) && !/^Question\s+\d+\s+of\s+\d+/i.test(l));
		if (lines.length) out.push(lines.join("\n"));
	}
	return out;
}
function detectType(text) {
	const lower = text.toLowerCase();
	if (/select the image|best example of the design principle/i.test(text)) return "IMAGE_CHOICE";
	if (/move all the components|place them in the correct order|move all of the communications/i.test(text)) return "ORDERING";
	if (/matching situation|from the list on the left to the matching/i.test(text)) return "MATCHING";
	if (/drop-down list|complete each statement|for each skill, select|for each (scenario|method|question|statement|environmental factor|criticism)/i.test(text)) return "DROPDOWN";
	if (/choose two|choose three|choose four/i.test(text)) return "MULTIPLE_CHOICE";
	if (/true or false/.test(lower) && /select whether each statement/.test(lower)) return "DROPDOWN";
	if (/^\s*true\b/im.test(text) && /^\s*false\b/im.test(text) && (text.match(/^[-•]/gm) ?? []).length <= 4) return "TRUE_FALSE";
	return "SINGLE_CHOICE";
}
function splitExplanation(text) {
	const idx = text.search(/\nExplanation\s*:?/i);
	if (idx === -1) return {
		body: text.trim(),
		explanation: ""
	};
	return {
		body: text.slice(0, idx).trim(),
		explanation: text.slice(idx).replace(/^Explanation\s*:?/i, "").trim()
	};
}
function parseOptions(body) {
	const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
	const start = lines.findIndex((l) => /choose |what |which |how |select /i.test(l));
	return (start >= 0 ? lines.slice(start + 1) : lines.slice(-8)).filter((l) => l.length > 2 && !/^explanation/i.test(l));
}
async function parseDocxBuffer(buffer, filename) {
	const doc = (await import_lib.default.loadAsync(buffer)).file("word/document.xml");
	if (!doc) return {
		records: [],
		report: {
			detected: 0,
			ready: 0,
			needsReview: 0,
			unsupported: 1,
			duplicate: 0,
			skipped: 1
		},
		filename
	};
	const blocks = cleanBlocks(xmlToText(await doc.async("string")));
	const records = [];
	const seen = /* @__PURE__ */ new Set();
	let duplicate = 0;
	let skipped = 0;
	for (const block of blocks) {
		const { body, explanation } = splitExplanation(block);
		if (body.length < 40) {
			skipped += 1;
			continue;
		}
		const key = body.slice(0, 180);
		if (seen.has(key)) {
			duplicate += 1;
			continue;
		}
		seen.add(key);
		const type = detectType(body);
		const instructionMatch = body.match(/\(Choose \w+\)|Choose one\.|Choose two\.|Choose three\.|Choose four\./i);
		const record = {
			id: nid("imp"),
			type: type === "UNSUPPORTED" ? "SINGLE_CHOICE" : type,
			stem: body,
			instruction: instructionMatch?.[0] ?? "",
			explanation,
			points: 1,
			requiredAnswers: /choose two/i.test(body) ? 2 : /choose three/i.test(body) ? 3 : /choose four/i.test(body) ? 4 : 1,
			scoringMode: type === "DROPDOWN" ? "per_blank" : "all_or_nothing",
			sourceId: filename,
			needsReview: !explanation || type === "UNSUPPORTED" || parseOptions(body).length < 2,
			reviewNote: !explanation ? "No explanation captured from the source block." : null,
			payload: {
				options: parseOptions(body).slice(0, 10).map((text, i) => ({
					id: String.fromCharCode(97 + i),
					text
				})),
				correctOptionIds: []
			},
			status: "NEEDS_REVIEW"
		};
		if (type === "UNSUPPORTED") record.status = "UNSUPPORTED";
		else if (record.needsReview) record.status = "NEEDS_REVIEW";
		else record.status = "READY";
		records.push(record);
	}
	return {
		records,
		report: {
			detected: records.length,
			ready: records.filter((r) => r.status === "READY").length,
			needsReview: records.filter((r) => r.status === "NEEDS_REVIEW").length,
			unsupported: records.filter((r) => r.status === "UNSUPPORTED").length,
			duplicate,
			skipped
		},
		filename
	};
}
var parseDocxUpload_createServerFn_handler = createServerRpc({
	id: "df265b496c7d5e35dc66ea28f0c251cf836c7e01a6c3186768a3d3b34b0c4a03",
	name: "parseDocxUpload",
	filename: "src/lib/server/import-api.ts"
}, (opts) => parseDocxUpload.__executeServer(opts));
var parseDocxUpload = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	filename: string(),
	base64: string()
})).handler(parseDocxUpload_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.base64.length > 12e6) throw new AppError("File too large (max ~8MB)");
	const parsed = await parseDocxBuffer(Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0)).buffer, data.filename);
	const id = nid("impjob");
	await (await getSql()).query(`insert into import_jobs (id, created_by, filename, status, report, records)
       values ($1,$2,$3,'parsed',$4::jsonb,$5::jsonb)`, [
		id,
		context.userId,
		data.filename,
		jsonText(parsed.report),
		jsonText(parsed.records)
	]);
	await audit(context.userId, "import.parsed", "import_job", id, parsed.report);
	return {
		jobId: id,
		report: parsed.report,
		records: parsed.records
	};
});
var getImportJob_createServerFn_handler = createServerRpc({
	id: "00be8be42c88d47996847fe186c5598efee13f48d173d83c4127f964bd1ac7c1",
	name: "getImportJob",
	filename: "src/lib/server/import-api.ts"
}, (opts) => getImportJob.__executeServer(opts));
var getImportJob = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ jobId: string() })).handler(getImportJob_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql()).query(`select * from import_jobs where id = $1`, [data.jobId]);
	if (!rows[0]) throw new AppError("Import job not found", 404);
	const records = typeof rows[0].records === "string" ? JSON.parse(rows[0].records) : rows[0].records;
	return {
		id: rows[0].id,
		filename: rows[0].filename,
		status: rows[0].status,
		report: rows[0].report,
		records
	};
});
var saveImportRecords_createServerFn_handler = createServerRpc({
	id: "101beb0b63b7491a8c51c8a0bba35f485e56c32080863d5c9480e3429cdef7f1",
	name: "saveImportRecords",
	filename: "src/lib/server/import-api.ts"
}, (opts) => saveImportRecords.__executeServer(opts));
var saveImportRecords = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	jobId: string(),
	records: array(custom())
})).handler(saveImportRecords_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql()).query(`update import_jobs set records = $2::jsonb where id = $1`, [data.jobId, jsonText(data.records)]);
	return { ok: true };
});
var commitImport_createServerFn_handler = createServerRpc({
	id: "10b5c305dcd9935a831db27706a65398c59114fd7086ca7f7dc74b713ec98312",
	name: "commitImport",
	filename: "src/lib/server/import-api.ts"
}, (opts) => commitImport.__executeServer(opts));
var commitImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	jobId: string(),
	quizId: string(),
	onlyReady: boolean().default(false)
})).handler(commitImport_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const job = await sql.query(`select records from import_jobs where id = $1`, [data.jobId]);
	if (!job[0]) throw new AppError("Import job not found", 404);
	const records = typeof job[0].records === "string" ? JSON.parse(job[0].records) : job[0].records;
	if (!(await sql.query(`select id from quizzes where id = $1`, [data.quizId]))[0]) throw new AppError("Quiz not found", 404);
	let pos = (await sql.query(`select coalesce(max(position),0)::int as n from questions where quiz_id = $1`, [data.quizId]))[0]?.n ?? 0;
	let imported = 0;
	let skipped = 0;
	for (const rec of records) {
		if (data.onlyReady && rec.status !== "READY") {
			skipped += 1;
			continue;
		}
		if (rec.status === "UNSUPPORTED") {
			skipped += 1;
			continue;
		}
		pos += 1;
		await sql.query(`insert into questions (
          id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
          scoring_mode, position, status, source_id, needs_review, review_note, payload
        ) values ($1,$2,$3,$4,$5,$6,'Medium',$7,$8,$9,$10,'draft',$11,$12,$13,$14::jsonb)`, [
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
			jsonText(rec.payload)
		]);
		imported += 1;
	}
	await sql.query(`update import_jobs set status = 'imported' where id = $1`, [data.jobId]);
	await audit(context.userId, "import.performed", "import_job", data.jobId, {
		imported,
		skipped
	});
	return {
		imported,
		skipped
	};
});
//#endregion
export { commitImport_createServerFn_handler, getImportJob_createServerFn_handler, parseDocxUpload_createServerFn_handler, saveImportRecords_createServerFn_handler };
