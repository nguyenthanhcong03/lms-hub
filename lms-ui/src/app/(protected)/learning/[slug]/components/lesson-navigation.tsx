"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from "lucide-react";

interface NavigationLesson {
  _id: string;
}

interface LessonNavigationProps {
  courseSlug: string;
  previousLesson?: NavigationLesson;
  nextLesson?: NavigationLesson;
  currentChapterTitle?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// Thành phần điều hướng bài học
const LessonNavigation = ({
  courseSlug,
  previousLesson,
  nextLesson,
  currentChapterTitle = "Chương",
  isSidebarOpen,
  onToggleSidebar,
}: LessonNavigationProps) => {
  return (
    <div
      className={`fixed bottom-0 left-0 z-40 flex h-14 items-center border-t border-primary/15 bg-background px-3 shadow-sm sm:h-16 sm:px-4 md:px-6 transition-all duration-300 ${
        isSidebarOpen ? "lg:right-[23%] right-0" : "right-0"
      }`}
    >
      <div className="flex items-center justify-between w-full gap-2 sm:gap-3">
        {/* Khu vực trái - tên chương (ẩn trên mobile) */}
        <div className="hidden min-w-0 shrink-0 md:flex md:max-w-37.5 lg:max-w-50">
          <p className="truncate text-sm font-medium text-primary">{currentChapterTitle}</p>
        </div>

        {/* Khu vực giữa - các nút điều hướng */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 justify-center">
          {/* Nút bài trước */}
          {previousLesson ? (
            <Link href={`/learning/${courseSlug}?id=${previousLesson._id}`}>
              <Button
                variant="outline"
                className="flex h-9 items-center space-x-1 border-primary/25 px-2 py-1.5 text-primary transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-primary/8 hover:shadow-md hover:shadow-primary/15 active:scale-95 sm:h-10 sm:space-x-2 sm:px-3 sm:py-2 md:px-4"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="font-medium text-xs sm:text-sm hidden sm:inline">BÀI TRƯỚC</span>
                <span className="font-medium text-xs sm:hidden">TRƯỚC</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              disabled
              className="flex h-9 cursor-not-allowed items-center space-x-1 border-primary/10 px-2 py-1.5 text-primary/40 opacity-50 transition-all duration-300 sm:h-10 sm:space-x-2 sm:px-3 sm:py-2 md:px-4"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="font-medium text-xs sm:text-sm hidden sm:inline">BÀI TRƯỚC</span>
              <span className="font-medium text-xs sm:hidden">TRƯỚC</span>
            </Button>
          )}

          {/* Nút bài tiếp theo */}
          {nextLesson ? (
            <Link href={`/learning/${courseSlug}?id=${nextLesson._id}`}>
              <Button className="flex h-9 items-center justify-center space-x-1 bg-primary px-2 py-1.5 text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 active:scale-95 sm:h-10 sm:space-x-2 sm:px-3 sm:py-2 md:px-4">
                <span className="font-medium text-xs sm:text-sm">KẾ TIẾP</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="flex h-9 cursor-default items-center space-x-1 bg-primary/70 px-2 py-1.5 text-primary-foreground shadow-md transition-all duration-300 sm:h-10 sm:space-x-2 sm:px-3 sm:py-2 md:px-4"
            >
              <span className="font-medium text-xs sm:text-sm">HOÀN TẤT</span>
            </Button>
          )}
        </div>

        {/* Khu vực phải - nút bật/tắt thanh bên */}
        <div className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 rounded-xs p-1.5 transition-colors hover:bg-primary/10 sm:h-9 sm:w-9 sm:p-2"
            title={isSidebarOpen ? "Đóng mục lục" : "Mở mục lục"}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            ) : (
              <PanelRightOpen className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonNavigation;
