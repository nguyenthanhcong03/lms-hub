"use client";
import { Skeleton } from "@heroui/react";

const CourseDetailLeftSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <Skeleton className="h-8 w-3/4 rounded-md" />

      {/* Author and Category */}
      <div className="flex items-center gap-4">
        {/* Avatar + Author */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>

      {/* Video or Image Placeholder */}
      <Skeleton className="aspect-video w-full rounded-lg" />

      {/* Tabs */}
      <div className="space-y-5">
        <div className="flex gap-6 border-b">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        {/* Tab content */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailLeftSkeleton;
