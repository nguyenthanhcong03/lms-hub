import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import CourseOutline from "./course-outline";
import { TCourseItem } from "@/shared/types/course";

type CourseDetailIntroProps = {
  course: TCourseItem;
};

const CourseDetailIntro = ({ course }: CourseDetailIntroProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">Giới thiệu về khóa học</h2>
        <p className="leading-7 text-default-500">{course?.description}</p>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">Nội dung khóa học</h2>
        {course?.chapters?.length > 0 && <CourseOutline course={course} />}
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">Yêu cầu</h2>
        <ul className="space-y-2">
          {course?.info?.requirements.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <FaCircleCheck className="text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">Bạn Sẽ Học Được Những Gì?</h2>
        <ul className="space-y-2">
          {course?.info?.benefits.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <FaCircleCheck className="text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetailIntro;
