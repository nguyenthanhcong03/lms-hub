import { searchCourses } from "@/shared/services/course";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InputSearch from "../input-search";
import ModalNextUI from "../modal";
import { TCourseItem } from "@/shared/types/course";
import { DEFAULT_IMAGE } from "@/shared/constants";

type SearchBoxProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const SearchBoxModal = ({ isOpen, onOpenChange }: SearchBoxProps) => {
  const [courses, setCourses] = useState<TCourseItem[]>([]);

  const fetchCourseSearch = async (searchValue: string) => {
    const response = await searchCourses({ params: { search: searchValue } });
    setCourses(response.data || []);
  };

  return (
    <ModalNextUI
      title={"Thêm mới mã giảm giá"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      btnSubmitText={"Thêm mới"}
      isFooter={false}
      isHeader={false}
    >
      <div className="mb-2 mt-4">
        <InputSearch onSearchValue={fetchCourseSearch} />
      </div>
      {courses.length > 0 ? (
        <ul className="flex flex-col divide-y divide-gray-200 overflow-y-auto">
          {courses.map((item, index) => (
            <Link
              href={`/courses/${item?.slug}`}
              key={index}
              className="flex items-center gap-2 p-3 hover:rounded hover:bg-gray-100"
            >
              <div className="relative h-10 w-10 flex-shrink-0 rounded-full">
                <Image
                  src={item?.image || DEFAULT_IMAGE}
                  alt="logo"
                  fill
                  className="rounded-full"
                />
              </div>
              <p className="line-clamp-2 text-sm font-medium">{item?.title}</p>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="p-3 text-center">Không tìm thấy kết quả</p>
      )}
    </ModalNextUI>
  );
};

export default SearchBoxModal;
