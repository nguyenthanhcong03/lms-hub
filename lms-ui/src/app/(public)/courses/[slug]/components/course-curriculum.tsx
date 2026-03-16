"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IPublicChapter } from "@/types/chapter";
import { formatDuration, secondsToDisplayTime } from "@/utils/format";

import { Award, BookOpen, Clock, HelpCircle, Layers, LucideFileText, PlayCircle } from "lucide-react";

import React from "react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

interface CourseCurriculumProps {
  chapters: IPublicChapter[];
  isLoading: boolean;
}

const CourseCurriculum = ({ chapters, isLoading }: CourseCurriculumProps) => {
  if (isLoading) {
    return (
      <div className="bg-background rounded-xs shadow-sm border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xs flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>

            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Loading */}
        <div className="p-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xs p-6 border border-border">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-xs" />

                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>

                    <Skeleton className="h-8 w-20 rounded-xs" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="bg-background rounded-xs  shadow-sm border border-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xs flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary-foreground" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">Nội dung khóa học</h3>
              <p className="text-sm text-muted-foreground">Khám phá các chương và bài học</p>
            </div>
          </div>
        </div>

        {/* Empty */}
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>

          <h4 className="text-xl font-semibold text-foreground mb-2">Chưa có nội dung</h4>

          <p className="text-muted-foreground max-w-sm mx-auto">
            Khóa học này hiện chưa có nội dung. Vui lòng quay lại sau để xem cập nhật mới.
          </p>
        </div>
      </div>
    );
  }

  const totalLessons = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0);

  const totalDuration = chapters.reduce(
    (total, chapter) =>
      total + (chapter.lessons?.reduce((sum: number, lesson) => sum + (lesson.duration || 0), 0) || 0),
    0,
  );

  return (
    <div className="bg-background rounded-xs  shadow-sm border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Layers className="h-6 w-6 text-primary-foreground" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl lg:text-2xl font-semibold text-foreground">Nội dung khóa học</h3>
            <p className="text-sm text-muted-foreground">Lộ trình học tập đầy đủ của khóa học</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/5 rounded-xs p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase">Chương</span>
            </div>

            <p className="text-2xl font-bold text-foreground">{chapters.length}</p>
          </div>

          <div className="bg-primary/5 rounded-xs p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase">Bài học</span>
            </div>

            <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
          </div>

          <div className="bg-primary/5 rounded-xs p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase">Thời lượng</span>
            </div>

            <p className="text-2xl font-bold text-foreground">{formatDuration(totalDuration || 0)}</p>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="bg-background">
        <Accordion type="multiple" className="w-full">
          {chapters.map((chapter, chapterIndex) => (
            <AccordionItem key={chapter._id} value={chapter._id} className="border-b border-border last:border-none">
              <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 hover:no-underline">
                <div className="flex justify-between w-full text-left">
                  <span className="font-semibold text-sm sm:text-base">
                    {chapterIndex + 1}. {chapter.title}
                  </span>

                  <span className="text-sm text-muted-foreground">{chapter.lessons?.length || 0} bài học</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-0">
                {chapter.lessons?.map((lesson, lessonIndex) => {
                  const isLastLesson = lessonIndex === (chapter.lessons?.length || 0) - 1;

                  return (
                    <React.Fragment key={lesson._id}>
                      <div
                        className={cn("flex items-center justify-between py-4 px-6 hover:bg-muted transition-colors")}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-center w-6 h-6">
                            {lesson.contentType === "video" && (
                              <MdOutlineSlowMotionVideo className="h-4 w-4 text-muted-foreground" />
                            )}

                            {lesson.contentType === "quiz" && <HelpCircle className="h-4 w-4 text-muted-foreground" />}

                            {lesson.contentType === "article" && (
                              <LucideFileText className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          <span className="text-sm text-foreground truncate">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                        </div>

                        <span className="text-sm text-muted-foreground">
                          {secondsToDisplayTime(lesson.duration || 0)}
                        </span>
                      </div>

                      {!isLastLesson && <div className="border-t border-dashed border-border"></div>}
                    </React.Fragment>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CourseCurriculum;
