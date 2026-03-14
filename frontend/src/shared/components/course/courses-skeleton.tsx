// "use client";
import React from "react";
import CardSkeleton from "../skeleton";

const CoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {new Array(6).fill(0).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CoursesSkeleton;
