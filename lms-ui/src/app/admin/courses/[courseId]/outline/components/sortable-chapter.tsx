"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdAccessTime,
  MdAdd,
  MdDelete,
  MdDescription,
  MdDragIndicator,
  MdEdit,
  MdMenuBook,
  MdMoreVert,
} from "react-icons/md";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PopulatedChapter } from "@/types/chapter";
import { DisplayLesson } from "@/types/lesson";
import { secondsToTimeString } from "@/utils/format";
import SortableLesson from "./sortable-lesson";

interface SortableChapterProps {
  chapter: PopulatedChapter;
  chapterIndex: number;
  isExpanded: boolean;
  onToggleExpanded: (value: string[]) => void;
  onEditChapter: (chapter: PopulatedChapter) => void;
  onDeleteChapter: (chapterId: string) => void;
  onAddLesson: (chapterId: string) => void;
  onEditLesson: (lesson: DisplayLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onToggleLessonPublish: (lessonId: string) => void;
  onLessonReorder: (chapterId: string, lessons: DisplayLesson[]) => void;
}

const SortableChapter = ({
  chapter,
  chapterIndex,
  isExpanded,
  onToggleExpanded,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onToggleLessonPublish,
  onLessonReorder,
}: SortableChapterProps) => {
  const lessons = chapter.lessons || [];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter._id,
    data: {
      type: "chapter",
      chapter,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const publishedLessons = lessons.filter((lesson) => lesson.isPublished).length;
  const totalLessons = lessons.length;

  const totalChapterDuration = lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && lessons.length > 0) {
      const oldIndex = lessons.findIndex((lesson) => lesson._id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson._id === over?.id);

      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex).map((lesson, index: number) => ({
        ...lesson,
        order: index + 1,
      })) as DisplayLesson[];

      onLessonReorder(chapter._id, reorderedLessons);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-4 py-2 bg-card border border-border hover:bg-accent/30 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Accordion
        type="multiple"
        value={isExpanded ? [chapter._id] : []}
        onValueChange={(value) => onToggleExpanded(value)}
        className="w-full"
      >
        <AccordionItem value={chapter._id} className="border-0">
          {/* Chu thich tieng Viet */}
          <div className="group/chapter">
            <div
              className={`flex items-start justify-between gap-3 p-4 transition-colors ${
                isExpanded ? "border-b border-border" : ""
              }`}
            >
              <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Chu thich tieng Viet */}
                  <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdDragIndicator className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium ">{chapterIndex + 1}.</span>
                      <h3 className="font-medium text-card-foreground truncate">{chapter.title}</h3>
                    </div>
                    {/* Chu thich tieng Viet */}
                    <div className="flex items-center gap-4 mt-1 text-sm font-normal">
                      {/* Chu thich tieng Viet */}
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${chapter.isPublished ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <span className="text-muted-foreground">
                          {chapter.isPublished ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </div>

                      {/* Chu thich tieng Viet */}
                      <div className="flex items-center gap-1">
                        <MdMenuBook className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          bài học: {publishedLessons}/{totalLessons}
                        </span>
                      </div>

                      {/* Chu thich tieng Viet */}
                      <div className="flex items-center gap-1">
                        <MdAccessTime className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Thời lượng: {secondsToTimeString(totalChapterDuration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/* Chu thich tieng Viet */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddLesson(chapter._id);
                  }}
                  className="h-8 px-3 text-xs"
                >
                  <MdAdd className="h-3 w-3 mr-1" />
                  Thêm bài học
                </Button>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <MdMoreVert className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();

                        onEditChapter(chapter);
                      }}
                    >
                      <MdEdit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();

                        onDeleteChapter(chapter._id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <MdDelete className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Chu thich tieng Viet */}
          <AccordionContent className="p-0">
            <div className="px-6 py-4 bg-muted/30">
              {lessons.length === 0 ? (
                <div className="bg-card rounded-lg p-8 text-center border border-dashed border-border">
                  <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MdDescription className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-semibold text-card-foreground mb-2">Chưa có bài học nào</h4>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    Bắt đầu bằng cách tạo bài học đầu tiên. Bạn có thể thêm video, bài viết, hoặc câu hỏi trắc nghiệm.
                  </p>
                  <Button variant="outline" onClick={() => onAddLesson(chapter._id)}>
                    <MdAdd className="h-4 w-4 mr-2" />
                    Thêm Bài học đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Bài học ({lessons.length})
                    </h4>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
                    <SortableContext items={lessons.map((lesson) => lesson._id)} strategy={verticalListSortingStrategy}>
                      {lessons.map((lesson, index) => (
                        <SortableLesson
                          key={lesson._id}
                          lesson={lesson as DisplayLesson}
                          lessonIndex={index}
                          onEditLesson={onEditLesson}
                          onDeleteLesson={onDeleteLesson}
                          onToggleLessonPublish={onToggleLessonPublish}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SortableChapter;
