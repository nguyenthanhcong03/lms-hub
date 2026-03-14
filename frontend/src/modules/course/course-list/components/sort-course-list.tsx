"use client";

import CustomSelect from "@/shared/components/form/custom-select";
import { useFilters } from "@/shared/contexts/filter-context";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  useDisclosure,
} from "@heroui/react";
import { useTransition } from "react";
import { CiFilter } from "react-icons/ci";
import AsideFilter from "./aside-filter";
const SortCourseList = () => {
  const tabs = [
    {
      label: "Mới nhất",
      value: "ctime",
    },
    {
      label: "Phổ biến",
      value: "view",
    },

    {
      label: "Bán chạy",
      value: "sold",
    },
  ];
  const { isOpen, onOpenChange } = useDisclosure();
  const { filters, updateFilters } = useFilters();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Drawer
        placement="left"
        radius="none"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.3 },
            },
            exit: {
              x: 100,
              opacity: 0,
              transition: { duration: 0.3 },
            },
          },
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerBody>
                <AsideFilter />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <div className="rounded bg-gray-300/40 p-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">Sắp xếp theo</div>
          {tabs.map((item, index) => (
            <Button
              onPress={() => {
                startTransition(() => {
                  updateFilters({ order: "", page: "1", sort_by: item.value });
                });
              }}
              key={index}
              radius="sm"
              size="md"
              className={`${
                filters.sort_by === item.value
                  ? "bg-primary text-white"
                  : "bg-white text-black"
              } text-sm md:text-base`}
              color="primary"
            >
              {item.label}
            </Button>
          ))}

          <div className="w-[180px]">
            <CustomSelect
              placeholder="Giá"
              selectedKeys={[filters.order || ""]}
              classNames={{
                trigger: `${filters.order ? "bg-primary border-0 text-white hover:bg-primary/80 text-white" : "bg-white text-black hover:bg-slate-100"}`,
                innerWrapper: `${filters.order ? "[&>span]:!text-white" : "[&>span]:text-black"}`,
              }}
              onChange={(e) => {
                startTransition(() => {
                  updateFilters({
                    order: e.target.value,
                    page: "1",
                    sort_by: e.target.value ? "price" : "ctime",
                  });
                });
              }}
              items={[
                { label: "Giá: Thấp đến cao", value: "asc" },
                { label: "Giá: Cao đến thấp", value: "desc" },
              ]}
            />
          </div>
          <button onClick={onOpenChange} className="block md:hidden">
            <CiFilter size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SortCourseList;
