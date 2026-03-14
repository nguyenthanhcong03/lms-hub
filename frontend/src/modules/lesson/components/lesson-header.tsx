"use client";
import { createTrack } from "@/shared/services/track";
import { Button, CircularProgress } from "@heroui/react";
import { FaAngleRight, FaRegCheckCircle } from "react-icons/fa";

import { ROUTE_CONFIG } from "@/shared/configs/route";
import { useAuth } from "@/shared/contexts/auth-context";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getAllTracksAsync } from "@/shared/store/track/action";
import { Chapter, ChapterLesson } from "@/shared/types/chapter";
import { Lesson } from "@/shared/types/lesson";
import { TTrackItem } from "@/shared/types/track";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";

interface LessonHeaderProps {
  chapters: Chapter[];
  lessonInfo: Lesson;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const LessonHeader = ({
  isExpanded,
  setIsExpanded,
  chapters,
  lessonInfo,
}: LessonHeaderProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useAppDispatch();
  const { result: tracks } = useAppSelector((state) => state.track);

  const listLesson = chapters?.reduce<ChapterLesson[]>((acc, cur) => {
    return [...acc, ...cur.lessons];
  }, []);

  const handleGetAllTracks = async () => {
    const query = {
      params: {
        courseId: lessonInfo?.course?._id,
      },
    };
    dispatch(getAllTracksAsync(query)).then((response) => {
      const track = response.payload.data.result.find(
        (item: TTrackItem) => item.lesson === lessonInfo?._id,
      );

      setIsChecked(!!track);
    });
  };

  useEffect(() => {
    if (lessonInfo?._id && user) handleGetAllTracks();
  }, [lessonInfo?._id, user]);
  const handleCompleteLesson = async () => {
    try {
      await createTrack({
        lessonId: lessonInfo?._id || "",
        courseId: lessonInfo?.course?._id || "",
      });
      setIsChecked(!isChecked);
      handleGetAllTracks();
      if (isChecked)
        toast.success("Hủy đánh dấu hoàn thành bài học thành công");
      else toast.success("Đánh dấu hoàn thành bài học thành công");
    } catch (error) {
      const errorMessage =
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        (isChecked
          ? "Hủy đánh dấu hoàn thành bài học thất bại"
          : "Đánh dấu hoàn thành bài học thất bại");
      toast.error(errorMessage);
    }
  };
  return (
    <header className="sticky left-0 top-0 z-10 flex h-14 items-center justify-between bg-primary px-4 py-2 font-medium text-white">
      <div className="flex items-center gap-4">
        <span
          className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/10 transition-all hover:bg-white hover:text-primary"
          onClick={() =>
            router.push(`${ROUTE_CONFIG.COURSE}/${lessonInfo?.course?.slug}`)
          }
        >
          <IoCloseSharp />
        </span>
        <span className="text-base font-bold">{lessonInfo?.course?.title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div>
            <CircularProgress
              color="success"
              showValueLabel={true}
              size="md"
              value={(tracks?.length / listLesson?.length) * 100 || 0}
            />
          </div>
          <p className="hidden text-xs font-medium md:block">
            {tracks?.length} / {listLesson?.length} bài học
          </p>
        </div>

        <Button
          color="danger"
          startContent={<FaRegCheckCircle className="shrink-0" size={20} />}
          variant="bordered"
          className="hidden rounded-lg border border-white px-4 text-white md:flex"
          onPress={handleCompleteLesson}
        >
          {isChecked ? "Hủy đánh dấu hoàn thành" : "Đánh dấu hoàn thành"}
        </Button>
        <span
          className={`flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/10 transition-all hover:bg-white hover:text-primary ${
            isExpanded ? "rotate-180 transform" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaAngleRight />
        </span>
      </div>
    </header>
  );
};

export default LessonHeader;
