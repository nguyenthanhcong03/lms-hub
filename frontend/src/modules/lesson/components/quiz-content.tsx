// QuizQuestion.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

import { getAllQuestionsByLesson } from "@/shared/services/question";
import {
  updateQuizAttempt,
  getQuizAttemptEndTime,
  createQuizAttempt,
} from "@/shared/services/quiz-attempt";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/common";
import { Lesson } from "@/shared/types/lesson";
import QuizStart from "./quiz/quiz-start";
import QuestionCard from "./quiz/question-card";
import { getAxiosErrorMessage } from "@/utils";
import Swal from "sweetalert2";

interface LessonContentProps {
  lessonInfo: Lesson;
  isExpanded: boolean;
  nextLesson: string | null;
}
const QuizContent = ({
  lessonInfo,
  isExpanded,
  nextLesson,
}: LessonContentProps) => {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const res = await getQuizAttemptEndTime({
          params: { quizId: lessonInfo.resource._id },
        });

        const endTime =
          new Date(res?.data?.end_time).getTime() || new Date().getTime();

        const remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining > 0) {
          setTimeLeft(remaining);
          setQuizAttemptId(res.data._id);
          setStarted(true);
          fetchQuestions(lessonInfo.resource._id);
        } else {
          setStarted(false);
        }
        setIsLoading(false);
      } catch {
        setStarted(false);
        setIsLoading(false);
      }
    };

    if (lessonInfo?.resource?._id) init();
  }, [lessonInfo?.resource?._id]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const fetchQuestions = async (quizId: string) => {
    const res = await getAllQuestionsByLesson({ params: { quiz: quizId } });
    setQuestions(res.data || []);
  };

  const handleConfirmSubmit = async () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn nộp bài không?",
      text: "Bạn sẽ không thể thay đổi câu trả lời sau khi nộp bài.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Nộp bài",
      cancelButtonText: "Thoát",
    })
      .then(async (orders) => {
        if (orders.isConfirmed) {
          await handleSubmit();

          toast.success("Quiz submitted successfully!");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to start quiz.");
      });
  };

  const handleStartQuiz = async () => {
    try {
      const res = await createQuizAttempt({ quizId: lessonInfo.resource._id });
      const endTime = new Date(res.data.end_time).getTime();
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      setTimeLeft(remaining);
      setQuizAttemptId(res.data._id);
      setStarted(true);
      setCurrentIndex(0);
      setAnswers({});
      setQuestions([]);
      fetchQuestions(lessonInfo.resource._id);
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Failed to start quiz.");
      toast.error(message);
    }
  };

  const handleAnswer = (qid: string, value: string | string[]) => {
    const updated = { ...answers, [qid]: value };
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!quizAttemptId) return;

    const payload = {
      id: quizAttemptId,
      answers: questions.map((q) => ({
        questionId: q._id,
        selected_answers: Array.isArray(answers[q._id])
          ? answers[q._id]
          : [answers[q._id]],
      })),
    };

    await updateQuizAttempt(payload);
    setStarted(false);
    setTimeLeft(0);
    setQuizAttemptId(null);
    setCurrentIndex(0);
    setAnswers({});
    setQuestions([]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (isLoading) return null;

  return (
    <div className={` ${isExpanded ? "px-[16%]" : "px-[8.5%]"} py-10`}>
      {started ? (
        <>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <p>
                <span className="text-gray-500"> Câu hỏi số:</span>
                <span className="font-medium">
                  {currentIndex + 1} / {questions.length}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Số câu hỏi đã chọn:</span>{" "}
                <span className="font-medium">
                  {Object.keys(answers).length}/{questions.length}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-gray-500">Thời gian còn lại:</div>
              <span
                className={`font-medium ${timeLeft <= 30 ? "text-red-500" : ""}`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <QuestionCard
            key={questions[currentIndex]?._id}
            currentIndex={currentIndex}
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            selected={answers[questions[currentIndex]?._id] || ""}
          />
          <div className="mt-4 flex justify-between">
            <Button
              type="button"
              className="bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-500 hover:bg-indigo-100 data-[hover=true]:!opacity-100"
              radius="full"
              onPress={handleBack}
              disabled={currentIndex === 0}
            >
              Back
            </Button>

            {currentIndex < questions.length - 1 ? (
              <Button
                type="button"
                className="bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={handleConfirmSubmit}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <QuizStart
          lessonInfo={lessonInfo}
          onStart={handleStartQuiz}
          nextLesson={nextLesson}
        />
      )}
    </div>
  );
};
export default QuizContent;
