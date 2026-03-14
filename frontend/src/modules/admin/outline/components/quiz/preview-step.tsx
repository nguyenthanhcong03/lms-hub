import { QuizType } from "@/shared/constants/enums";
import { QuestionSchema, QuizInfoSchema } from "@/utils/validation";
import { Tooltip } from "@heroui/react";
import React from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { FaCircleCheck, FaCircleHalfStroke } from "react-icons/fa6";

type QuizPreviewProps = {
  quizInfo: QuizInfoSchema | null;
  questions: QuestionSchema[];
};

const PreviewStep = ({ quizInfo, questions }: QuizPreviewProps) => {
  const renderType = (type: QuizType) => {
    switch (type) {
      case QuizType.SINGLE_CHOICE:
        return (
          <Tooltip content="Chọn một đáp án">
            <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-green-500 text-white">
              <FaCheck />
            </div>
          </Tooltip>
        );
      case QuizType.MULTIPLE_CHOICE:
        return (
          <Tooltip content="Chọn nhiều đáp án">
            <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-purple-500 text-white">
              <FaCheckDouble />
            </div>
          </Tooltip>
        );
      case QuizType.TRUE_FALSE:
        return (
          <Tooltip content="Đúng/Sai">
            <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-blue-500 text-white">
              <FaCircleHalfStroke />
            </div>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-8 shadow-md">
      {/* Header */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-bold text-gray-800">{quizInfo?.title}</h3>
        <p className="mt-1 text-gray-600">{quizInfo?.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-500">
          <p>
            <span className="font-semibold">Thời gian:</span>{" "}
            {quizInfo?.duration}
          </p>
          <p>
            <span className="font-semibold">Giới hạn:</span> {quizInfo?.limit}
          </p>
          <p>
            <span className="font-semibold">Điểm đạt yêu cầu:</span>{" "}
            {quizInfo?.passing_grade}%
          </p>
        </div>
      </div>

      {/* Questions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Câu hỏi</h2>
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-gray-50 p-5 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-medium text-gray-700">
                  {idx + 1}. {q.question}
                </h3>
                <div className="flex flex-shrink-0 items-center gap-1 text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <span>Loại:</span> {renderType(q.type)}
                  </div>{" "}
                  &nbsp;|&nbsp;
                  <span>Điểm: {q.point}</span> &nbsp;|&nbsp;
                  <span>Yêu cầu: {q.required ? "Yes" : "No"}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`pl-4 ${
                      opt.is_correct
                        ? "font-semibold text-green-500"
                        : "border-transparent text-gray-700"
                    }`}
                  >
                    {opt.text}{" "}
                    {opt.is_correct && (
                      <span className="ml-1 inline-block text-sm">
                        <FaCircleCheck />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
