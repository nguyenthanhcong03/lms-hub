import { LessonType } from "@/shared/constants/enums";
import { ChapterLesson } from "@/shared/types/chapter";
import { toHHMMSS } from "@/utils/common";
import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineQuiz, MdOutlineSlowMotionVideo } from "react-icons/md";
interface LessonOutlineItemProps {
  lesson: ChapterLesson;
  isActive: boolean;
  courseSlug: string;
  trackIds: Set<string>;
}

const LessonOutlineItem = ({
  lesson,
  isActive,
  courseSlug,
  trackIds,
}: LessonOutlineItemProps) => {
  return (
    <Link
      id={lesson?._id}
      href={{
        pathname: `/learning/${courseSlug}`,
        query: { id: lesson?._id },
      }}
      className={`flex cursor-pointer items-center justify-between border-b p-2 pl-4 transition-all last:border-b-0 hover:border-l-4 hover:border-l-indigo-500 hover:bg-primary/10 ${
        isActive ? "border-l-4 border-l-indigo-500 bg-primary/10" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-default-900">{lesson?.title}</p>
        <p className="flex items-center gap-1 text-xs text-default-500">
          <span className="text-primary">
            {lesson?.type === LessonType.VIDEO ? (
              <MdOutlineSlowMotionVideo size={16} />
            ) : (
              <MdOutlineQuiz size={16} />
            )}
          </span>{" "}
          {toHHMMSS(lesson?.duration)}
        </p>
      </div>
      <span
        className={`${
          trackIds.has(lesson?._id) ? "text-primary" : "text-default-500"
        }`}
      >
        <FaCircleCheck size={16} />
      </span>
    </Link>
  );
};

export default LessonOutlineItem;
