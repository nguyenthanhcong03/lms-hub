"use client";

import React from "react";
import { MdAccessTime, MdDescription, MdPeople, MdVisibility } from "react-icons/md";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/utils/format";

interface CourseStatisticsProps {
  totalChapters: number;
  totalLessons: number;
  publishedLessons: number;
  totalDuration: number;
  isLoading: boolean;
}

const CourseStatistics = ({
  totalChapters,
  totalLessons,
  publishedLessons,
  totalDuration,
  isLoading,
}: CourseStatisticsProps) => {
  const completionPercentage = totalLessons > 0 ? Math.round((publishedLessons / totalLessons) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Chu thich tieng Viet */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MdPeople className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Chương</p>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-7 w-8" /> : totalChapters}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chu thich tieng Viet */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <MdDescription className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Bài học</p>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-12" /> : `${publishedLessons}/${totalLessons}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chu thich tieng Viet */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MdAccessTime className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Thời lượng</p>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-16" /> : formatDuration(totalDuration)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chu thich tieng Viet */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <MdVisibility className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Đã xuất bản</p>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-12" /> : `${completionPercentage}%`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseStatistics;


