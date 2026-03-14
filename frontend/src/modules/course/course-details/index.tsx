import dynamic from "next/dynamic";

import { TCourseItem } from "@/shared/types/course";

const CourseDetailLeft = dynamic(
  () => import("./components/course-detail-left"),
);

const CourseDetailRight = dynamic(
  () => import("./components/course-detail-right"),
);

interface CourseDetailsPageProps {
  course: TCourseItem;
}

const CourseDetailsPage = ({ course }: CourseDetailsPageProps) => {
  return (
    <div className="container grid items-start gap-10 py-10 lg:grid-cols-[2fr,1fr]">
      <CourseDetailLeft course={course} />

      <CourseDetailRight course={course} />
    </div>
  );
};

export default CourseDetailsPage;
