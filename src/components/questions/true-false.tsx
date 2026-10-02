import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { SingleChoiceQuestion } from "./single-choice";

const DEFAULTS = [
  { id: "true", text: "True" },
  { id: "false", text: "False" },
];

export function TrueFalseQuestion(props: {
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
