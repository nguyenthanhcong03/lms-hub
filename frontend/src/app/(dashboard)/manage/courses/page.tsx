import Heading from "@/shared/components/common/heading";
import CourseManagePage from "@/modules/admin/course/manage/course-manage-page";

const CoursePageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý khóa học</Heading>
      <CourseManagePage />
    </div>
  );
};

export default CoursePageRoot;
