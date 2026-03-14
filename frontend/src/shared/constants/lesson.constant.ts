import { QuizType } from "./enums";

export const quizTypeActions: {
  label: string;
  value: QuizType;
}[] = [
  {
    label: "True/False",
    value: QuizType.TRUE_FALSE,
  },
  {
    label: "Fill in the blanks",
    value: QuizType.FILL_IN_THE_BLANKS,
  },
  {
    label: "Single choice",
    value: QuizType.SINGLE_CHOICE,
  },
  {
    label: "Multiple choice",
    value: QuizType.MULTIPLE_CHOICE,
  },
];
