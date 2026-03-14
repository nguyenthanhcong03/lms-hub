import CourseItem from "@/shared/components/course/course-item";
import NoData from "@/shared/components/common/no-data";
import { getAllPublicCourses } from "@/shared/services/course";

import { TCourseItem, TParamsGetCourses } from "@/shared/types/course";
import Pagination from "./components/pagination";

const fetchListCourses = async ({ params }: { params: TParamsGetCourses }) => {
  try {
    const res = await getAllPublicCourses({ params });

    const data = res.data;

    return {
      courses: data.courses,
      pagination: data.pagination,
    };
  } catch {
    return {
      courses: [],
      pagination: { total_count: 0, total_pages: 0, page: 0, per_page: 0 },
    };
  }
};
const CourseList = async ({ params }: { params: TParamsGetCourses }) => {
  const { courses, pagination } = await fetchListCourses({
    params,
  });

  return (
    <>
      {courses?.length > 0 ? (
        <div className="">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {courses?.length > 0 &&
              courses?.map((item: TCourseItem, index: number) => (
                <CourseItem key={index} course={item} />
              ))}
          </div>
          {pagination?.total_pages && (
            <div className="mt-5">
              <Pagination total_pages={pagination?.total_pages} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <NoData />
        </div>
      )}
    </>
  );
};

export default CourseList;
