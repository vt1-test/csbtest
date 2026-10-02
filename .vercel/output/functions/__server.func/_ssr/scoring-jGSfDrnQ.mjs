//#region node_modules/.nitro/vite/services/ssr/assets/scoring-jGSfDrnQ.js
function asOptionId(answer) {
	if (!answer || !("optionId" in answer)) return null;
	return answer.optionId || null;
}
function asOptionIds(answer) {
	if (!answer) return [];
	if ("optionIds" in answer) return [...new Set(answer.optionIds.filter(Boolean))];
	if ("optionId" in answer && answer.optionId) return [answer.optionId];
	return [];
}
function sameSet(a, b) {
	if (a.length !== b.length) return false;
	const set = new Set(a);
	return b.every((x) => set.has(x));
}
function isAnswered(type, answer) {
	if (!answer) return false;
	switch (type) {
		case "SINGLE_CHOICE":
		case "TRUE_FALSE":
		case "YES_NO":
		case "IMAGE_CHOICE":
			if ("optionId" in answer) return Boolean(answer.optionId);
			if ("optionIds" in answer) return answer.optionIds.length > 0;
			return false;
		case "MULTIPLE_CHOICE": return asOptionIds(answer).length > 0;
		case "MATCHING": return "pairs" in answer && Object.keys(answer.pairs).length > 0;
		case "ORDERING": return "itemIds" in answer && answer.itemIds.length > 0;
		case "DROPDOWN": return "blanks" in answer && Object.values(answer.blanks).some((v) => Boolean(v));
		default: return false;
	}
}
function scoreQuestion(input) {
	const maxPoints = Number(input.points) || 0;
	const unanswered = {
		isCorrect: false,
		pointsAwarded: 0,
		maxPoints
	};
	if (!isAnswered(input.type, input.answer)) return unanswered;
	switch (input.type) {
		case "SINGLE_CHOICE":
		case "TRUE_FALSE":
		case "YES_NO": {
			const correct = input.payload.correctOptionIds ?? [];
			const chosen = asOptionId(input.answer);
			const ok = Boolean(chosen && correct.length === 1 && correct[0] === chosen);
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints
			};
		}
		case "IMAGE_CHOICE": {
			const ok = sameSet([...input.payload.correctOptionIds ?? []].sort(), asOptionIds(input.answer).sort());
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints
			};
		}
		case "MULTIPLE_CHOICE": {
			const ok = sameSet(input.payload.correctOptionIds ?? [], asOptionIds(input.answer));
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints
			};
		}
		case "MATCHING": {
			const pairs = input.payload.pairs ?? [];
			const given = input.answer && "pairs" in input.answer ? input.answer.pairs : {};
			let right = 0;
			for (const pair of pairs) if (given[pair.sourceId] === pair.targetId) right += 1;
			const all = pairs.length;
			if (all === 0) return unanswered;
			if (input.scoringMode === "proportional") {
				const pts = right / all * maxPoints;
				return {
					isCorrect: right === all,
					pointsAwarded: Math.round(pts * 100) / 100,
					maxPoints,
					detail: {
						right,
						all
					}
				};
			}
			const ok = right === all;
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints,
				detail: {
					right,
					all
				}
			};
		}
		case "ORDERING": {
			const items = [...input.payload.orderItems ?? []].sort((a, b) => a.correctPosition - b.correctPosition);
			const given = input.answer && "itemIds" in input.answer ? input.answer.itemIds : [];
			if (items.length === 0) return unanswered;
			let right = 0;
			items.forEach((item, i) => {
				if (given[i] === item.id) right += 1;
			});
			if (input.scoringMode === "proportional") {
				const pts = right / items.length * maxPoints;
				return {
					isCorrect: right === items.length,
					pointsAwarded: Math.round(pts * 100) / 100,
					maxPoints,
					detail: {
						right,
						all: items.length
					}
				};
			}
			const ok = right === items.length;
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints,
				detail: {
					right,
					all: items.length
				}
			};
		}
		case "DROPDOWN": {
			const blanks = input.payload.blanks ?? [];
			const given = input.answer && "blanks" in input.answer ? input.answer.blanks : {};
			if (blanks.length === 0) return unanswered;
			let right = 0;
			for (const blank of blanks) if ((given[blank.id] ?? "") === blank.correct) right += 1;
			if (input.scoringMode === "per_blank" || input.scoringMode === "proportional") {
				const pts = right / blanks.length * maxPoints;
				return {
					isCorrect: right === blanks.length,
					pointsAwarded: Math.round(pts * 100) / 100,
					maxPoints,
					detail: {
						right,
						all: blanks.length
					}
				};
			}
			const ok = right === blanks.length;
			return {
				isCorrect: ok,
				pointsAwarded: ok ? maxPoints : 0,
				maxPoints,
				detail: {
					right,
					all: blanks.length
				}
			};
		}
		default: return unanswered;
	}
}
function stripAnswerKey(type, payload) {
	switch (type) {
		case "SINGLE_CHOICE":
		case "MULTIPLE_CHOICE":
		case "TRUE_FALSE":
		case "YES_NO":
		case "IMAGE_CHOICE": return { options: (payload.options ?? []).map((o) => ({
			id: o.id,
			text: o.text,
			imageUrl: o.imageUrl,
			alt: o.alt
		})) };
		case "MATCHING": return {
			sources: payload.sources ?? [],
			targets: payload.targets ?? []
		};
		case "ORDERING": return { orderItems: (payload.orderItems ?? []).map((i) => ({
			id: i.id,
			text: i.text
		})) };
		case "DROPDOWN": return { blanks: (payload.blanks ?? []).map((b) => ({
			id: b.id,
			prompt: b.prompt,
			choices: b.choices
		})) };
		default: return {};
	}
}
function formatAnswer(type, payload, answer) {
	if (!answer) return "No answer";
	const options = payload.options ?? [];
	const label = (id) => options.find((o) => o.id === id)?.text ?? id;
	if ("optionId" in answer) return answer.optionId ? label(answer.optionId) : "No answer";
	if ("optionIds" in answer) return answer.optionIds.length ? answer.optionIds.map(label).join("; ") : "No answer";
	if ("pairs" in answer) {
		const sources = payload.sources ?? [];
		const targets = payload.targets ?? [];
		return Object.entries(answer.pairs).map(([s, t]) => {
			return `${sources.find((x) => x.id === s)?.text ?? s} → ${targets.find((x) => x.id === t)?.text ?? t}`;
		}).join("; ");
	}
	if ("itemIds" in answer) {
		const items = payload.orderItems ?? [];
		return answer.itemIds.map((id, i) => `${i + 1}. ${items.find((x) => x.id === id)?.text ?? id}`).join(" ");
	}
	if ("blanks" in answer) return (payload.blanks ?? []).map((b) => `${b.prompt}: ${answer.blanks[b.id] || "—"}`).join("; ");
	return "No answer";
}
function formatCorrectAnswer(type, payload) {
	const options = payload.options ?? [];
	const label = (id) => options.find((o) => o.id === id)?.text ?? id;
	switch (type) {
		case "SINGLE_CHOICE":
		case "TRUE_FALSE":
		case "YES_NO":
		case "IMAGE_CHOICE":
		case "MULTIPLE_CHOICE": return (payload.correctOptionIds ?? []).map(label).join("; ");
		case "MATCHING": return (payload.pairs ?? []).map((p) => {
			return `${payload.sources?.find((x) => x.id === p.sourceId)?.text ?? p.sourceId} → ${payload.targets?.find((x) => x.id === p.targetId)?.text ?? p.targetId}`;
		}).join("; ");
		case "ORDERING": return [...payload.orderItems ?? []].sort((a, b) => a.correctPosition - b.correctPosition).map((i, idx) => `${idx + 1}. ${i.text}`).join(" ");
		case "DROPDOWN": return (payload.blanks ?? []).map((b) => `${b.prompt}: ${b.correct}`).join("; ");
		default: return "";
	}
}
//#endregion
export { stripAnswerKey as a, scoreQuestion as i, formatCorrectAnswer as n, isAnswered as r, formatAnswer as t };
