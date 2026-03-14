"use client";
import { LessonType } from "@/shared/constants/enums";
import { TCourseItem } from "@/shared/types/course";
import { toHHMMSS } from "@/utils/common";
import { Accordion, AccordionItem } from "@heroui/react";
import { MdOutlineQuiz, MdOutlineSlowMotionVideo } from "react-icons/md";

type CourseOutlineProps = {
  course: TCourseItem;
};

const CourseOutline = ({ course }: CourseOutlineProps) => {
  const itemClasses = {
    title: " font-semibold text-default-900 ",
    base: "p-0 rounded",
    trigger: "p-4  cursor-pointer border-b",
    indicator: "text-medium font-bold ",
    content: "text-small  p-0",
  };

  return (
    <Accordion
      className="p-0"
      itemClasses={itemClasses}
      selectionMode="multiple"
      variant="splitted"
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
    >
      {course.chapters.map((item, index) => (
        <AccordionItem
          key={index}
          title={
            <div className="flex items-center justify-between">
              <span className="">{item?.title}</span>

              <span className="text-sm">{item.lessons.length} bài học</span>
            </div>
          }
        >
          {item.lessons?.length > 0 &&
            item.lessons.map((lesson) => {
              return (
                <div
                  key={lesson._id}
                  className="flex w-full items-center justify-between border-b p-4 pl-4 transition-all last:border-b-0 hover:border-l-4 hover:border-l-indigo-500 hover:bg-primary/10"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">
                        {lesson?.type === LessonType.VIDEO ? (
                          <MdOutlineSlowMotionVideo size={16} />
                        ) : (
                          <MdOutlineQuiz size={16} />
                        )}
                      </span>
                      <span className="">{lesson.title}</span>
                    </div>
                    <div>{toHHMMSS(lesson.duration)}</div>
                  </div>
                </div>
              );
            })}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CourseOutline;
