import { Button } from "@heroui/react";
import React from "react";
import { LuSquarePlus } from "react-icons/lu";
import ItemLesson from "./lesson-item";
import { Chapter } from "@/shared/types/chapter";

type ListLessonProps = {
  chapter: Chapter;
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

const ListLesson = ({
  chapter,
  setOpenCreateEditLesson,
  setOpenCreateEditQuiz,
  setOpenDeleteLesson,
}: ListLessonProps) => {
  return (
    <div className="space-y-4">
      {chapter?.lessons.map((lesson, index) => (
        <ItemLesson
          lesson={lesson}
          setOpenCreateEditLesson={setOpenCreateEditLesson}
          setOpenCreateEditQuiz={setOpenCreateEditQuiz}
          setOpenDeleteLesson={setOpenDeleteLesson}
          key={index}
        />
      ))}
      <div className="flex items-center gap-4">
        <Button
          startContent={<LuSquarePlus />}
          size="sm"
          color="primary"
          variant="bordered"
          className="font-bold"
          onPress={() => {
            setOpenCreateEditLesson({
              open: true,
              id: "",
              chapterId: chapter._id,
            });
          }}
        >
          Bài học
        </Button>
        <Button
          startContent={<LuSquarePlus />}
          size="sm"
          color="primary"
          variant="bordered"
          className="font-bold"
          onPress={() => {
            setOpenCreateEditQuiz({
              open: true,
              id: "",
              chapterId: chapter._id,
            });
          }}
        >
          Quiz
        </Button>
      </div>
    </div>
  );
};

export default ListLesson;
