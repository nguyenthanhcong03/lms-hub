"use client";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { DEFAULT_IMAGE } from "@/shared/constants";
import { courseLevel } from "@/shared/constants/course.constant";
import { TCourseItem } from "@/shared/types/course";
import { formatPrice, formatSecondToHHMM } from "@/utils/common";
import { Button } from "@heroui/react";

import Image from "next/image";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";
import { LabelStatus } from "../common/label-status";

interface CourseItemProps {
  course: TCourseItem;
}

const CourseItem = ({ course }: CourseItemProps) => {
  return (
    <Link
      className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
      href={`${ROUTE_CONFIG.COURSE}/${course?.slug}`}
    >
      <div className="relative flex overflow-hidden rounded-xl p-2">
        <div className="relative h-48 w-full">
          <Image
            className="rounded-xl object-cover"
            src={course?.image || DEFAULT_IMAGE}
            alt="product image"
            fill
            priority
          />
        </div>
        <div className="absolute left-2 top-2">
          <LabelStatus color="primary" size="sm">
            {courseLevel[course?.level]}
          </LabelStatus>
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col space-y-2 px-5 pb-5">
        <div className="flex-1">
          <h5 className="line-clamp-2 font-bold text-slate-900">
            {course?.title}
          </h5>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-default-500 line-through">
            {formatPrice(course?.old_price)}
          </span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(course?.price)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm font-medium text-default-500">
          <div className="flex items-center gap-1">
            <HiOutlineUserGroup size={18} />
            <span>{course?.total_user}</span>
          </div>
          <div className="flex items-center gap-1">
            <IoEyeOutline size={18} />
            <span>{course?.view}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegClock />
            <span>{formatSecondToHHMM(course?.total_duration)}</span>
          </div>
        </div>
        <Button className="[hover=true]:!opacity-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary/90 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none">
          Xem chi tiết
        </Button>
      </div>
    </Link>
  );
};

export default CourseItem;
