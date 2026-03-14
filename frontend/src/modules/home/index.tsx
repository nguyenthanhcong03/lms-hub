import { getAllPublicCourses } from "@/shared/services/course";
import ListCourseSection from "./components/list-course-section";

const fetchListCourses = async () => {
  const page = 1;
  const limit = 10;

  try {
    const res = await getAllPublicCourses({ params: { page, limit } });

    const data = res.data;

    return {
      courses: data.courses,
    };
  } catch {
    return {
      courses: [],
    };
  }
};
const HomeCourseList = async () => {
  const { courses } = await fetchListCourses();
  return <ListCourseSection courses={courses} />;
};

export default HomeCourseList;
