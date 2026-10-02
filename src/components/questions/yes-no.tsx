import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { SingleChoiceQuestion } from "./single-choice";

const DEFAULTS = [
  { id: "yes", text: "Yes" },
  { id: "no", text: "No" },
];

export function YesNoQuestion(props: {
  question: ExamQuestion;
  value: AnswerValue | null;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
  reveal?: { correct: boolean; correctAnswer: string } | null;
}) {
  const question = {
    ...props.question,
    options: props.question.options?.length ? props.question.options : DEFAULTS,
  };
  return <SingleChoiceQuestion {...props} question={question} />;
}
