"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MdAdd, MdDescription, MdDragIndicator } from "react-icons/md";
import { toast } from "sonner";

import { PermissionGuard } from "@/components/guards/guard";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Permission } from "@/configs/permission";
import { PopulatedChapter } from "@/types/chapter";
import dynamic from "next/dynamic";

import { chapterKeys, useCourseChapters, useDeleteChapter, useReorderChapters } from "@/hooks/use-chapters";

import { DisplayLesson, useDeleteLesson, useReorderLessons, useToggleLessonPublish } from "@/hooks/use-lessons";

import ChapterSkeleton from "./components/chapter-skeleton";

const ChapterFormDialog = dynamic(() => import("./components/chapter-form-dialog"), {
  loading: () => <Loader />,
  ssr: false,
});

const LessonFormDialog = dynamic(() => import("./components/lesson-form-dialog"), {
  loading: () => <Loader />,
  ssr: false,
});

const SortableChapter = dynamic(() => import("./components/sortable-chapter"), {
  loading: () => <ChapterSkeleton />,
  ssr: false,
});

const CourseStatistics = dynamic(() => import("./components/course-statistics"), {
  loading: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  ssr: false,
});

const CourseOutlinePage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const queryClient = useQueryClient();

  // API query để lấy danh sách chương và bài học của khóa học
  const { data: chapters = [], isLoading } = useCourseChapters(courseId);

  const deleteChapterMutation = useDeleteChapter();
  const reorderChaptersMutation = useReorderChapters();

  // API mutations cho bài học
  const deleteLessonMutation = useDeleteLesson();
  const toggleLessonPublishMutation = useToggleLessonPublish();
  const reorderLessonsMutation = useReorderLessons();

  // State để quản lý thứ tự chương và bài học một cách tối ưu khi kéo thả, giúp giao diện phản hồi ngay lập tức mà không cần chờ API
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [optimisticChapters, setOptimisticChapters] = useState<PopulatedChapter[] | null>(null);
  const [optimisticLessons, setOptimisticLessons] = useState<{
    chapterId: string;
    lessons: DisplayLesson[];
  } | null>(null);

  // State để quản lý dialog tạo/chỉnh sửa chương và bài học
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<PopulatedChapter | undefined>();
  const [editingLessonId, setEditingLessonId] = useState<string | undefined>();
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  let chaptersToRender = optimisticChapters || chapters;

  // Nếu đang có thứ tự bài học tối ưu, cập nhật bài học của chương đó trong chaptersToRender để phản ánh thứ tự mới ngay lập tức
  if (optimisticLessons) {
    chaptersToRender = chaptersToRender.map((chapter) =>
      chapter._id === optimisticLessons.chapterId ? { ...chapter, lessons: optimisticLessons.lessons } : chapter,
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = chapters.findIndex((chapter) => chapter._id === active.id);
      const newIndex = chapters.findIndex((chapter) => chapter._id === over?.id);

      // Cập nhật thứ tự chương một cách tối ưu trước khi gọi API
      const reorderedChapters = arrayMove(chapters, oldIndex, newIndex);
      setOptimisticChapters(reorderedChapters);

      const reorderData = {
        chapters: reorderedChapters.map((chapter, index) => ({
          id: chapter._id,
          order: index + 1,
        })),
      };

      // Call API để cập nhật thứ tự chương
      reorderChaptersMutation.mutate(reorderData, {
        onSuccess: () => {
          // Nếu sắp xếp lại thành công, cập nhật cache để phản ánh thứ tự mới ngay lập tức
          queryClient.setQueryData(chapterKeys.courseChapters(courseId), reorderedChapters);
          toast.success("Chương đã được sắp xếp lại");
          setOptimisticChapters(null);
        },
        onError: () => {
          // Cập nhật lại thứ tự chương về trạng thái ban đầu nếu có lỗi xảy ra
          toast.error("Không thể cập nhật thứ tự chương");
          setOptimisticChapters(null);
        },
      });
    }
  };

  const handleLessonReorder = (chapterId: string, reorderedLessons: DisplayLesson[]) => {
    // Cập nhật thứ tự bài học một cách tối ưu trước khi gọi API
    setOptimisticLessons({ chapterId, lessons: reorderedLessons });

    const reorderData = reorderedLessons.map((lesson, index) => ({
      id: lesson._id,
      order: index + 1,
    }));

    reorderLessonsMutation.mutate(
      { reorderData: { lessons: reorderData } },
      {
        onSuccess: () => {
          // Nếu sắp xếp lại bài học thành công, cập nhật cache cho chương đó để phản ánh thứ tự mới ngay lập tức
          const currentChapters = queryClient.getQueryData(chapterKeys.courseChapters(courseId)) as
            | PopulatedChapter[]
            | undefined;

          if (currentChapters) {
            const updatedChapters = currentChapters.map((ch) =>
              ch._id === chapterId ? { ...ch, lessons: reorderedLessons } : ch,
            );

            queryClient.setQueryData(chapterKeys.courseChapters(courseId), updatedChapters);
          }

          toast.success("Bài học đã được sắp xếp lại");
          setOptimisticLessons(null);
        },
        onError: () => {
          // Nếu có lỗi xảy ra khi sắp xếp lại bài học
          toast.error("Không thể sắp xếp lại bài học");
          setOptimisticLessons(null);
        },
      },
    );
  };

  const handleAccordionChange = (expandedChapterIds: string[]) => {
    const newExpanded = new Set(expandedChapterIds);
    setExpandedChapters(newExpanded);
  };

  const handleAddChapter = () => {
    setEditingChapter(undefined);
    setChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: PopulatedChapter) => {
    setEditingChapter(chapter);
    setChapterDialogOpen(true);
  };

  const handleDeleteChapter = (chapterId: string) => {
    deleteChapterMutation.mutate(chapterId, {
      onSuccess: () => {
        toast.success("Xóa chương thành công");
      },
      onError: () => {
        toast.error("Không thể xóa chương");
      },
    });
  };

  const handleAddLesson = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setEditingLessonId(undefined);
    setLessonDialogOpen(true);
  };

  const handleEditLesson = (lesson: DisplayLesson) => {
    const chapter = chaptersToRender.find((c) => c.lessons?.some((l) => l._id === lesson._id));
    if (chapter) {
      setSelectedChapterId(chapter._id);
      setEditingLessonId(lesson._id);
      setLessonDialogOpen(true);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    deleteLessonMutation.mutate(lessonId, {
      onSuccess: () => {
        toast.success("Bài học đã được xóa");
      },
      onError: () => {
        toast.error("Không thể xóa bài học");
      },
    });
  };

  const handleToggleLessonPublish = (lessonId: string) => {
    toggleLessonPublishMutation.mutate(lessonId, {
      onSuccess: (updatedLesson) => {
        toast.success(`Bài học đã được ${updatedLesson.isPublished ? "public" : "unpublic"} successfully`);
      },
      onError: () => {
        toast.error("Không thể cập nhật trạng thái bài học");
      },
    });
  };

  const handleLessonSuccess = () => {
    // Nếu đang thêm bài học mới (không có editingLessonId) và đã chọn chương, tự động mở chương đó
    if (!editingLessonId && selectedChapterId) {
      const expandedArray = Array.from(expandedChapters);
      if (!expandedArray.includes(selectedChapterId)) {
        handleAccordionChange([...expandedArray, selectedChapterId]);
      }
    }
  };

  const handleChapterDialogChange = (open: boolean) => {
    setChapterDialogOpen(open);
    // Nếu dialog đóng, reset chương đang chỉnh sửa
    if (!open) {
      setEditingChapter(undefined);
    }
  };

  const totalChapters = chaptersToRender.length;
  let totalLessons = 0;
  let publishedLessons = 0;
  let totalDuration = 0;

  chaptersToRender.forEach((chapter) => {
    if (chapter.lessons) {
      totalLessons += chapter.lessons.length;
      publishedLessons += chapter.lessons.filter((lesson) => lesson.isPublished).length;
      totalDuration += chapter.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    }
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nội dung khóa học</h1>
          <p className="text-gray-600 mt-1">Quản lý nội dung khóa học của bạn</p>
        </div>
        <Button onClick={handleAddChapter}>
          <MdAdd className="h-4 w-4 mr-2" />
          Thêm Chương
        </Button>
      </div>

      {/* Thống kê */}
      <CourseStatistics
        totalChapters={totalChapters}
        totalLessons={totalLessons}
        publishedLessons={publishedLessons}
        totalDuration={totalDuration}
        isLoading={isLoading}
      />

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <ChapterSkeleton key={index} />)
        ) : chaptersToRender.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MdDescription className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có chương nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo chương đầu tiên</p>
              <Button onClick={handleAddChapter}>
                <MdAdd className="h-4 w-4 mr-2" />
                Thêm chương đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chaptersToRender.map((chapter) => chapter._id)}
              strategy={verticalListSortingStrategy}
            >
              {chaptersToRender.map((chapter, index) => (
                <SortableChapter
                  key={chapter._id}
                  chapter={chapter}
                  chapterIndex={index}
                  isExpanded={expandedChapters.has(chapter._id)}
                  onToggleExpanded={handleAccordionChange}
                  onEditChapter={handleEditChapter}
                  onDeleteChapter={handleDeleteChapter}
                  onAddLesson={handleAddLesson}
                  onEditLesson={handleEditLesson}
                  onDeleteLesson={handleDeleteLesson}
                  onToggleLessonPublish={handleToggleLessonPublish}
                  onLessonReorder={handleLessonReorder}
                />
              ))}
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white rounded-xs shadow-lg border border-blue-500 p-4">
                  <div className="flex items-center gap-2">
                    <MdDragIndicator className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      {chaptersToRender.find((c) => c._id === activeId)?.title || "Item"}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Form*/}
      <ChapterFormDialog
        open={chapterDialogOpen}
        onOpenChange={handleChapterDialogChange}
        chapter={editingChapter}
        courseId={courseId}
      />

      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        lessonId={editingLessonId}
        chapterId={selectedChapterId}
        courseId={courseId}
        onSuccess={handleLessonSuccess}
      />
    </div>
  );
};

export default CourseOutlinePage;
