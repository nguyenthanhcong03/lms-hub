"use client";

import { courseLevel } from "@/shared/constants/course.constant";
import { CourseType } from "@/shared/constants/enums";
import { useAuth } from "@/shared/contexts/auth-context";
import { addItemToCart } from "@/shared/services/cart";
import { getAllTracks } from "@/shared/services/track";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCartByUserAsync } from "@/shared/store/cart/action";
import { TCourseItem } from "@/shared/types/course";
import { formatPrice, formatSecondToHHMM } from "@/utils/common";
import { Button, Chip, Progress } from "@heroui/react";
import { AxiosError } from "axios";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoCart, IoFilmOutline } from "react-icons/io5";
import { LuChartNoAxesColumnIncreasing } from "react-icons/lu";
import { PiGraduationCapBold } from "react-icons/pi";
import { toast } from "react-toastify";

interface CourseDetailRightProps {
  course: TCourseItem;
}

const CourseDetailRight = ({ course }: CourseDetailRightProps) => {
  const [tracks, setTracks] = useState([]);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const { result } = useAppSelector((state) => state.cart);

  const infos = [
    {
      title: courseLevel[course?.level],
      icon: <LuChartNoAxesColumnIncreasing />,
    },
    {
      title: `${course?.total_user} học viên`,
      icon: <PiGraduationCapBold />,
    },
    {
      title: `${formatSecondToHHMM(course?.total_duration)} Thời lượng`,
      icon: <FaRegClock />,
    },
    {
      title: `${course?.chapters?.length} chương • ${course?.total_lesson} bài học `,
      icon: <IoFilmOutline />,
    },
  ];

  const getAllTracksByCourse = async () => {
    const response = await getAllTracks({
      params: {
        courseId: course?._id,
      },
    });

    setTracks(response?.data?.result || []);
  };

  useEffect(() => {
    if (user?._id) {
      getAllTracksByCourse();
    }
  }, [user?._id, course?._id]);

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Vui lòng đăng nhập để mua khóa học");

      return;
    }

    try {
      await addItemToCart({
        courseId: course?._id,
        quantity: 1,
        price: course?.price,
      });
      dispatch(getCartByUserAsync());
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(
        error?.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      );
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (user?._id) router.push("/cart");
  };

  const isAddToCart = result?.items?.find(
    (item) => item.course?._id === course?._id,
  );
  const handleGetLastUrl = (slug: string) => {
    if (typeof localStorage === "undefined") return;
    const localLessons =
      localStorage && localStorage.getItem("lastCourseLesson")
        ? JSON.parse(localStorage.getItem("lastCourseLesson") || "[]")
        : [];
    const findCourse = localLessons?.find(
      (item: { course: string; lesson: string }) => item.course === slug,
    );
    const regex = new RegExp(/^\d+/);
    if (findCourse?.lesson && !regex.test(findCourse?.lesson)) {
      return undefined;
    }
    return findCourse?.lesson;
  };
  return (
    <div className="space-y-5">
      <div className="rounded-lg border">
        <div className="bg-[#f4f6f9] px-4 py-6">
          {user?.courses?.includes(course?._id) ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Tiến độ khóa học</h2>
              <Progress
                label={`${tracks?.length}/${course?.total_lesson}`}
                isStriped
                size="sm"
                aria-label="Loading..."
                className="w-full"
                color="secondary"
                value={(tracks?.length / course?.total_lesson) * 100 || 0}
                showValueLabel={true}
              />

              <Link
                href={{
                  pathname: `/learning/${course.slug}`,
                  query: {
                    id:
                      handleGetLastUrl(course.slug) ||
                      course?.chapters[0]?.lessons[0]?._id,
                  },
                }}
                prefetch={false}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-base font-bold text-white shadow-lg shadow-indigo-500/50"
              >
                {tracks?.length === course?.total_lesson &&
                course?.total_lesson > 0
                  ? "Đã Hoàn thành"
                  : tracks?.length > 0
                    ? "Vào học tiếp"
                    : "Bắt đầu học"}
              </Link>

              <div className="flex items-center gap-2 rounded-md border border-primary/70 bg-white p-4">
                <span className="text-primary">
                  <IoMdInformationCircleOutline size={24} />
                </span>
                <p className="font-medium text-default-500">
                  Hoàn thành tất cả các bài học để đánh dấu khóa học này là hoàn
                  thành
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block">
                  <IoCart className="text-primary" size={20} />
                </span>
                <span>Bạn đã đăng ký khóa học này</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {course?.price === 0 || course?.type === CourseType.FREE ? (
                    <strong className="text-xl text-primary">Miễn phí</strong>
                  ) : (
                    <>
                      <strong className="text-lg text-primary lg:text-xl">
                        {formatPrice(course?.price)}
                      </strong>
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(course?.old_price)}
                      </span>
                    </>
                  )}
                </div>
                <span className="inline-block rounded-lg bg-primary bg-opacity-20 px-3 py-1 text-xs font-bold text-primary">
                  {course?.price === 0 || course?.type === CourseType.FREE
                    ? "-100%"
                    : `-${
                        100 -
                        Math.floor((course?.price / course?.old_price) * 100)
                      } %`}
                </span>
              </div>
              {isAddToCart ? (
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-base font-bold text-white shadow-lg shadow-indigo-500/50"
                >
                  Đến giỏ hàng và thanh toán
                </Link>
              ) : (
                <>
                  <Button
                    onPress={handleBuyNow}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-base font-bold text-white shadow-lg shadow-indigo-500/50"
                  >
                    Mua ngay
                  </Button>
                  <Button
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-5 py-2 text-base font-bold text-primary shadow-lg"
                    onPress={handleAddToCart}
                  >
                    <IoCart className="text-primary" size={20} /> Thêm vào giỏ
                    hàng
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6 border-t px-4 py-6">
          {infos.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 font-medium text-default-500"
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-lg border bg-[#f4f6f9] px-4 py-6">
        <div className=" ">
          <h2 className="mb-2 text-lg font-bold">Các tài liệu khoá học</h2>
          <ul className="list-inside list-disc space-y-1">
            {course?.info?.documents?.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">
                  <IoMdInformationCircleOutline size={20} />
                </span>
                <Link
                  href={item}
                  target="_blank"
                  className="text-sm font-medium text-default-500 hover:text-primary"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 pb-2 text-lg font-bold">Công nghệ</h4>
          <ul className="list-inside list-disc space-x-4">
            {course?.info?.techniques?.map((item, index) => (
              <Chip
                key={index}
                classNames={{
                  base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  content: "drop-shadow shadow-black text-white",
                }}
                variant="shadow"
              >
                {item}
              </Chip>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailRight;
