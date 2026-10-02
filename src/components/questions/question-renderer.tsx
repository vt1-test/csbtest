import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { SingleChoiceQuestion } from "./single-choice";
import { MultiChoiceQuestion } from "./multi-choice";
import { TrueFalseQuestion } from "./true-false";
import { YesNoQuestion } from "./yes-no";
import { MatchingQuestion } from "./matching";
import { OrderingQuestion } from "./ordering";
import { DropdownQuestion } from "./dropdown";
import { ImageChoiceQuestion } from "./image-choice";

export function QuestionRenderer({
  question,
  value,
  onChange,
  disabled,
  reveal,
}: {
  question: ExamQuestion;
  value: AnswerValue | null;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
  reveal?: { correct: boolean; correctAnswer: string } | null;
}) {
  switch (question.type) {
    case "SINGLE_CHOICE":
      return (
        <SingleChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
          reveal={reveal}
        />
      );
    case "TRUE_FALSE":
      return (
        <TrueFalseQuestion
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
          reveal={reveal}
        />
      );
    case "YES_NO":
      return (
        <YesNoQuestion
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
          reveal={reveal}
        />
      );
    case "MULTIPLE_CHOICE":
      return (
        <MultiChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
          reveal={reveal}
        />
      );
    case "MATCHING":
      return <MatchingQuestion question={question} value={value} onChange={onChange} disabled={disabled} />;
    case "ORDERING":
      return <OrderingQuestion question={question} value={value} onChange={onChange} disabled={disabled} />;
    case "DROPDOWN":
      return <DropdownQuestion question={question} value={value} onChange={onChange} disabled={disabled} />;
    case "IMAGE_CHOICE":
      return (
        <ImageChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
          reveal={reveal}
        />
      );
    default:
      return <p className="text-sm text-danger">Unsupported question type.</p>;
  }
}
