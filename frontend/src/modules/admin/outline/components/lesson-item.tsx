import { LessonType } from "@/shared/constants/enums";
import { ChapterLesson } from "@/shared/types/chapter";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

type ItemLessonProps = {
  lesson: ChapterLesson;
  setOpenCreateEditLesson: (value: {
    open: boolean;
    id: string;
    chapterId: string;
  }) => void;
  setOpenCreateEditQuiz: (value: {
    open: boolean;
    id: string;
    chapterId: string;
  }) => void;
  setOpenDeleteLesson: (value: { open: boolean; id: string }) => void;
};

const ItemLesson = ({
  lesson,
  setOpenCreateEditLesson,
  setOpenCreateEditQuiz,
  setOpenDeleteLesson,
}: ItemLessonProps) => {
  const handleEditLesson = () => {
    if (lesson?.type === LessonType.VIDEO) {
      setOpenCreateEditLesson({
        open: true,
        id: lesson?._id,
        chapterId: lesson?.chapter,
      });
    } else {
      setOpenCreateEditQuiz({
        open: true,
        id: lesson?._id,
        chapterId: lesson?.chapter,
      });
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <IoMenu size={20} />
        <span>{lesson.title}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleEditLesson}
          className="cursor-pointer hover:text-blue-600"
        >
          <FiEdit />
        </button>
        <button
          className="cursor-pointer hover:text-red-600"
          onClick={() => {
            setOpenDeleteLesson({
              open: true,
              id: lesson?._id,
            });
          }}
        >
          <FaRegTrashCan />
        </button>
      </div>
    </div>
  );
};

export default ItemLesson;
