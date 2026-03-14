"use client";
import { Lesson } from "@/shared/types/lesson";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface LessonBottomProps {
  nextLesson: string | null;
  prevLesson: string | null;
  lessonInfo: Lesson;
}

const LessonBottom = ({
  nextLesson,
  prevLesson,
  lessonInfo,
}: LessonBottomProps) => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 h-14 w-screen bg-white px-4 shadow-medium">
      <div className="flex h-full items-center justify-between">
        <div></div>
        <div className="flex h-full items-center justify-center gap-5">
          <Button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-l focus:outline-none"
            isDisabled={!prevLesson}
            onPress={() =>
              router.push(
                `/learning/${lessonInfo?.course?.slug}?id=${prevLesson}`,
              )
            }
          >
            <FaAngleLeft />
            Bài trước
          </Button>
          <Button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-gradient-to-l focus:outline-none"
            isDisabled={!nextLesson}
            onPress={() =>
              router.push(
                `/learning/${lessonInfo?.course?.slug}?id=${nextLesson}`,
              )
            }
          >
            Bài sau
            <FaAngleRight />
          </Button>
        </div>
        <div className="text-sm font-bold">{lessonInfo?.chapter?.title}</div>
      </div>
    </div>
  );
};

export default LessonBottom;
