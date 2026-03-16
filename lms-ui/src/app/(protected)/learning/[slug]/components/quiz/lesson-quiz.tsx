"use client";

import React, { useState, useEffect } from "react";
import QuizOverview from "./quiz-overview";
import QuizHistoryTable from "./quiz-history-table";
import QuizTaking from "./quiz-taking";
import { useQuizAttempts, useQuizStatus, useStartQuizAttempt } from "@/hooks/use-quiz";
import { ILesson } from "@/types/lesson";
import Loader from "@/components/loader";

type QuizState = "overview" | "taking";

interface LessonQuizProps {
  lesson: ILesson;
}

const LessonQuiz = ({ lesson }: LessonQuizProps) => {
  const [quizState, setQuizState] = useState<QuizState>("overview");
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

  // Lấy ID quiz từ tài nguyên bài học
  const quizId = lesson.resourceId || lesson.resource?._id || "";

  // Kiểm tra trạng thái quiz để xác định màn hình ban đầu
  const { data: quizStatus, isLoading: isStatusLoading } = useQuizStatus(quizId);

  // Lấy lịch sử lần làm bài theo quiz ID
  const { data: attemptsData, isLoading: isAttemptsLoading, refetch: refetchAttempts } = useQuizAttempts(quizId);

  const attempts = attemptsData?.attempts || [];
  const summary = attemptsData?.summary;

  // Mutation cho phiên làm quiz
  const startQuizAttempt = useStartQuizAttempt();

  // Thiết lập trạng thái ban đầu theo trạng thái quiz
  useEffect(() => {
    if (quizStatus && !isStatusLoading) {
      if (quizStatus.canContinue && quizStatus.attemptId) {
        setCurrentAttemptId(quizStatus.attemptId);
        setQuizState("taking");
      } else {
        setCurrentAttemptId(null);
        setQuizState("overview");
      }
    }
  }, [quizStatus, isStatusLoading]);

  const handleStartQuiz = async () => {
    const attempt = await startQuizAttempt.mutateAsync(quizId);
    setCurrentAttemptId(attempt._id);
    setQuizState("taking");
  };

  const handleExitQuiz = () => {
    setCurrentAttemptId(null);
    setQuizState("overview");
  };

  const handleQuizSuccess = () => {
    // Xóa attempt ID sau khi nộp thành công
    setCurrentAttemptId(null);
    // Quay lại màn tổng quan để xem kết quả mới
    setQuizState("overview");
    // Tải lại lịch sử để cập nhật bảng
    refetchAttempts();
  };

  const handleViewDetails = (attemptId: string) => {
    console.log("Xem chi tiết lần làm:", attemptId);
    // TODO: triển khai màn xem chi tiết lần làm
  };

  // Kiểm tra bài học có tài nguyên quiz hay không
  if (!lesson.resource) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <div className="mb-2 text-base text-muted-foreground sm:text-lg">Bài học này chưa có quiz</div>
        </div>
      </div>
    );
  }

  // Hiển thị loading khi đang kiểm tra trạng thái quiz
  if (isStatusLoading) {
    return <Loader />;
  }

  // Màn làm quiz
  if (quizState === "taking") {
    return (
      <QuizTaking
        quizId={quizId}
        attemptId={currentAttemptId}
        quizTitle={lesson.title}
        timeLimit={lesson.resource?.duration}
        startedAt={quizStatus?.startedAt}
        onSuccess={handleQuizSuccess}
        onExit={handleExitQuiz}
      />
    );
  }

  // Màn tổng quan mặc định
  return (
    <div className="w-full h-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Card tổng hợp phần tổng quan và lịch sử */}
        <div className="overflow-hidden rounded-xs border border-primary/15 bg-background shadow-md sm:shadow-lg">
          {/* Phần tổng quan quiz */}
          <div className="border-b border-primary/10">
            <QuizOverview
              lesson={lesson}
              attempts={attempts}
              summary={summary}
              quizStatus={quizStatus}
              onStartQuiz={handleStartQuiz}
            />
          </div>

          {/* Phần lịch sử làm quiz */}
          <div className="p-4 sm:p-6">
            <QuizHistoryTable
              attempts={attempts}
              summary={summary}
              isLoading={isAttemptsLoading}
              passingScore={lesson.resource?.passingScorePercentage}
              onRefresh={refetchAttempts}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonQuiz;
