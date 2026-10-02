import JSZip from "jszip";
import type { SeedQuestion } from "@/lib/seed/demo-questions";
import type { QuestionType } from "@/lib/types";
import { nid } from "@/lib/utils";

export type ImportRecord = SeedQuestion & {
  status: "READY" | "NEEDS_REVIEW" | "UNSUPPORTED";
};

export type ImportReport = {
  detected: number;
  ready: number;
  needsReview: number;
  unsupported: number;
  duplicate: number;
  skipped: number;
};

function xmlToText(xml: string): string {
  let text = xml.replace(/<\/w:p>/g, "\n");
  text = text.replace(/<w:tab[^/]*\/>/g, "\t");
  text = text.replace(/<w:br[^/]*\/>/g, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/&#39;/g, "'");
  return text;
}

const ARTIFACT =
  /^(top of form|bottom of form|end of page|back|next|backnext|finish|your answer is correct!?|your answers|correct answers|mark for review|skip|explanation:?)$/i;

function cleanBlocks(raw: string): string[] {
  const pages = raw.split(/End of page/i);
  const out: string[] = [];
  for (const page of pages) {
    const lines = page
      .split(/\n/)
      .map((l) => l.replace(/\u00a0/g, " ").trim())
      .filter((l) => l && !ARTIFACT.test(l) && !/^Question\s+\d+\s+of\s+\d+/i.test(l));
    if (lines.length) out.push(lines.join("\n"));
  }
  return out;
}

function detectType(text: string): QuestionType | "UNSUPPORTED" {
  const lower = text.toLowerCase();
  if (/select the image|best example of the design principle/i.test(text)) return "IMAGE_CHOICE";
  if (/move all the components|place them in the correct order|move all of the communications/i.test(text))
    return "ORDERING";
  if (/matching situation|from the list on the left to the matching/i.test(text)) return "MATCHING";
  if (/drop-down list|complete each statement|for each skill, select|for each (scenario|method|question|statement|environmental factor|criticism)/i.test(
    text,
  ))
    return "DROPDOWN";
  if (/choose two|choose three|choose four/i.test(text)) return "MULTIPLE_CHOICE";
  if (/true or false/.test(lower) && /select whether each statement/.test(lower)) return "DROPDOWN";
  if (/^\s*true\b/im.test(text) && /^\s*false\b/im.test(text) && (text.match(/^[-•]/gm) ?? []).length <= 4)
    return "TRUE_FALSE";
  return "SINGLE_CHOICE";
}

function splitExplanation(text: string): { body: string; explanation: string } {
  const idx = text.search(/\nExplanation\s*:?/i);
  if (idx === -1) return { body: text.trim(), explanation: "" };
  return { body: text.slice(0, idx).trim(), explanation: text.slice(idx).replace(/^Explanation\s*:?/i, "").trim() };
}

function parseOptions(body: string): string[] {
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  const start = lines.findIndex((l) => /choose |what |which |how |select /i.test(l));
  const after = start >= 0 ? lines.slice(start + 1) : lines.slice(-8);
  return after.filter((l) => l.length > 2 && !/^explanation/i.test(l));
}

export async function parseDocxBuffer(buffer: ArrayBuffer, filename: string): Promise<{
  records: ImportRecord[];
  report: ImportReport;
  filename: string;
}> {
  const zip = await JSZip.loadAsync(buffer);
  const doc = zip.file("word/document.xml");
  if (!doc) {
    return {
      records: [],
      report: { detected: 0, ready: 0, needsReview: 0, unsupported: 1, duplicate: 0, skipped: 1 },
      filename,
    };
  }
  const xml = await doc.async("string");
  const text = xmlToText(xml);
  const blocks = cleanBlocks(text);
  const records: ImportRecord[] = [];
  const seen = new Set<string>();
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
    const record: ImportRecord = {
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
        options: parseOptions(body)
          .slice(0, 10)
          .map((text, i) => ({ id: String.fromCharCode(97 + i), text })),
        correctOptionIds: [],
      },
      status: "NEEDS_REVIEW",
    };
    if (type === "UNSUPPORTED") record.status = "UNSUPPORTED";
    else if (record.needsReview) record.status = "NEEDS_REVIEW";
    else record.status = "READY";
    records.push(record);
  }

  const report: ImportReport = {
    detected: records.length,
    ready: records.filter((r) => r.status === "READY").length,
    needsReview: records.filter((r) => r.status === "NEEDS_REVIEW").length,
    unsupported: records.filter((r) => r.status === "UNSUPPORTED").length,
    duplicate,
    skipped,
  };
  return { records, report, filename };
}
