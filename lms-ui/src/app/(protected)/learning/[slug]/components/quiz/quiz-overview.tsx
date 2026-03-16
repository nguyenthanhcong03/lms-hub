"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  MdQuiz,
  MdPlayArrow,
  MdRestartAlt,
  MdAccessTime,
  MdQuestionAnswer,
  MdTrendingUp,
  MdRefresh,
} from "react-icons/md";
import { QuizAttempt, QuizSummary } from "@/types/quiz";
import { secondsToDisplayTime } from "@/utils/format";

interface LessonResource {
  _id?: string;
  title?: string;
  description?: string;
  url?: string;
  totalAttemptsAllowed?: number;
  passingScorePercentage?: number;
  totalQuestions?: number;
  duration?: number;
}

interface QuizOverviewProps {
  lesson?: {
    _id: string;
    title: string;
    resource?: LessonResource;
  };
  attempts?: QuizAttempt[];
  summary?: QuizSummary;
  quizStatus?: {
    canContinue: boolean;
    attemptId: string | null;
  };
  onStartQuiz?: () => void;
}

// Thành phần tổng quan quiz
const QuizOverview = ({ lesson, attempts = [], summary, quizStatus, onStartQuiz }: QuizOverviewProps) => {
  // Tách dữ liệu từ tài nguyên bài học
  const quizTitle = lesson?.title || "Bài kiểm tra";
  const description = lesson?.resource?.description || "Bài kiểm tra đánh giá kiến thức";
  const totalQuestions = lesson?.resource?.totalQuestions || 0;
  const timeLimit = lesson?.resource?.duration;
  const passingScore = lesson?.resource?.passingScorePercentage || 70;
  const maxAttempts = lesson?.resource?.totalAttemptsAllowed || 10;

  // Tính thống kê số lần làm
  const currentAttempts = summary?.totalAttempts || attempts.length;
  const hasStarted = currentAttempts > 0;
  const canRetake = currentAttempts < maxAttempts;

  // Kiểm tra có thể tiếp tục bài đang làm hay không
  const canContinue = quizStatus?.canContinue || false;
  const hasOngoingAttempt = canContinue && quizStatus?.attemptId;

  return (
    <div className="overflow-hidden">
      <div className="border-b border-primary/10 bg-primary/5 p-4 sm:p-6">
        {/* Tiêu đề phần */}
        <div className="mb-3 sm:mb-4">
          <h2 className="mb-2 text-lg font-bold text-foreground sm:text-xl">Bài kiểm tra</h2>
        </div>

        {/* Tên quiz kèm biểu tượng */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-primary/15 sm:h-12 sm:w-12">
              <MdQuiz className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h3 className="truncate text-lg font-bold text-foreground sm:text-xl md:text-2xl">{quizTitle}</h3>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Lưới thống kê quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-primary/10 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-primary/15 sm:h-10 sm:w-10">
                  <MdQuestionAnswer className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">Số câu hỏi:</span>
              </div>
              <span className="ml-2 shrink-0 text-base font-bold text-foreground sm:text-lg">{totalQuestions}</span>
            </div>

            <div className="flex items-center justify-between border-b border-primary/10 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-primary/10 sm:h-10 sm:w-10">
                  <MdAccessTime className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  Thời gian làm bài:
                </span>
              </div>
              <span className="ml-2 shrink-0 text-base font-bold text-foreground sm:text-lg">
                {secondsToDisplayTime(timeLimit)}
              </span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-primary/10 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-primary/12 sm:h-10 sm:w-10">
                  <MdRefresh className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">Số lần làm:</span>
              </div>
              <span className="ml-2 shrink-0 text-base font-bold text-foreground sm:text-lg">
                {currentAttempts}/{maxAttempts}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-primary/10 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs bg-primary/10 sm:h-10 sm:w-10">
                  <MdTrendingUp className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <span className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  Điểm đạt tối thiểu:
                </span>
              </div>
              <span className="ml-2 shrink-0 text-base font-bold text-foreground sm:text-lg">{passingScore}%</span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="border-t border-primary/10 pt-4 sm:pt-6">
          {/* Thông báo trạng thái */}
          {hasOngoingAttempt && (
            <div className="mb-3 rounded-xs border border-primary/25 bg-primary/10 p-3 text-center sm:mb-4 sm:p-4">
              <p className="text-xs font-medium text-primary sm:text-sm">
                Bạn đang có một bài kiểm tra dang dở. Hãy bấm &ldquo;Tiếp tục làm bài&rdquo; để hoàn thành.
              </p>
            </div>
          )}

          {currentAttempts >= maxAttempts && (
            <div className="mb-3 rounded-xs bg-muted p-3 text-center sm:mb-4 sm:p-4">
              <p className="text-xs font-medium italic text-muted-foreground sm:text-sm">
                Bạn đã dùng hết số lần làm bài
              </p>
            </div>
          )}

          {/* Hành động */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Nút hành động chính */}
            <div className="flex-1">
              {/* Tiếp tục lần làm dang dở */}
              {hasOngoingAttempt && (
                <Button
                  onClick={onStartQuiz}
                  className="h-10 w-full rounded-xs bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 sm:h-12 sm:px-6 sm:py-3 sm:text-base"
                >
                  <MdPlayArrow className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Tiếp tục làm bài
                </Button>
              )}

              {/* Bắt đầu bài mới */}
              {!hasOngoingAttempt && !hasStarted && currentAttempts === 0 && (
                <Button
                  onClick={onStartQuiz}
                  className="h-10 w-full rounded-xs bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 sm:h-12 sm:px-6 sm:py-3 sm:text-base"
                >
                  <MdPlayArrow className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Bắt đầu làm bài
                </Button>
              )}

              {/* Làm lại */}
              {!hasOngoingAttempt && hasStarted && canRetake && currentAttempts < maxAttempts && (
                <Button
                  onClick={onStartQuiz}
                  variant="outline"
                  className="h-10 w-full rounded-xs border-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/8 sm:h-12 sm:px-6 sm:py-3 sm:text-base"
                >
                  <MdRestartAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                  Làm lại
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOverview;
