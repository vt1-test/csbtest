import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DtDPPULZ.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid(prefix = "") {
	const id = crypto.randomUUID();
	return prefix ? `${prefix}_${id}` : id;
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
function formatDuration(totalSeconds) {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
	return `${m}:${String(sec).padStart(2, "0")}`;
}
function formatDateTime(value) {
	if (!value) return "—";
	const d = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function shuffle(items, rng = Math.random) {
	const next = items.slice();
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		[next[i], next[j]] = [next[j], next[i]];
	}
	return next;
}
function mulberry32(seed) {
	return () => {
		seed |= 0;
		seed = seed + 1831565813 | 0;
		let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hashString(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
//#endregion
export { mulberry32 as a, slugify as c, hashString as i, formatDateTime as n, nid as o, formatDuration as r, shuffle as s, cn as t };
