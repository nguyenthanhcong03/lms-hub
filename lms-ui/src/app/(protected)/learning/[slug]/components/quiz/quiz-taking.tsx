"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MdAccessTime, MdArrowBack, MdFlag } from "react-icons/md";
import { QuizAnswerSubmission } from "@/types/quiz";
import { useQuizTakingQuestions, useSubmitQuizAttempt } from "@/hooks/use-quiz";
import Loader from "@/components/loader";

interface QuizTakingProps {
  quizId: string;
  attemptId?: string | null;
  quizTitle?: string;
  timeLimit?: number; // Tính bằng giây - tổng thời gian làm bài
  startedAt?: string; // Chuỗi ISO - thời điểm bắt đầu làm bài
  onSuccess: () => void;
  onExit?: () => void;
}

// Thành phần làm bài quiz
const QuizTaking = ({
  quizId,
  attemptId,
  quizTitle = "Bài kiểm tra",
  timeLimit = 0,
  startedAt,
  onSuccess,
  onExit,
}: QuizTakingProps) => {
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Quản lý trạng thái nộp bài
  const [submissionState, setSubmissionState] = useState<{
    isSubmitting: boolean;
    hasSubmitted: boolean;
    submissionError: string | null;
    autoSubmitAttempted: boolean;
  }>({
    isSubmitting: false,
    hasSubmitted: false,
    submissionError: null,
    autoSubmitAttempted: false,
  });

  // Dùng ref để tránh nộp nhiều lần và quản lý bộ đếm thời gian
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submissionAttemptedRef = useRef(false);
  const isComponentMountedRef = useRef(true);

  // Lấy danh sách câu hỏi
  const { data: questions = [], isLoading: isQuestionsLoading, error: questionsError } = useQuizTakingQuestions(quizId);

  // Mutation nộp bài
  const submitQuizAttempt = useSubmitQuizAttempt();

  // Chuyển đáp án sang định dạng backend
  const formatAnswersForBackend = useCallback((answersMap: Record<string, number[]>): QuizAnswerSubmission[] => {
    return Object.entries(answersMap).map(([questionId, selectedOptionIndexes]) => ({
      questionId,
      selectedOptionIndexes,
    }));
  }, []);

  // Hàm dọn timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Xử lý nộp bài lên API
  const handleQuizSubmission = useCallback(
    async (submissionAnswers: Record<string, number[]>, isAutoSubmit = false) => {
      // Ngăn nộp bài nhiều lần
      if (submissionAttemptedRef.current || submissionState.hasSubmitted) {
        return;
      }

      if (!attemptId) {
        if (isComponentMountedRef.current) {
          setSubmissionState((prev) => ({
            ...prev,
            submissionError: "Không tìm thấy mã lượt làm bài hợp lệ",
          }));
        }
        return;
      }

      // Đánh dấu đã nộp và dừng timer
      submissionAttemptedRef.current = true;
      clearTimer();

      // Cập nhật trạng thái nộp bài
      if (isComponentMountedRef.current) {
        setSubmissionState((prev) => ({
          ...prev,
          isSubmitting: true,
          submissionError: null,
          autoSubmitAttempted: isAutoSubmit,
        }));
      }

      // Chuẩn hóa đáp án để gửi backend
      const formattedAnswers = formatAnswersForBackend(submissionAnswers);

      // Gửi bài kiểm tra kèm xử lý lỗi
      submitQuizAttempt.mutate(
        {
          attemptId,
          answers: formattedAnswers,
        },
        {
          onSuccess: () => {
            if (isComponentMountedRef.current) {
              setSubmissionState((prev) => ({
                ...prev,
                isSubmitting: false,
                hasSubmitted: true,
                submissionError: null,
              }));
            }

            if (onSuccess) {
              onSuccess();
            }
          },
          onError: () => {
            if (isComponentMountedRef.current) {
              setSubmissionState((prev) => ({
                ...prev,
                isSubmitting: false,
                submissionError: isAutoSubmit
                  ? "Nộp tự động thất bại khi hết giờ. Vui lòng tải lại trang."
                  : "Nộp bài thất bại. Vui lòng thử lại.",
              }));
            }

            // Cho phép thử lại với nộp tay, tránh lặp khi tự nộp
            if (!isAutoSubmit) {
              submissionAttemptedRef.current = false;
            }
          },
        },
      );
    },
    [attemptId, submitQuizAttempt, formatAnswersForBackend, onSuccess, clearTimer, submissionState.hasSubmitted],
  );

  // Tính thời gian còn lại ban đầu theo thời điểm bắt đầu
  const calculateRemainingTime = useCallback(() => {
    if (!timeLimit || timeLimit <= 0) return 0;

    // Nếu bài đã bắt đầu thì trừ thời gian đã trôi qua
    if (startedAt) {
      const startTime = new Date(startedAt).getTime();
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsedSeconds);

      return remaining;
    }

    // Bài mới - dùng toàn bộ thời gian
    return timeLimit;
  }, [timeLimit, startedAt]);

  // Khởi tạo timer khi mount hoặc khi timeLimit/startedAt thay đổi
  useEffect(() => {
    // Bỏ qua nếu đã nộp hoặc đang nộp
    if (submissionState.hasSubmitted || submissionState.isSubmitting) return;

    const remaining = calculateRemainingTime();
    setTimeRemaining(remaining);

    // Nếu đã hết giờ khi tiếp tục bài cũ thì tự nộp một lần
    if (remaining <= 0 && startedAt && !submissionState.autoSubmitAttempted && !submissionAttemptedRef.current) {
      // Lấy đáp án hiện tại tại thời điểm tự nộp
      setAnswers((currentAnswers) => {
        handleQuizSubmission(currentAnswers, true);
        return currentAnswers;
      });
    }
  }, [
    calculateRemainingTime,
    startedAt,
    submissionState.hasSubmitted,
    submissionState.isSubmitting,
    submissionState.autoSubmitAttempted,
    handleQuizSubmission,
  ]);

  // Effect chạy timer độc lập và có cleanup
  useEffect(() => {
    // Không chạy timer nếu không giới hạn thời gian, đã nộp hoặc đang nộp
    if (timeLimit <= 0 || timeRemaining <= 0 || submissionState.hasSubmitted || submissionState.isSubmitting) {
      return;
    }

    // Xóa timer hiện có
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Hết giờ - chỉ tự nộp nếu chưa từng thử nộp
          if (!submissionAttemptedRef.current && isComponentMountedRef.current) {
            // Lấy đáp án hiện tại và nộp
            setAnswers((currentAnswers) => {
              handleQuizSubmission(currentAnswers, true);
              return currentAnswers;
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [
    timeLimit,
    timeRemaining,
    clearTimer,
    submissionState.hasSubmitted,
    submissionState.isSubmitting,
    handleQuizSubmission,
  ]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number, questionType: string) => {
    // Không cho đổi đáp án sau khi đã nộp
    if (submissionState.hasSubmitted) return;

    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      // Xử lý theo từng loại câu hỏi
      if (questionType === "multiple_choice") {
        // Nhiều lựa chọn - bật/tắt lựa chọn
        const newAnswers = currentAnswers.includes(optionIndex)
          ? currentAnswers.filter((index) => index !== optionIndex)
          : [...currentAnswers, optionIndex];

        return {
          ...prev,
          [questionId]: newAnswers,
        };
      } else {
        // Một lựa chọn - thay thế lựa chọn hiện tại
        return {
          ...prev,
          [questionId]: [optionIndex],
        };
      }
    });
  };

  const handleFlag = (questionId: string) => {
    // Không cho đánh dấu sau khi đã nộp
    if (submissionState.hasSubmitted) return;

    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    // Chặn nộp nếu đang nộp/đã nộp hoặc thiếu attemptId
    if (submissionState.isSubmitting || submissionState.hasSubmitted || !attemptId) return;

    // Kiểm tra có đáp án chưa
    const hasAnyAnswers = Object.values(answers).some((answerArray) => answerArray && answerArray.length > 0);

    if (!hasAnyAnswers) {
      const confirmSubmit = window.confirm("Bạn chưa trả lời câu nào. Bạn có chắc muốn nộp bài không?");
      if (!confirmSubmit) return;
    }

    // Nộp bài thủ công
    handleQuizSubmission(answers, false);
  };

  // Hàm thử nộp lại
  const handleRetrySubmission = () => {
    if (!submissionState.autoSubmitAttempted) {
      // Reset submission state for retry
      submissionAttemptedRef.current = false;
      setSubmissionState((prev) => ({
        ...prev,
        submissionError: null,
      }));
    }
  };

  // Trạng thái loading
  if (isQuestionsLoading) {
    return <Loader />;
  }

  // Trạng thái lỗi
  if (questionsError) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <div className="mb-2 text-base text-destructive sm:text-lg">Không thể tải câu hỏi</div>
          <Button variant="outline" onClick={onExit} className="h-9 sm:h-10 text-sm">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Trạng thái không có câu hỏi
  if (questions?.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <div className="mb-2 text-base text-muted-foreground sm:text-lg">Chưa có câu hỏi nào</div>
          <Button variant="outline" onClick={onExit} className="h-9 sm:h-10 text-sm">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Thanh thông báo lỗi nộp bài */}
      {submissionState.submissionError && (
        <div className="bg-red-50 flex justify-center border-b border-red-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full max-w-4xl">
            <div className="flex items-center space-x-2">
              <div className="text-red-600 text-xs sm:text-sm font-medium">{submissionState.submissionError}</div>
            </div>
            {!submissionState.autoSubmitAttempted && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetrySubmission}
                className="text-red-600 border-red-300 hover:bg-red-50 h-8 text-xs sm:text-sm w-full sm:w-auto"
              >
                Thử lại
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="w-full h-full flex flex-col lg:flex-row">
        {/* Khu vực làm bài chính */}
        <div className="flex-1 flex flex-col">
          {/* Tiêu đề */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Button variant="ghost" size="sm" onClick={onExit} className="h-8 sm:h-9 px-2 sm:px-3">
                <MdArrowBack className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Thoát</span>
              </Button>
              <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate flex-1">
                {quizTitle}
              </h1>
              {submissionState.hasSubmitted && (
                <Badge
                  variant="secondary"
                  className="bg-green-600 text-white shadow-sm text-[10px] sm:text-xs px-2 py-0.5"
                >
                  Đã nộp
                </Badge>
              )}
            </div>
          </div>

          {/* Danh sách câu hỏi */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto pb-24 lg:pb-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {questions?.map((question, questionIndex) => (
                <Card
                  key={question._id}
                  id={`question-${question._id}`}
                  className={`relative border ${
                    submissionState.hasSubmitted ? "border-gray-300 bg-gray-50" : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Question Number and Text */}
                      <div>
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 flex-wrap gap-y-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 px-2 py-0.5 text-[10px] text-primary sm:text-xs"
                          >
                            Câu {questionIndex + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlag(question._id || "")}
                            disabled={submissionState.hasSubmitted}
                            className={`h-7 w-7 sm:h-8 sm:w-8 p-0 ${
                              flaggedQuestions?.has(question._id || "")
                                ? "text-orange-600 bg-orange-50"
                                : "text-gray-400"
                            } ${submissionState.hasSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <MdFlag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          {answers[question._id || ""] && answers[question._id || ""].length > 0 && (
                            <Badge
                              variant="outline"
                              className="border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] text-primary sm:text-xs"
                            >
                              Đã trả lời
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                          <p className="text-sm sm:text-base md:text-lg text-gray-900 leading-relaxed flex-1">
                            {question.question}
                          </p>
                          {question.type === "multiple_choice" && (
                            <Badge
                              variant="secondary"
                              className="self-start border-primary/20 bg-primary/10 text-[10px] text-primary sm:text-xs"
                            >
                              Chọn nhiều đáp án
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Answer Options */}
                      <div className="space-y-1.5 sm:space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D
                          const questionAnswers = answers[question._id || ""] || [];
                          const isSelected = questionAnswers.includes(optionIndex);
                          const isMultipleChoice = question.type === "multiple_choice";

                          return (
                            <label
                              key={optionIndex}
                              className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border transition-all ${
                                submissionState.hasSubmitted ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                              } ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type={isMultipleChoice ? "checkbox" : "radio"}
                                name={`question-${question._id}`}
                                value={optionIndex}
                                checked={isSelected}
                                disabled={submissionState.hasSubmitted}
                                onChange={() => handleAnswerSelect(question._id || "", optionIndex, question.type)}
                                className="sr-only"
                              />
                              <div
                                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-all sm:h-4 sm:w-4 ${
                                  isMultipleChoice
                                    ? `rounded ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`
                                    : `rounded-full ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`
                                }`}
                              >
                                {isSelected && (
                                  <div
                                    className={`bg-white ${
                                      isMultipleChoice
                                        ? "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-sm"
                                        : "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                                    }`}
                                  />
                                )}
                              </div>
                              <span className="mr-2 shrink-0 text-xs font-medium text-gray-700 sm:mr-3 sm:text-sm">
                                {optionLabel}.
                              </span>
                              <span className="text-gray-900 text-xs sm:text-sm md:text-base flex-1">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Thanh bên desktop - ẩn trên mobile */}
        <div className="hidden flex-col border-l border-primary/15 bg-background lg:flex lg:w-80">
          <div className="border-b border-primary/15 bg-background p-4 sm:p-6">
            <div className="mb-3 flex items-center space-x-2 text-muted-foreground sm:mb-4">
              <div className="rounded-xs bg-primary/10 p-1.5 sm:p-2">
                <MdAccessTime className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">Thời gian còn lại:</span>
              <div
                className={`rounded-xs border px-2 py-0.5 sm:px-3 sm:py-1 ${
                  timeRemaining <= 60 && timeRemaining > 0
                    ? "bg-red-100 border-red-200"
                    : timeRemaining === 0 || submissionState.hasSubmitted
                      ? "border-primary/20 bg-primary/10"
                      : "border-primary/20 bg-primary/5"
                }`}
              >
                <span
                  className={`font-bold tracking-wider text-sm sm:text-base ${
                    timeRemaining <= 60 && timeRemaining > 0
                      ? "text-red-700"
                      : timeRemaining === 0 || submissionState.hasSubmitted
                        ? "text-gray-500"
                        : "text-gray-900"
                  }`}
                >
                  {timeRemaining === 0 || submissionState.hasSubmitted ? (
                    "HẾT GIỜ"
                  ) : (
                    <span className="text-lg sm:text-xl">{formatTime(timeRemaining)}</span>
                  )}
                </span>
              </div>
            </div>
            {submissionState.hasSubmitted ? (
              <div className="w-full rounded-xs border border-primary/25 bg-primary/10 py-3 text-center text-base font-semibold text-primary sm:py-4 sm:text-lg">
                ĐÃ NỘP
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submissionState.isSubmitting || timeRemaining === 0 || !attemptId}
                className={`w-full rounded-xs py-3 text-base font-semibold shadow-sm transition-all duration-200 sm:py-4 sm:text-lg ${
                  submissionState.isSubmitting || timeRemaining === 0 || !attemptId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-md"
                } text-white`}
              >
                {submissionState.isSubmitting ? "ĐANG NỘP..." : "NỘP BÀI"}
              </Button>
            )}
          </div>

          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {questions?.map((currentQuestion, index) => {
                const questionNum = index + 1;
                const isAnswered =
                  currentQuestion &&
                  answers[currentQuestion._id || ""] &&
                  answers[currentQuestion._id || ""].length > 0;
                const isFlagged = currentQuestion && flaggedQuestions?.has(currentQuestion._id || "");

                return (
                  <button
                    key={questionNum}
                    onClick={() => {
                      if (currentQuestion) {
                        const element = document.getElementById(`question-${currentQuestion._id}`);
                        element?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                    disabled={!currentQuestion}
                    className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium rounded border-2 transition-all ${
                      isAnswered
                        ? "border-green-500 bg-green-50 text-green-700"
                        : isFlagged
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : currentQuestion
                            ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {questionNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Thanh điều khiển mobile */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-primary/20 bg-background shadow-2xl lg:hidden">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
              <div className="flex min-w-0 flex-1 items-center space-x-1.5 text-muted-foreground sm:space-x-2">
                <div className="rounded-xs bg-primary/10 p-1 sm:p-1.5">
                  <MdAccessTime className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                </div>
                <span className="whitespace-nowrap text-[10px] font-medium text-muted-foreground sm:text-xs">Giờ:</span>
                <div
                  className={`px-1.5 sm:px-2 py-0.5 rounded border ${
                    timeRemaining <= 60 && timeRemaining > 0
                      ? "bg-red-100 border-red-200"
                      : timeRemaining === 0 || submissionState.hasSubmitted
                        ? "bg-gray-200 border-gray-300"
                        : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <span
                    className={`font-bold text-[10px] sm:text-xs ${
                      timeRemaining <= 60 && timeRemaining > 0
                        ? "text-red-700"
                        : timeRemaining === 0 || submissionState.hasSubmitted
                          ? "text-gray-500"
                          : "text-gray-900"
                    }`}
                  >
                    {timeRemaining === 0 || submissionState.hasSubmitted ? "HẾT" : formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              {submissionState.hasSubmitted ? (
                <div className="rounded-xs border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold text-primary sm:px-4 sm:py-2 sm:text-xs">
                  ĐÃ NỘP
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submissionState.isSubmitting || timeRemaining === 0 || !attemptId}
                  className={`h-auto rounded-xs px-3 py-1.5 text-[10px] font-semibold shadow-sm transition-all duration-200 sm:px-4 sm:py-2 sm:text-xs ${
                    submissionState.isSubmitting || timeRemaining === 0 || !attemptId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  } text-white`}
                >
                  {submissionState.isSubmitting ? "..." : "NỘP"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
