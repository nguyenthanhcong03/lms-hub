import CourseItem from "@/shared/components/course/course-item";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { TCourseItem } from "@/shared/types/course";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

interface ListCourseSectionProps {
  courses: TCourseItem[];
}

const ListCourseSection = ({ courses }: ListCourseSectionProps) => {
  return (
    <div className="my-10">
      <div className="flex items-center justify-between pb-5">
        <h2 className="my-2 border-l-4 border-primary pl-2 font-sans text-2xl font-bold md:text-3xl">
          Các khoá học chất lượng
        </h2>
        <Link
          href={ROUTE_CONFIG.COURSE}
          prefetch={false}
          className="group flex items-center gap-1 text-sm font-semibold text-primary"
        >
          <span className="hover:underline"> Xem thêm</span>
          <span className="transition-all group-hover:translate-x-1">
            <FaAngleRight size={18} />
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {courses.map((item, index) => (
          <div key={index}>
            <CourseItem course={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCourseSection;
