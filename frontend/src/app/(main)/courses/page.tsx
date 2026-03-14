import CourseList from "@/modules/course/course-list";
import AsideFilter from "@/modules/course/course-list/components/aside-filter";
import SortCourseList from "@/modules/course/course-list/components/sort-course-list";
import CoursesSkeleton from "@/shared/components/course/courses-skeleton";

import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";

import FilterProvider from "@/shared/contexts/filter-context";
import { Suspense } from "react";

const ListCoursePageRoot = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const params = await searchParams;

  return (
    <FilterProvider>
      <AuthLayoutWrapper guestGuard={false} authGuard={false}>
        <div className="bg-gray-100 py-6">
          <div className="container">
            <div className="gap-5 lg:grid lg:grid-cols-[250px,minmax(0,1fr)] lg:pb-0">
              <div className="hidden md:block">
                <AsideFilter />
              </div>
              <div className="space-y-2">
                <SortCourseList />
                <Suspense fallback={<CoursesSkeleton />}>
                  <CourseList params={params} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </AuthLayoutWrapper>
    </FilterProvider>
  );
};

export default ListCoursePageRoot;
