"use client";
import { useFilters } from "@/shared/contexts/filter-context";
import { getAllCategories } from "@/shared/services/category";
import { TCategoryItem } from "@/shared/types/category";
import { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import { TfiMenuAlt } from "react-icons/tfi";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<TCategoryItem[]>([]);
  const { filters, updateFilters } = useFilters();

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories({
        params: {
          page: -1,
          limit: -1,
        },
      });
      const data = res?.data?.result;
      setCategories(data);
    } catch {}
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 font-bold text-primary"
        onClick={() => {
          updateFilters({
            category: "",
          });
        }}
      >
        <TfiMenuAlt />
        <div className="">Tất cả danh mục</div>
      </div>
      <div className="my-4 h-[1px] bg-gray-300" />
      <ul>
        {categories.map((item: TCategoryItem) => {
          const isActive = filters?.category === item._id;
          return (
            <div className="cursor-pointer py-2 pl-2" key={item._id}>
              <li
                onClick={() => {
                  updateFilters({
                    ...filters,
                    category: item._id,
                    page: "1",
                  });
                }}
                className={`relative px-2 ${isActive ? "font-bold text-primary" : ""}`}
              >
                {isActive && (
                  <MdArrowRight
                    size={20}
                    className="absolute left-[-12px] top-[50%] -translate-y-[50%] fill-primary"
                  />
                )}
                {item.name}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryFilter;
