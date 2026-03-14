"use client";
import { useAppSelector } from "@/shared/store";
import { Chapter, ChapterLesson } from "@/shared/types/chapter";
import { Lesson } from "@/shared/types/lesson";
import { TTrackItem } from "@/shared/types/track";
import { toHHMMSS } from "@/utils/common";
import { Accordion, AccordionItem } from "@heroui/react";
import { useEffect, useRef } from "react";
import LessonOutlineItem from "./lesson-outline-item";

interface LessonOutlineProps {
  isExpanded: boolean;
  chapters: Chapter[];
  lessonInfo: Lesson;
}

const LessonOutline = ({
  isExpanded,
  chapters,
  lessonInfo,
}: LessonOutlineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { result: tracks } = useAppSelector((state) => state.track);

  const trackIds = new Set(tracks.map((item: TTrackItem) => item.lesson));

  const countCompletedLessonsInChapter = (chapter: Chapter) => {
    return chapter.lessons.filter((lesson) => trackIds.has(lesson._id)).length;
  };

  const totalDurationOfChapter = (chapter: Chapter) => {
    let total = 0;
    chapter.lessons.forEach((lesson) => {
      total += lesson.duration;
    });
    return toHHMMSS(total);
  };
  const itemClasses = {
    title: "text-base font-bold text-default-900",
    base: "p-0",
    trigger:
      "px-4 py-2.5 bg-slate-50 data-[hover=true]:bg-default-100 cursor-pointer ",
    indicator: "text-medium",
    content: "text-sm p-0",
  };

  const currentLesson = chapters?.reduce<ChapterLesson | null>((acc, cur) => {
    const lesson = cur.lessons.find(
      (lesson) => lesson.slug === lessonInfo?.slug,
    );
    if (lesson) {
      return lesson;
    }

    return acc;
  }, null);

  const handleLeaveContainer = () => {
    const element = document.getElementById(lessonInfo?._id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (!lessonInfo?._id || chapters?.length === 0) return;
    const timer = setTimeout(() => {
      handleLeaveContainer();
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonInfo, chapters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const element = document.getElementById(lessonInfo?._id);

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        element
      ) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [lessonInfo?._id]);
  return (
    <aside
      className={`fixed right-0 top-0 hidden h-screen bg-white shadow-xl transition-all duration-300 ease-in-out md:block ${
        isExpanded ? "w-0" : "w-[23%]"
      } `}
    >
      <div className="h-14 border-b bg-white p-4 text-base font-bold">
        Nội dung khóa học
      </div>

      <div
        ref={containerRef}
        className="scrollbar-custom relative h-[calc(100vh-112px)] overflow-y-auto"
      >
        <Accordion
          className="p-0"
          itemClasses={itemClasses}
          selectionMode="multiple"
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: "auto",
                overflowY: "unset",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                overflowY: "hidden",
                transition: {
                  height: {
                    easings: "ease",
                    duration: 0.25,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 0.3,
                  },
                },
              },
            },
          }}
          defaultExpandedKeys={
            currentLesson?.chapter ? [currentLesson.chapter] : []
          }
        >
          {chapters?.map((chapter) => (
            <AccordionItem
              key={chapter?._id}
              subtitle={
                <div className="text-xs font-medium text-default-500">
                  <span>{countCompletedLessonsInChapter(chapter)}</span>/
                  <span>{chapter?.lessons?.length}</span> |{" "}
                  {totalDurationOfChapter(chapter)}
                </div>
              }
              title={chapter?.title}
            >
              {chapter?.lessons?.map((lesson) => {
                return (
                  <LessonOutlineItem
                    key={lesson?._id}
                    lesson={lesson}
                    isActive={lesson?.slug === lessonInfo?.slug}
                    courseSlug={lessonInfo?.course?.slug}
                    trackIds={trackIds}
                  />
                );
              })}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};

export default LessonOutline;
