"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React from "react";
import { usePublicCourseChapters } from "@/hooks/use-chapters";
import { useLesson } from "@/hooks/use-lessons";
import { useUserCourseTracks } from "@/hooks/use-track";
import Loader from "@/components/loader";
import LessonCommentButton from "./components/comment/lesson-comment-button";
import LessonHeader from "./components/lesson-header";
import LessonNavigation from "./components/lesson-navigation";

const LessonSidebar = dynamic(() => import("./components/lesson-sidebar"));

// Import động với cấu hình SSR
const LessonVideoPlayer = dynamic(() => import("./components/lesson-video-player"), {
  ssr: false,
});

const LessonArticleContent = dynamic(() => import("./components/lesson-article-content"));

const LessonCommentDrawer = dynamic(() => import("./components/comment/lesson-comment-drawer"), {
  ssr: false,
});

const LessonQuiz = dynamic(() => import("./components/quiz/lesson-quiz"), {
  ssr: false,
});

interface ChapterWithLessons {
  _id: string;
  title: string;
  lessons?: LessonInChapter[];
}

interface LessonInChapter {
  _id: string;
  title: string;
  contentType: "video" | "quiz" | "article";
  duration?: number;
  preview?: boolean;
  isPublished?: boolean;
}

const LessonPage = () => {
  const searchParams = useSearchParams();

  const lessonId = searchParams.get("id") || "";

  // Lấy dữ liệu bài học
  const { data: lesson, isLoading } = useLesson(lessonId || "");

  // Lấy danh sách chương học
  const { data: chapters = [] } = usePublicCourseChapters(lesson?.courseId || "");

  // Lấy dữ liệu theo dõi tiến độ của người dùng
  const { data: trackingData } = useUserCourseTracks(lesson?.courseId || "");

  // Tính tổng số bài học
  const totalLessons = React.useMemo(() => {
    return (
      (chapters as ChapterWithLessons[])?.reduce((total, chapter) => total + (chapter?.lessons?.length || 0), 0) || 0
    );
  }, [chapters]);

  // Tìm vị trí bài học hiện tại
  const allLessons = React.useMemo(() => {
    return (
      (chapters as ChapterWithLessons[])?.flatMap(
        (chapter) =>
          chapter?.lessons?.map((lesson) => ({
            ...lesson,
            chapterId: chapter?._id,
          })) || [],
      ) || []
    );
  }, [chapters]);

  const currentLessonIndex = allLessons?.findIndex((l) => l?._id === lessonId) ?? -1;
  const previousLesson = currentLessonIndex > 0 ? allLessons?.[currentLessonIndex - 1] : undefined;
  const nextLesson =
    currentLessonIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentLessonIndex + 1] : undefined;

  // Chuẩn bị dữ liệu cho thanh bên
  const sidebarChapters = React.useMemo(() => {
    return (
      (chapters as ChapterWithLessons[])?.map((chapter) => ({
        _id: chapter?._id,
        title: chapter?.title,
        lessons:
          chapter?.lessons?.map((lesson) => ({
            _id: lesson?._id,
            title: lesson?.title,
            contentType: lesson?.contentType,
            duration: lesson?.duration,
            isCompleted: trackingData?.completedLessons?.includes(lesson?._id) || false,
            isLocked: lesson?.isPublished,
            preview: lesson?.preview,
          })) || [],
      })) || []
    );
  }, [chapters, trackingData]);

  // Trạng thái thanh bên
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Trạng thái ngăn bình luận
  const [showComments, setShowComments] = React.useState(false);

  const handleOpenComments = () => {
    setShowComments(true);
  };

  // Tìm tên chương hiện tại
  const currentChapterTitle = React.useMemo(() => {
    for (const chapter of (chapters as ChapterWithLessons[]) || []) {
      if (chapter?.lessons?.some((lesson) => lesson?._id === lessonId)) {
        return chapter?.title;
      }
    }
    return "Chương";
  }, [chapters, lessonId]);

  // Hiển thị nội dung bài học
  const renderLessonContent = () => {
    switch (lesson?.contentType) {
      case "video":
        return (
          <LessonVideoPlayer
            title={lesson?.title}
            isSidebarOpen={isSidebarOpen}
            videoUrl={lesson?.resource?.url || ""}
            description={lesson?.resource?.description || ""}
          />
        );

      case "article":
        return <LessonArticleContent title={lesson?.title} content={lesson?.resource?.description || ""} />;

      case "quiz":
        return <LessonQuiz lesson={lesson} />;

      default:
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Loại nội dung bài học không xác định: {lesson?.contentType}</AlertDescription>
          </Alert>
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen overflow-hidden">
      {/* Lớp phủ cho thanh bên trên thiết bị di động */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-primary/25 transition-opacity duration-300 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <LessonHeader
        courseTitle={lesson?.course?.title || "Khóa học"}
        courseSlug={lesson?.course?.slug || ""}
        completedLessons={trackingData?.completedCount || 0}
        totalLessons={totalLessons}
      />

      <div className={`pt-16 pb-16 h-screen transition-all duration-300 ${isSidebarOpen ? "lg:pr-[23%]" : "pr-0"}`}>
        <div className="w-full h-full overflow-y-auto">{renderLessonContent()}</div>
      </div>

      <LessonNavigation
        courseSlug={lesson?.course?.slug || ""}
        previousLesson={previousLesson ? { _id: previousLesson?._id } : undefined}
        nextLesson={nextLesson ? { _id: nextLesson?._id } : undefined}
        currentChapterTitle={currentChapterTitle}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <LessonSidebar
        courseTitle={lesson?.course?.title || "Khóa học"}
        courseSlug={lesson?.course?.slug || ""}
        courseId={lesson?.courseId || ""}
        chapters={sidebarChapters}
        currentLessonId={lessonId}
        trackingData={trackingData}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <LessonCommentButton
        className={`bottom-20 sm:bottom-20 ${isSidebarOpen ? "lg:right-[25%] right-4" : "right-4 sm:right-10"}`}
        onClick={handleOpenComments}
      />

      {/* Chỉ hiển thị drawer khi người dùng đã bấm nút */}
      {showComments && <LessonCommentDrawer lessonId={lessonId} isOpen={showComments} onOpenChange={setShowComments} />}
    </div>
  );
};

export default LessonPage;
