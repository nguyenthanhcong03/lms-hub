import { LabelStatus } from "@/shared/components/common/label-status";
import ModalNextUI from "@/shared/components/modal";
import { QuizType } from "@/shared/constants/enums";
import { getQuizAttemptDetails } from "@/shared/services/quiz-attempt";
import { Tooltip } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { FaCircleHalfStroke } from "react-icons/fa6";

type QuizAttemptModalProps = {
  isOpen: boolean;
  quizAttemptId: string;
  onOpenChange: (isOpen: boolean) => void;
};
interface Option {
  _id: string;
  text: string;
  is_correct: boolean;
}
const QuizAttemptModal = ({
  isOpen,
  quizAttemptId,
  onOpenChange,
}: QuizAttemptModalProps) => {
  const [quizAttempt, setQuizAttempt] = useState<{
    answers?: {
      selected_answers: string[];
      is_correct: boolean;
      question: {
        type: QuizType;
        question: string;
        options: { _id: string; text: string; is_correct: boolean }[];
      };
    }[];
  } | null>(null);

  const fetchQuizAttemptDetails = async () => {
    try {
      const res = await getQuizAttemptDetails(quizAttemptId);
      setQuizAttempt(res.data);
      return res.data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (quizAttemptId) {
      fetchQuizAttemptDetails();
    }
  }, [quizAttemptId]);

  const filterSelectedAnswer = (
    selectedAnswers: string[],
    options: Option[],
  ): string => {
    const selected = options.filter((option) => {
      return selectedAnswers.includes(option._id);
    });
    return selected.map((item) => item?.text).join(", ");
  };

  const renderType = (type: QuizType) => {
    switch (type) {
      case QuizType.SINGLE_CHOICE:
        return (
          <Tooltip content="Chọn một đáp án">
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-green-500 text-white">
              <FaCheck />
            </div>
          </Tooltip>
        );
      case QuizType.MULTIPLE_CHOICE:
        return (
          <Tooltip content="Chọn nhiều đáp án">
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-purple-500 text-white">
              <FaCheckDouble />
            </div>
          </Tooltip>
        );
      case QuizType.TRUE_FALSE:
        return (
          <Tooltip content="Đúng/Sai">
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-blue-500 text-white">
              <FaCircleHalfStroke />
            </div>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <ModalNextUI
      title={"Chi tiết bài kiểm tra"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={() => {}}
      size="5xl"
      isFooter={false}
    >
      {(quizAttempt?.answers?.length ?? 0 > 0) ? (
        <table className="mt-5 w-full table-auto border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-2">Thứ tự</th>
              <th className="border p-2">Loại</th>
              <th className="border p-2">Câu hỏi</th>
              <th className="border p-2">Đã đưa ra câu trả lời</th>
              <th className="border p-2">Câu trả lời đúng</th>
              <th className="border p-2">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {quizAttempt?.answers?.map((item, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  <div className="flex items-center justify-center">
                    {renderType(item?.question?.type)}
                  </div>
                </td>
                <td className="border p-2">{item?.question?.question}</td>
                <td className="border p-2">
                  {filterSelectedAnswer(
                    item?.selected_answers,
                    item?.question?.options,
                  )}
                </td>
                <td className="border p-2">
                  {item?.question?.options
                    ?.filter((it) => it.is_correct)
                    .map((it) => it.text)
                    .join(", ")}
                </td>
                <td className="border p-2">
                  <LabelStatus color={item?.is_correct ? "success" : "danger"}>
                    {item?.is_correct ? "Đúng" : "Sai"}
                  </LabelStatus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </ModalNextUI>
  );
};

export default QuizAttemptModal;
