import { r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { r as getSql } from "./db-CZxOMQ2J.mjs";
import { o as nid } from "./utils-DtDPPULZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/helpers-VgSEk9M3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var AppError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.name = "AppError";
		this.status = status;
	}
};
function jsonText(value) {
	return JSON.stringify(value);
}
async function audit(actorId, action, entityType, entityId, metadata = {}) {
	await (await getSql()).query(`insert into audit_logs (id, actor_id, action, entity_type, entity_id, metadata)
     values ($1, $2, $3, $4, $5, $6::jsonb)`, [
		nid("aud"),
		actorId,
		action,
		entityType,
		entityId,
		jsonText(metadata)
	]);
}
async function ensureProfile(userId, name, email) {
	const sql = await getSql();
	const authUser = await sql.query(`select name, email from "user" where id = $1`, [userId]);
	const fullName = name || authUser[0]?.name || "";
	const resolvedEmail = email || authUser[0]?.email || null;
	const existing = await sql.query(`select user_id, full_name, role, status from user_profiles where user_id = $1`, [userId]);
	if (existing[0]) {
		if (!existing[0].full_name && fullName) await sql.query(`update user_profiles set full_name = $2, last_login_at = now(), updated_at = now() where user_id = $1`, [userId, fullName]);
		else await sql.query(`update user_profiles set last_login_at = now(), updated_at = now() where user_id = $1`, [userId]);
		return {
			userId: existing[0].user_id,
			fullName: existing[0].full_name || fullName,
			email: resolvedEmail,
			role: existing[0].role,
			status: existing[0].status
		};
	}
	const role = ((await sql.query(`select count(*)::int as n from user_profiles where role = 'ADMIN'`))[0]?.n ?? 0) === 0 ? "ADMIN" : "USER";
	await sql.query(`insert into user_profiles (user_id, full_name, role, status, last_login_at)
     values ($1, $2, $3, 'ACTIVE', now())`, [
		userId,
		fullName,
		role
	]);
	return {
		userId,
		fullName,
		email: resolvedEmail,
		role,
		status: "ACTIVE"
	};
}
async function requireAdmin(userId) {
	const row = (await (await getSql()).query(`select user_id, full_name, role, status from user_profiles where user_id = $1`, [userId]))[0];
	if (!row) throw new AppError("Forbidden", 403);
	if (row.role !== "ADMIN" || row.status !== "ACTIVE") throw new AppError("Forbidden", 403);
	return {
		userId: row.user_id,
		fullName: row.full_name,
		email: null,
		role: row.role,
		status: row.status
	};
}
async function requireActiveUser(userId) {
	const row = (await (await getSql()).query(`select user_id, full_name, role, status from user_profiles where user_id = $1`, [userId]))[0];
	if (!row) throw new AppError("Account not found", 401);
	if (row.status !== "ACTIVE") throw new AppError("Account deactivated", 403);
	return {
		userId: row.user_id,
		fullName: row.full_name,
		email: null,
		role: row.role,
		status: row.status
	};
}
function mapQuestion(row) {
	const payload = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload ?? {};
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
		payload
	};
}
async function loadQuestions(quizId, publishedOnly = true) {
	return (await (await getSql()).query(`select * from questions where quiz_id = $1 ${publishedOnly ? "and status = 'published'" : ""} order by position, id`, [quizId])).map(mapQuestion);
}
//#endregion
export { jsonText as a, requireActiveUser as c, ensureProfile as i, requireAdmin as l, audit as n, loadQuestions as o, createServerRpc as r, mapQuestion as s, AppError as t };
