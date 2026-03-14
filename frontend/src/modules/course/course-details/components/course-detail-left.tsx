"use client";
import Image from "next/image";

import { useState } from "react";

import { Avatar, Tab, Tabs } from "@heroui/react";
// import CourseDetailIntro from "./course-detail-intro";
const CourseDetailIntro = dynamic(() => import("./course-detail-intro"));
// import CourseDetailReview from "./course-detail-review";
const CourseDetailReview = dynamic(() => import("./course-detail-review"));
import { TCourseItem } from "@/shared/types/course";
import dynamic from "next/dynamic";

interface CourseDetailLeftProps {
  course: TCourseItem;
}

const CourseDetailLeft = ({ course }: CourseDetailLeftProps) => {
  const [selected, setSelected] = useState<string>("intro");
  const embed = course?.intro_url?.includes("v=")
    ? course?.intro_url?.split("v=")[1]?.split("&")[0]
    : course?.intro_url?.split("/").at(-1);
  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold lg:text-3xl">{course?.title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar size="sm" radius="full" src={course?.author?.avatar || ""} />
          <div className="space-x-1">
            <span className="text-sm text-gray-500">Tạo bởi:</span>
            <span className="font-bold">{course?.author?.username}</span>
          </div>
        </div>
        <div className="space-x-1">
          <span className="text-sm text-gray-500">Thể loại:</span>
          <span className="font-bold">{course?.category?.name}</span>
        </div>
      </div>
      {course?.intro_url ? (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${embed}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video h-full w-full rounded-lg object-cover"
          ></iframe>
        </>
      ) : (
        <div className="relative w-full pt-[50%]">
          <Image
            alt=""
            fill
            src={course?.image || ""}
            className="h-full w-full rounded-lg object-cover"
            priority
          />
        </div>
      )}
      <div className="space-y-5">
        <Tabs
          classNames={{
            base: "w-full border-b",
            tabList: "gap-6 w-full relative rounded-none p-0 ",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12 text-base  ",
            tabContent:
              "group-data-[selected=true]:text-primary font-bold hover:!text-primary ",
          }}
          color="primary"
          variant="underlined"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
        >
          <Tab
            key="intro"
            title={
              <div className="flex items-center space-x-2">Giới thiệu</div>
            }
          />
          <Tab
            key="review"
            title={<div className="flex items-center space-x-2">Đánh giá</div>}
          />
        </Tabs>

        {selected === "intro" ? (
          <CourseDetailIntro course={course} />
        ) : (
          <CourseDetailReview courseId={course?._id} />
        )}
      </div>
    </div>
  );
};

export default CourseDetailLeft;
