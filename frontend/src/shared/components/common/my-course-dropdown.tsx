import { ROUTE_CONFIG } from "@/shared/configs/route";
import { DEFAULT_IMAGE } from "@/shared/constants";
import { useAuth } from "@/shared/contexts/auth-context";
import { getAllMyCourses } from "@/shared/services/course";
import { TCourseItem } from "@/shared/types/course";
import {
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NoData from "./no-data";

const MyCourseDropDown = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TCourseItem[]>([]);

  const fetchMyCourses = async () => {
    const res = await getAllMyCourses();

    setCourses(res.data || []);
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyCourses();
    }
  }, [user?._id]);

  return (
    <Popover placement="bottom-end" showArrow offset={10}>
      <PopoverTrigger>Khóa học của tôi</PopoverTrigger>
      <PopoverContent>
        <Listbox
          classNames={{
            base: "w-[400px]",
            list: "max-h-[450px] py-4 overflow-y-auto",
          }}
          items={courses || []}
          topContent={
            <>
              {courses?.length > 0 && (
                <div className="flex items-center justify-between p-2">
                  <div className="font-medium">
                    {`${courses.length} khóa học`}
                  </div>
                  <Link
                    className="text-sm text-primary hover:underline"
                    href={`${ROUTE_CONFIG.COURSE}`}
                  >
                    Xem thêm
                  </Link>
                </div>
              )}
            </>
          }
          emptyContent={
            <div className="h-[250px]">
              <NoData />
            </div>
          }
          variant="flat"
          selectionMode="none"
        >
          {(item) => (
            <ListboxItem key={item._id}>
              <div className="flex items-center gap-2">
                <Link
                  href={`${ROUTE_CONFIG.COURSE}/${item?.slug}`}
                  className="relative h-16 w-24 flex-shrink-0 rounded-md"
                >
                  <Image
                    src={item?.image || DEFAULT_IMAGE}
                    alt=""
                    fill
                    className="rounded-md object-cover"
                  />
                </Link>
                <div className="w-full space-y-2">
                  <Link
                    href={`${ROUTE_CONFIG.COURSE}/${item?.slug}`}
                    className="line-clamp-2 text-sm font-semibold"
                  >
                    {item.title}
                  </Link>

                  <Progress
                    isStriped
                    size="sm"
                    classNames={{
                      track: "h-1.5",
                    }}
                    aria-label="Loading..."
                    className="w-full"
                    color="secondary"
                    value={
                      ((item?.total_completed || 0) /
                        (item?.total_lesson || 0)) *
                      100
                    }
                    showValueLabel={false}
                  />
                </div>
              </div>
            </ListboxItem>
          )}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
};

export default MyCourseDropDown;
