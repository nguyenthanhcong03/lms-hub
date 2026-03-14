import OutlineCoursePage from "@/modules/admin/outline/manage/outline-manage-page";
import Heading from "@/shared/components/common/heading";

export interface OutlineCoursePageRootProps {
  searchParams: Promise<{ id: string }>;
}

const OutlineCoursePageRoot = async ({
  searchParams,
}: OutlineCoursePageRootProps) => {
  const { id } = await searchParams;
  return (
    <div className="space-y-5">
      <Heading>Quản lý bài học</Heading>
      <OutlineCoursePage courseId={id} />
    </div>
  );
};

export default OutlineCoursePageRoot;
