"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuizAttempt } from "@/types/quiz";
import { secondsToDisplayTime } from "@/utils/format";
import { MdAccessTime, MdCancel, MdCheckCircle, MdQuiz, MdVisibility } from "react-icons/md";

interface QuizHistoryTableProps {
  attempts?: QuizAttempt[];
  summary?: {
    highestScore: number;
    averageScore: number;
    passedAttempts: number;
    totalAttempts: number;
  };
  isLoading?: boolean;
  passingScore?: number;
  onRefresh?: () => void;
  onViewDetails?: (attemptId: string) => void;
}

// Thành phần bảng lịch sử làm bài
const QuizHistoryTable = ({
  attempts = [],
  summary,
  isLoading = false,
  passingScore = 70, // eslint-disable-line @typescript-eslint/no-unused-vars
  onRefresh, // eslint-disable-line @typescript-eslint/no-unused-vars
  onViewDetails,
}: QuizHistoryTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusBadge = (status: QuizAttempt["status"], result: QuizAttempt["result"]) => {
    const isPassed = result === "pass";
    switch (status) {
      case "completed":
        return (
          <Badge
            variant={isPassed ? "default" : "destructive"}
            className={
              isPassed
                ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                : "bg-pink-500 hover:bg-pink-600 text-white border-pink-500"
            }
          >
            {isPassed ? (
              <>
                <MdCheckCircle className="h-3 w-3 mr-1" />
                Đạt
              </>
            ) : (
              <>
                <MdCancel className="h-3 w-3 mr-1" />
                Không đạt
              </>
            )}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500">
            <MdAccessTime className="h-3 w-3 mr-1" />
            Đang làm
          </Badge>
        );
      case "abandoned":
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-600">
            <MdCancel className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Lịch sử làm bài</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-xs text-muted-foreground sm:text-sm">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">Lịch sử làm bài</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-32 text-center px-4">
          <MdQuiz className="mb-2 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
          <div className="text-xs text-muted-foreground sm:text-sm">Bạn chưa làm bài kiểm tra này</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">Lịch sử làm bài</h3>
      </div>

      {/* Bảng - cuộn ngang trên mobile */}
      <div className="overflow-hidden rounded-xs border border-primary/15">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm">
                  Ngày làm
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Số câu
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Đúng
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Sai
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Điểm
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Thời gian
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Kết quả
                </TableHead>
                <TableHead className="whitespace-nowrap text-center text-xs font-medium text-muted-foreground sm:text-sm">
                  Chi tiết
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts
                .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
                .map((attempt) => (
                  <TableRow key={attempt._id} className="border-b border-primary/10 hover:bg-primary/5">
                    {/* Ngày làm */}
                    <TableCell className="whitespace-nowrap py-2 text-xs font-medium text-foreground sm:py-3 sm:text-sm">
                      {formatDate(attempt.startedAt)}
                    </TableCell>

                    {/* Số câu */}
                    <TableCell className="py-2 text-center text-xs text-muted-foreground sm:py-3 sm:text-sm">
                      {attempt.totalQuestions}
                    </TableCell>

                    {/* Số câu đúng */}
                    <TableCell className="py-2 text-center text-xs text-muted-foreground sm:py-3 sm:text-sm">
                      {attempt.correctAnswers}
                    </TableCell>

                    {/* Số câu sai */}
                    <TableCell className="py-2 text-center text-xs text-muted-foreground sm:py-3 sm:text-sm">
                      {attempt.wrongAnswers}
                    </TableCell>

                    {/* Điểm */}
                    <TableCell className="whitespace-nowrap py-2 text-center text-xs text-muted-foreground sm:py-3 sm:text-sm">
                      {attempt.earnedPoints} ({((attempt.earnedPoints / attempt.totalPoints) * 100).toFixed(2)}
                      %)
                    </TableCell>

                    {/* Thời gian hoàn thành */}
                    <TableCell className="whitespace-nowrap py-2 text-center text-xs text-muted-foreground sm:py-3 sm:text-sm">
                      {secondsToDisplayTime(attempt.duration)}
                    </TableCell>

                    {/* Kết quả */}
                    <TableCell className="text-center py-2 sm:py-3">
                      {getStatusBadge(attempt.status, attempt.result)}
                    </TableCell>

                    {/* Chi tiết */}
                    <TableCell className="text-center py-2 sm:py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 rounded-xs p-0 hover:bg-primary/10 sm:h-8 sm:w-8"
                        onClick={() => onViewDetails?.(attempt._id)}
                      >
                        <MdVisibility className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      {summary && summary.totalAttempts > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xs bg-primary/5 p-3 sm:mt-6 sm:gap-4 sm:p-4 md:gap-6">
          <div className="text-center">
            <div className="mb-0.5 text-xs text-muted-foreground sm:mb-1 sm:text-sm">Cao nhất:</div>
            <div className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
              {summary.highestScore.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-xs text-muted-foreground sm:mb-1 sm:text-sm">Trung bình:</div>
            <div className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
              {summary.averageScore.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-0.5 text-xs text-muted-foreground sm:mb-1 sm:text-sm">Đạt:</div>
            <div className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
              {summary.passedAttempts}/{summary.totalAttempts}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistoryTable;
