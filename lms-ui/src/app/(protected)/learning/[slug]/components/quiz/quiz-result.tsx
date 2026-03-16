"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdArrowBack,
  MdTrendingUp,
  MdAccessTime,
  MdQuestionAnswer,
} from "react-icons/md";
import { secondsToDisplayTime } from "@/utils/format";

interface QuizResultProps {
  score: number; // phần trăm
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // tính bằng giây
  passingScore: number; // phần trăm
  isPassed: boolean;
  onRetry?: () => void;
  onBackToOverview?: () => void;
  onViewDetails?: () => void;
}

// Thành phần hiển thị kết quả quiz
const QuizResult = ({
  score,
  totalQuestions,
  correctAnswers,
  timeSpent,
  passingScore,
  isPassed,
  onRetry,
  onBackToOverview,
  onViewDetails,
}: QuizResultProps) => {
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Biểu tượng và trạng thái kết quả */}
            <div className="space-y-3 sm:space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xs sm:h-20 sm:w-20">
                {isPassed ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xs bg-primary/10 sm:h-20 sm:w-20">
                    <MdCheckCircle className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xs bg-destructive/10 sm:h-20 sm:w-20">
                    <MdCancel className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                  </div>
                )}
              </div>

              <div>
                <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                  {isPassed ? "Chúc mừng!" : "Chưa đạt yêu cầu"}
                </h1>
                <p className="px-2 text-sm text-muted-foreground sm:text-base md:text-lg">
                  {isPassed
                    ? "Bạn đã hoàn thành bài kiểm tra thành công"
                    : "Bạn cần đạt tối thiểu " + passingScore + "% để vượt qua bài kiểm tra"}
                </p>
              </div>

              {/* Hiển thị điểm */}
              <div className="space-y-2 sm:space-y-3">
                <Badge
                  variant={isPassed ? "default" : "destructive"}
                  className={`text-xl sm:text-2xl font-bold px-4 py-2 sm:px-6 sm:py-3 ${
                    isPassed ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {score.toFixed(1)}%
                </Badge>
                <div className="w-full max-w-md mx-auto px-2">
                  <Progress value={score} className="h-2 sm:h-3" />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="text-center font-medium">Yêu cầu: {passingScore}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-1 gap-3 border-t border-primary/10 py-4 sm:grid-cols-2 sm:gap-4 sm:py-6 md:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-xs bg-primary/5 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-primary/15 sm:h-8 sm:w-8">
                      <MdQuestionAnswer className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">Số câu đúng</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {correctAnswers}/{totalQuestions}
                  </p>
                </div>

                <div className="rounded-xs bg-primary/5 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MdCancel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">Số câu sai</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{incorrectAnswers}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-xs bg-primary/5 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-primary/15 sm:h-8 sm:w-8">
                      <MdAccessTime className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">Thời gian hoàn thành</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{secondsToDisplayTime(timeSpent)}</p>
                </div>

                <div className="rounded-xs bg-primary/5 p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-primary/15 sm:h-8 sm:w-8">
                      <MdTrendingUp className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">Điểm đạt được</span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {((score / 100) * totalQuestions).toFixed(1)}/{totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col gap-3 border-t border-primary/10 pt-4 sm:flex-row sm:gap-4 sm:pt-6">
              <Button variant="outline" onClick={onBackToOverview} className="flex-1 h-10 sm:h-11 text-sm">
                <MdArrowBack className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Quay lại tổng quan</span>
                <span className="sm:hidden">Quay lại</span>
              </Button>

              {onViewDetails && (
                <Button variant="outline" onClick={onViewDetails} className="flex-1 h-10 sm:h-11 text-sm">
                  Xem chi tiết
                </Button>
              )}

              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="h-10 flex-1 bg-primary text-primary-foreground hover:bg-primary/90 sm:h-11 text-sm"
                >
                  <MdRefresh className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Làm lại
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResult;
