import CourseDetailsPage from "@/modules/course/course-details";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";

import { fetchCourseBySlug, updateCourseView } from "@/shared/services/course";

export interface CourseDetailsPageRootProps {
  params: Promise<{ slug: string }>;
}

const getDetailsCourse = async (slug: string) => {
  try {
    const res = await fetchCourseBySlug(slug);

    return res?.data;
  } catch {
    return null;
  }
};

const CourseDetailsPageRoot = async ({
  params,
}: CourseDetailsPageRootProps) => {
  const { slug } = await params;

  const [courseData] = await Promise.all([
    getDetailsCourse(slug),
    updateCourseView(slug),
  ]);

  return (
    <AuthLayoutWrapper guestGuard={false} authGuard={false}>
      <CourseDetailsPage course={courseData} />
    </AuthLayoutWrapper>
  );
};

export default CourseDetailsPageRoot;
