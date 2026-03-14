"use client";

import { Lesson } from "@/shared/types/lesson";
import moment from "moment";
import { useEffect } from "react";
interface LessonContentProps {
  lessonInfo: Lesson;
  isExpanded: boolean;
}
const LessonContent = ({ lessonInfo, isExpanded }: LessonContentProps) => {
  const embed = lessonInfo?.resource?.video_url?.includes("v=")
    ? lessonInfo?.resource?.video_url?.split("v=")[1]?.split("&")[0]
    : lessonInfo?.resource?.video_url?.split("/").at(-1);

  useEffect(() => {
    if (!lessonInfo) return;

    if (typeof localStorage === "undefined") return;

    const localData =
      JSON.parse(localStorage.getItem("lastCourseLesson") || "[]") || [];

    if (!Array.isArray(localData)) return;

    const existLesson = localData.find(
      (item: { course: string; lesson: string }) =>
        item.course === lessonInfo?.course?.slug,
    );

    if (existLesson) {
      const index = localData.findIndex(
        (item: { course: string; lesson: string }) =>
          item.course === lessonInfo?.course?.slug,
      );

      localData.splice(index, 1);
    }

    const item = {
      course: lessonInfo?.course?.slug,
      lesson: lessonInfo?._id,
    };

    const data = localData.concat(item);

    localStorage.setItem("lastCourseLesson", JSON.stringify(data));
  }, [lessonInfo]);

  return (
    <div className="h-full w-full">
      <div className={`bg-black ${isExpanded ? "px-[16%]" : "px-[8.5%]"}`}>
        <div className="relative min-h-[400px] w-full">
          <div className="pt-[56.25%]">
            <iframe
              src={`https://www.youtube.com/embed/${embed}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute left-0 top-0 h-full w-full"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="h-auto space-y-10 bg-white px-[8%] py-8 md:min-h-[400px]">
        <div>
          <h2 className="text-2xl font-bold">{lessonInfo?.title}</h2>
          <p className="text-sm font-medium text-default-500">
            Cập nhật {moment(lessonInfo?.updatedAt).format("LL")}
          </p>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: lessonInfo?.resource?.content }}
        ></div>
      </div>
    </div>
  );
};

export default LessonContent;
