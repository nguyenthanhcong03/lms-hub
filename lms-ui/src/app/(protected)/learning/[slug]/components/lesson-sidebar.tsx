"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToggleTrack } from "@/hooks/use-track";
import { useAuthStore } from "@/stores/auth-store";
import { CourseTracksResponse } from "@/types/track";
import { secondsToDisplayTime } from "@/utils/format";
import { saveLastLessonForCourse } from "@/utils/last-course-lesson";
import { ChevronDown, HelpCircle, LucideFileText } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

interface SidebarLesson {
  _id: string;
  title: string;
  contentType: "video" | "quiz" | "article";
  duration?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface SidebarChapter {
  _id: string;
  title: string;
  lessons: SidebarLesson[];
  isCompleted?: boolean;
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  courseId: string; // ID khóa học dùng cho theo dõi tiến độ
  chapters: SidebarChapter[];
  currentLessonId?: string;
  trackingData?: CourseTracksResponse;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// Thành phần thanh bên bài học
const LessonSidebar = ({
  courseSlug,
  courseId,
  chapters,
  currentLessonId,
  trackingData,
  isSidebarOpen,
  onToggleSidebar,
}: LessonSidebarProps) => {
  const [openChapters, setOpenChapters] = React.useState<Set<string>>(new Set());

  // Lấy người dùng hiện tại để theo dõi tiến độ
  const user = useAuthStore((state) => state.user);

  // Hook đánh dấu hoàn thành bài học
  const toggleTrackMutation = useToggleTrack();

  // Tìm bài học hiện tại và tự mở chương tương ứng
  React.useEffect(() => {
    if (currentLessonId) {
      chapters.forEach((chapter) => {
        const hasCurrentLesson = chapter.lessons.some((lesson) => lesson._id === currentLessonId);
        if (hasCurrentLesson) {
          setOpenChapters((prev) => new Set([...prev, chapter._id]));
        }
      });
    }
  }, [currentLessonId, chapters]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // Kiểm tra bài học đã hoàn thành hay chưa
  const isLessonCompleted = (lessonId: string): boolean => {
    return trackingData?.completedLessons?.includes(lessonId) || false;
  };

  // Lưu bài học gần nhất của khóa vào localStorage
  const saveLastCourseLesson = (lessonId: string) => {
    saveLastLessonForCourse(courseSlug, lessonId);
  };

  // Xử lý đổi trạng thái hoàn thành bài học
  const handleLessonCompletionToggle = (lessonId: string) => {
    toggleTrackMutation.mutate({
      courseId,
      lessonId,
    });
  };

  return (
    <div
      className={`fixed top-14 z-50 flex h-[calc(100vh-56px)] w-full flex-col overflow-hidden border-l border-primary/15 bg-background shadow-sm transition-all duration-300 ease-in-out sm:top-16 sm:h-[calc(100vh-64px)] lg:w-[23%] ${
        isSidebarOpen ? "right-0" : "-right-full lg:-right-[23%]"
      }`}
    >
      {/* Tiêu đề */}
      <div className="flex items-center justify-between border-b border-primary/15 bg-primary/6 p-3 sm:p-4">
        <h2 className="text-sm font-semibold text-primary sm:text-base">Nội dung khóa học</h2>
        {/* Nút đóng trên mobile */}
        <button
          onClick={onToggleSidebar}
          className="rounded-xs p-1.5 transition-colors hover:bg-primary/10 lg:hidden"
          aria-label="Đóng mục lục"
        >
          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nội dung */}
      <div className="flex-1 pb-10 overflow-y-auto">
        {chapters.map((chapter, chapterIndex) => {
          const isOpen = openChapters.has(chapter._id);
          // Tính số bài đã hoàn thành theo dữ liệu theo dõi
          const completedLessons = chapter.lessons.filter((lesson) => isLessonCompleted(lesson._id)).length;
          const totalLessons = chapter.lessons.length;

          return (
            <Collapsible key={chapter._id} open={isOpen} onOpenChange={() => toggleChapter(chapter._id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-between border-b border-primary/10 bg-primary/5 px-3 py-2.5 text-left transition-all duration-200 ease-in-out hover:bg-primary/10 sm:px-4 sm:py-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 truncate text-xs font-medium text-foreground sm:text-sm">
                      {chapterIndex + 1}. {chapter.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">
                      {completedLessons}/{totalLessons} |{" "}
                      {(() => {
                        const totalSeconds = chapter.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
                        return secondsToDisplayTime(totalSeconds);
                      })()}
                    </div>
                  </div>
                  <div className="ml-2 flex shrink-0 items-center sm:ml-4">
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-primary/70 transition-transform duration-300 ease-in-out sm:h-4 sm:w-4 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="bg-background">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const isCurrentLesson = lesson._id === currentLessonId;
                    const lessonCompleted = isLessonCompleted(lesson._id);
                    const isLastLesson = lessonIndex === chapter.lessons.length - 1;

                    return (
                      <React.Fragment key={lesson._id}>
                        <div
                          className={`${
                            isCurrentLesson
                              ? "border-l-4 border-l-primary bg-primary/8"
                              : "border-l-4 border-l-transparent hover:border-l-primary hover:bg-primary/5"
                          } transition-colors duration-200`}
                        >
                          <div className="flex items-center group">
                            <Link
                              href={`/learning/${courseSlug}?id=${lesson._id}`}
                              className="block flex-1"
                              onClick={() => {
                                saveLastCourseLesson(lesson._id);
                                // Đóng thanh bên trên mobile khi bấm vào bài học
                                if (window.innerWidth < 1024) {
                                  onToggleSidebar();
                                }
                              }}
                            >
                              <div className="px-3 sm:px-4 py-2 sm:py-3 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4
                                      className={`text-xs sm:text-sm mb-1 truncate ${
                                        isCurrentLesson
                                          ? "font-semibold text-primary"
                                          : "text-foreground group-hover:text-primary"
                                      } transition-colors duration-200`}
                                    >
                                      {lessonIndex + 1}. {lesson.title}
                                    </h4>
                                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                                      {/* Biểu tượng loại nội dung */}
                                      {lesson.contentType === "video" && (
                                        <MdOutlineSlowMotionVideo
                                          className={`h-3.5 w-3.5 shrink-0 transition-colors duration-200 group-hover:text-primary sm:h-4 sm:w-4 ${
                                            isCurrentLesson ? "text-primary" : "text-muted-foreground"
                                          }`}
                                        />
                                      )}
                                      {lesson.contentType === "quiz" && (
                                        <HelpCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary sm:h-4 sm:w-4" />
                                      )}
                                      {lesson.contentType === "article" && (
                                        <LucideFileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary sm:h-4 sm:w-4" />
                                      )}
                                      <span className="whitespace-nowrap text-[10px] text-muted-foreground sm:text-xs">
                                        {secondsToDisplayTime(lesson.duration || 0)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>

                            {/* Ô đánh dấu hoàn thành */}
                            <div className="pr-4 flex items-center">
                              <Checkbox
                                checked={lessonCompleted}
                                disabled={toggleTrackMutation.isPending || !user}
                                className={`w-4 h-4 border transition-all duration-200 ${
                                  lessonCompleted
                                    ? "border-primary bg-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                                    : "border-primary/25 bg-background hover:border-primary/50"
                                } ${
                                  toggleTrackMutation.isPending || !user
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:shadow-sm"
                                }`}
                                onClick={() => handleLessonCompletionToggle(lesson._id)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Đường phân tách giữa các bài học */}
                        {!isLastLesson && <div className="border-t border-dotted border-primary/15"></div>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSidebar;
