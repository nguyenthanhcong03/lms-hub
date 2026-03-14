import { DEFAULT_IMAGE } from "@/shared/constants";
import { TCourseItem } from "@/shared/types/course";
import { Progress } from "@heroui/react";
import Image from "next/image";
import React from "react";
import ReactStars from "react-stars";

type CourseItemProps = {
  course: TCourseItem;
};

const CourseItem = ({ course }: CourseItemProps) => {
  return (
    <div className="flex h-[200px] w-full items-center gap-2 rounded-md border shadow">
      <div className="relative h-full w-[300px]">
        <Image
          src={course?.image || DEFAULT_IMAGE}
          alt="cover-image"
          fill
          className="rounded-md"
        />
      </div>
      <div className="flex-1 space-y-2 p-5">
        <div className="flex items-center gap-2">
          <ReactStars
            value={course?.average_star}
            count={5}
            size={24}
            color2={"#ffca11"}
            edit={false}
          />
          <span>
            <span className="text-gray-500">
              {course?.average_star?.toFixed(2)}{" "}
            </span>
          </span>
        </div>

        <h2 className="text-lg font-semibold">{course?.title}</h2>
        <p>
          Số bài đã hoàn thành: {course?.total_completed}/{course?.total_lesson}{" "}
          bài học
        </p>

        <Progress
          isStriped
          size="sm"
          classNames={{
            track: "h-1.5",
          }}
          aria-label="Loading..."
          className="w-full"
          color="secondary"
          showValueLabel={true}
          value={
            ((course?.total_completed || 0) / course?.total_lesson) * 100 || 0
          }
        />
      </div>
    </div>
  );
};

export default CourseItem;
