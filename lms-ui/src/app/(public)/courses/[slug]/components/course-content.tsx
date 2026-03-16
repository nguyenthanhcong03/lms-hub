"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import type { IPublicCourse } from "@/types/course";

import CourseOverview from "./course-overview";
import CourseCurriculum from "./course-curriculum";
import EnrollmentCard from "./enrollment-card";

import { usePublicCourseChapters } from "@/hooks/use-chapters";

// Dynamic import cho component nặng (review + interaction)
const CourseReviews = dynamic(() => import("./course-reviews"), {
  ssr: false,
});

interface CourseContentProps {
  course: IPublicCourse;
}

const CourseContent = ({ course }: CourseContentProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: chapters = [], isLoading } = usePublicCourseChapters(course._id);

  // Lấy lesson đầu tiên của khóa học
  const lastLessonId = chapters?.[0]?.lessons?.[0]?._id ?? "";

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Sidebar Mobile */}
        <div className="lg:hidden">
          <EnrollmentCard course={course} lastLessonId={lastLessonId} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Tổng quan khóa học */}
          <CourseOverview course={course} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Nội dung khóa học */}
          <CourseCurriculum chapters={chapters} isLoading={isLoading} />

          {/* Đánh giá khóa học */}
          <CourseReviews
            courseTitle={course.title}
            courseId={course._id}
            fallbackAverageRating={course.averageRating || 0}
            fallbackTotalReviews={course.totalReviews || 0}
          />
        </div>

        {/* Sidebar Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <EnrollmentCard course={course} lastLessonId={lastLessonId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
