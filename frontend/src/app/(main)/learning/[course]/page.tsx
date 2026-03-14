import LessonDetailsPage from "@/modules/lesson";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";
import BlankLayout from "@/shared/layouts/blank-layout";

interface LessonDetailsPageRootProps {
  searchParams: Promise<{ id: string }>;
  params: Promise<{ course: string }>;
}

const LessonDetailsPageRoot = async ({
  searchParams,
  params,
}: LessonDetailsPageRootProps) => {
  const { id } = await searchParams;
  const { course } = await params;

  return (
    <AuthLayoutWrapper
      authGuard={true}
      getLayout={(page) => <BlankLayout>{page}</BlankLayout>}
    >
      <LessonDetailsPage courseSlug={course} lessonId={id} />
    </AuthLayoutWrapper>
  );
};

export default LessonDetailsPageRoot;
