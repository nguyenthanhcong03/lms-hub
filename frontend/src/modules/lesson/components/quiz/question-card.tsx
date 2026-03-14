// QuestionCard.tsx
import { QuizType } from "@/shared/constants/enums";

interface Option {
  _id: string;
  text: string;
}

interface Question {
  _id: string;
  question: string;
  type: QuizType;
  options: Option[];
  point: number;
}

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  selected: string | string[];
  onAnswer: (qid: string, value: string | string[]) => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  selected,
  onAnswer,
}: QuestionCardProps) {
  const isMultiple = question?.type === QuizType.MULTIPLE_CHOICE;

  const handleChange = (value: string) => {
    if (isMultiple) {
      const prev = Array.isArray(selected) ? selected : [];
      if (prev.includes(value)) {
        onAnswer(
          question?._id,
          prev.filter((v) => v !== value),
        );
      } else {
        onAnswer(question?._id, [...prev, value]);
      }
    } else {
      onAnswer(question?._id, value);
    }
  };

  return (
    <div>
      <h3 className="mb-2 text-lg font-medium">
        {currentIndex + 1}. {question?.question}
      </h3>
      <p className="mb-2 text-sm font-medium text-gray-500">
        Điểm: {question?.point?.toFixed(2)}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {question?.options.map((option) => {
          const isSelected = isMultiple
            ? Array.isArray(selected) && selected.includes(option._id)
            : selected === option._id;

          return (
            <label
              key={option._id}
              className="cursor-pointer rounded border px-4 py-2 hover:bg-gray-100"
            >
              <input
                type={isMultiple ? "checkbox" : "radio"}
                name={`question-${question?._id}`}
                className="mr-2"
                value={option._id}
                checked={isSelected}
                onChange={() => handleChange(option._id)}
              />
              {option.text}
            </label>
          );
        })}
      </div>
    </div>
  );
}
