import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminDeleteQuestion, adminGetQuestion, adminSaveQuestion } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUESTION_TYPES, type QuestionPayload, type QuestionType } from "@/lib/types";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import { stripAnswerKey } from "@/lib/scoring";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { nid } from "@/lib/utils";

export const Route = createFileRoute("/admin/questions/$id")({ component: QuestionEditor });

function QuestionEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const data = useQuery({ queryKey: ["admin-q", id], queryFn: () => adminGetQuestion({ data: { id } }) });
  const [stem, setStem] = useState("");
  const [instruction, setInstruction] = useState("");
  const [explanation, setExplanation] = useState("");
  const [type, setType] = useState<QuestionType>("SINGLE_CHOICE");
  const [payload, setPayload] = useState<QuestionPayload>({});
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [needsReview, setNeedsReview] = useState(false);

  useEffect(() => {
    if (!data.data) return;
    setStem(data.data.stem);
    setInstruction(data.data.instruction);
    setExplanation(data.data.explanation);
    setType(data.data.type);
    setPayload(data.data.payload);
    setStatus(data.data.status);
    setNeedsReview(data.data.needsReview);
  }, [data.data]);

  const save = useMutation({
    mutationFn: () =>
      adminSaveQuestion({
        data: {
          id,
          quizId: data.data!.quizId,
          type,
          stem,
          instruction,
          explanation,
          payload,
          status,
          needsReview,
        },
      }),
    onSuccess: () => {
      toast.success("Question saved");
      void qc.invalidateQueries({ queryKey: ["admin-q", id] });
    },
  });

  if (!data.data) return <p className="text-sm text-muted">Loading question…</p>;

  const exam = {
    id,
    type,
    stem,
    instruction,
    points: 1,
    requiredAnswers: data.data.requiredAnswers,
    ...stripAnswerKey(type, payload),
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl font-semibold">Question editor</h1>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <select className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm" value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
            {QUESTION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Stem</Label>
          <Textarea value={stem} onChange={(e) => setStem(e.target.value)} className="min-h-40" />
        </div>
        <div className="space-y-1.5">
          <Label>Instruction</Label>
          <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} />
        </div>
        <PayloadEditor type={type} payload={payload} onChange={setPayload} />
        <div className="space-y-1.5">
          <Label>Explanation</Label>
          <Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={needsReview} onChange={(e) => setNeedsReview(e.target.checked)} />
          Needs review
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            Save
          </Button>
          <Button variant="outline" onClick={() => { setStatus("draft"); save.mutate(); }}>
            Save draft
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              void adminDeleteQuestion({ data: { id } }).then(() => {
                toast.success("Deleted");
              })
            }
          >
            Delete
          </Button>
        </div>
      </div>
      <div>
        <h2 className="font-serif text-lg">Preview as student</h2>
        <p className="mb-3 text-xs text-muted">This preview does not create a real attempt.</p>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-medium text-secondary">{instruction}</p>
          <p className="mb-4 whitespace-pre-wrap font-serif">{stem}</p>
          <QuestionRenderer question={exam} value={null} onChange={() => undefined} />
        </div>
        <p className="mt-4 text-sm">
          <Link to="/admin/quizzes/$id" params={{ id: data.data.quizId }} className="text-secondary">
            Back to quiz
          </Link>
        </p>
      </div>
    </div>
  );
}

function PayloadEditor({
  type,
  payload,
  onChange,
}: {
  type: QuestionType;
  payload: QuestionPayload;
  onChange: (p: QuestionPayload) => void;
}) {
  if (["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE", "YES_NO", "IMAGE_CHOICE"].includes(type)) {
    const options = payload.options ?? [];
    const correct = new Set(payload.correctOptionIds ?? []);
    return (
      <div className="space-y-2">
        <Label>Options</Label>
        {options.map((opt, i) => (
          <div key={opt.id} className="flex gap-2">
            <input
              type={type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
              checked={correct.has(opt.id)}
              onChange={() => {
                const next = type === "MULTIPLE_CHOICE"
                  ? (correct.has(opt.id) ? [...correct].filter((id) => id !== opt.id) : [...correct, opt.id])
                  : [opt.id];
                onChange({ ...payload, correctOptionIds: next });
              }}
            />
            <Input
              value={opt.text}
              onChange={(e) => {
                const next = options.slice();
                next[i] = { ...opt, text: e.target.value };
                onChange({ ...payload, options: next });
              }}
            />
            {type === "IMAGE_CHOICE" ? (
              <Input
                placeholder="Image URL"
                value={opt.imageUrl ?? ""}
                onChange={(e) => {
                  const next = options.slice();
                  next[i] = { ...opt, imageUrl: e.target.value };
                  onChange({ ...payload, options: next });
                }}
              />
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange({ ...payload, options: [...options, { id: nid("opt").slice(-6), text: "New option" }] })}
        >
          Add option
        </Button>
      </div>
    );
  }
  if (type === "MATCHING") {
    const sources = payload.sources ?? [];
    const targets = payload.targets ?? [];
    const pairs = payload.pairs ?? [];
    return (
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Sources</Label>
            {sources.map((s, i) => (
              <Input
                key={s.id}
                className="mt-2"
                value={s.text}
                onChange={(e) => {
                  const next = sources.slice();
                  next[i] = { ...s, text: e.target.value };
                  onChange({ ...payload, sources: next });
                }}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                onChange({ ...payload, sources: [...sources, { id: nid("s").slice(-6), text: "New source" }] })
              }
            >
              Add source
            </Button>
          </div>
          <div>
            <Label>Targets</Label>
            {targets.map((s, i) => (
              <Input
                key={s.id}
                className="mt-2"
                value={s.text}
                onChange={(e) => {
                  const next = targets.slice();
                  next[i] = { ...s, text: e.target.value };
                  onChange({ ...payload, targets: next });
                }}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                onChange({ ...payload, targets: [...targets, { id: nid("t").slice(-6), text: "New target" }] })
              }
            >
              Add target
            </Button>
          </div>
        </div>
        <div>
          <Label>Correct pairs</Label>
          {sources.map((s) => (
            <label key={s.id} className="mt-2 flex items-center gap-2 text-sm">
              <span className="w-40 truncate">{s.text}</span>
              <select
                className="h-11 flex-1 rounded-md border border-border bg-card px-3"
                value={pairs.find((p) => p.sourceId === s.id)?.targetId ?? ""}
                onChange={(e) => {
                  const next = pairs.filter((p) => p.sourceId !== s.id);
                  if (e.target.value) next.push({ sourceId: s.id, targetId: e.target.value });
                  onChange({ ...payload, pairs: next });
                }}
              >
                <option value="">Unmatched</option>
                {targets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.text}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
    );
  }
  if (type === "ORDERING") {
    const orderItems = payload.orderItems ?? [];
    return (
      <div>
        <Label>Correct sequence</Label>
        {orderItems.map((item, i) => (
          <Input
            key={item.id}
            className="mt-2"
            value={item.text}
            onChange={(e) => {
              const next = orderItems.slice();
              next[i] = { ...item, text: e.target.value };
              onChange({ ...payload, orderItems: next });
            }}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            onChange({
              ...payload,
              orderItems: [
                ...orderItems,
                { id: nid("o").slice(-6), text: "New item", correctPosition: orderItems.length + 1 },
              ],
            })
          }
        >
          Add item
        </Button>
      </div>
    );
  }
  if (type === "DROPDOWN") {
    const blanks = payload.blanks ?? [];
    return (
      <div className="space-y-3">
        {blanks.map((b, i) => (
          <div key={b.id} className="rounded-md border border-border p-3">
            <Input
              value={b.prompt}
              onChange={(e) => {
                const next = blanks.slice();
                next[i] = { ...b, prompt: e.target.value };
                onChange({ ...payload, blanks: next });
              }}
            />
            <Input
              className="mt-2"
              value={b.choices.join(" | ")}
              onChange={(e) => {
                const next = blanks.slice();
                next[i] = { ...b, choices: e.target.value.split("|").map((x) => x.trim()).filter(Boolean) };
                onChange({ ...payload, blanks: next });
              }}
            />
            <Input
              className="mt-2"
              value={b.correct}
              onChange={(e) => {
                const next = blanks.slice();
                next[i] = { ...b, correct: e.target.value };
                onChange({ ...payload, blanks: next });
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              ...payload,
              blanks: [...blanks, { id: nid("b").slice(-6), prompt: "New blank", choices: ["A", "B"], correct: "A" }],
            })
          }
        >
          Add blank
        </Button>
      </div>
    );
  }
  return null;
}
