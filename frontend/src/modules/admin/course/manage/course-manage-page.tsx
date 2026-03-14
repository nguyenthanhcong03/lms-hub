"use client";

import TableAction from "@/shared/components/common/table-action";
import TableActionItem from "@/shared/components/common/table-action-item";
import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";
import {
  courseLevel,
  courseLevelActions,
  courseStatus,
  courseStatusActions,
} from "@/shared/constants/course.constant";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteCourseAsync,
  deleteMultipleCourseAsync,
  getAllCoursesAsync,
} from "@/shared/store/course/action";
import { formatFilter, formatPrice } from "@/utils/common";
import { Button, Selection } from "@heroui/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { IoMdAdd } from "react-icons/io";

import { LabelStatus } from "@/shared/components/common/label-status";
import ConfirmationDialog from "@/shared/components/confirmation-dialog";
import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { DEFAULT_IMAGE, ITEMS_PER_PAGE } from "@/shared/constants";
import { CourseLevel, CourseStatus } from "@/shared/constants/enums";
import { resetInitialState } from "@/shared/store/course";
import { TCourseItem } from "@/shared/types/course";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import ModalAddEditCourse from "../components/modal-add-edit-course";

const CourseManagePage = () => {
  // =====================
  // 🔧 State Declarations
  // =====================
  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    status: CourseStatus | string;
    level: CourseLevel | string;
  }>({
    search: "",
    page: 1,
    limit: ITEMS_PER_PAGE,
    status: "",
    level: "",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: "",
  });
  const [openDeleteCourse, setOpenDeleteCourse] = useState({
    open: false,
    id: "",
  });

  const [openDeleteMultipleCourse, setOpenDeleteMultipleCourse] =
    useState(false);
  // ** redux
  const dispatch: AppDispatch = useAppDispatch();
  const {
    courses,
    pagination,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  } = useAppSelector((state) => state.course);

  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  const columns = [
    { name: "Thông tin", uid: "info" },
    { name: "Giá", uid: "price" },
    { name: "Giá gốc", uid: "old_price" },
    { name: "Lượt xem", uid: "view" },
    { name: "Bán", uid: "sold" },
    { name: "Trạng thái", uid: "status" },
    { name: "Danh mục", uid: "category" },
    { name: "Trình độ", uid: "level" },
    { name: "Hành động", uid: "actions" },
  ];
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: "",
    });
  };
  const renderCell = useCallback((item: TCourseItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TCourseItem];

    switch (columnKey) {
      case "info":
        return (
          <div className="flex w-[300px] items-center gap-3">
            <Image
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
              height={80}
              src={item?.image || DEFAULT_IMAGE}
              width={80}
            />
            <div className="flex flex-col gap-1">
              <h3 className="line-clamp-1 text-sm font-bold">{item.title}</h3>
              <h4 className="text-xs text-slate-500 lg:text-sm">
                {new Date(item.createdAt).toLocaleDateString("vi-VI")}
              </h4>
            </div>
          </div>
        );
      case "price":
        return <span className="font-bold">{formatPrice(item.price)}</span>;
      case "old_price":
        return <span className="font-bold">{formatPrice(item.old_price)}</span>;
      case "view":
        return (
          <div className="flex items-center justify-center font-bold">
            {item.view}
          </div>
        );
      case "sold":
        return (
          <div className="flex items-center justify-center font-bold">
            {item.sold}
          </div>
        );
      case "status":
        return (
          <LabelStatus color={courseStatus[item.status]?.color}>
            {courseStatus[item.status]?.label}
          </LabelStatus>
        );
      case "level":
        return (
          <div className="text-nowrap text-xs font-semibold">
            {courseLevel[item?.level]}
          </div>
        );
      case "category":
        return (
          <div className="text-xs font-semibold">{item?.category?.name}</div>
        );
      case "actions":
        return (
          <TableAction>
            <TableActionItem
              type="study"
              url={`/manage/courses/outline?id=${item._id}`}
            />
            <TableActionItem
              type="view"
              url={`${ROUTE_CONFIG.COURSE}/${item.slug}`}
            />
            <TableActionItem
              type="edit"
              onClick={() =>
                setOpenCreateEdit({
                  open: true,
                  id: item._id,
                })
              }
            />
            <TableActionItem
              type="delete"
              onClick={() =>
                setOpenDeleteCourse({
                  open: true,
                  id: item._id,
                })
              }
            />
          </TableAction>
        );

      default:
        return <span>{typeof cellValue === "string" ? cellValue : ""}</span>;
    }
  }, []);

  // Fetch API
  const handleGetListCourses = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllCoursesAsync(query));
  };

  useEffect(() => {
    handleGetListCourses();
  }, [filterBy]);

  const handleCloseConfirmDeleteCourse = () => {
    setOpenDeleteCourse({
      open: false,
      id: "",
    });
  };
  const handleCloseConfirmDeleteMultipleCourse = () => {
    setOpenDeleteMultipleCourse(false);
  };
  const handleDeleteCourse = () => {
    dispatch(deleteCourseAsync(openDeleteCourse.id));
  };
  const handleDeleteMultipleCourse = () => {
    dispatch(
      deleteMultipleCourseAsync({
        courseIds: Array.from(selectedKeys) as string[],
      }),
    );
  };

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success("Chỉnh sửa khóa học thành công");
      } else {
        toast.success("Tạo mới khóa học thành công");
      }

      handleGetListCourses();
      dispatch(resetInitialState());
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      if (typeError) {
        toast.error(messageErrorCreateEdit);
      } else {
        if (openCreateEdit.id) {
          toast.error(`Chỉnh sửa khóa học thất bại`);
        } else {
          toast.error(`Tạo mới khóa học thất bại`);
        }
      }
      dispatch(resetInitialState());
    }
  }, [
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    typeError,
    dispatch,
  ]);
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(`Xóa khóa học thành công.`);
      handleGetListCourses();
      handleCloseConfirmDeleteCourse();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa khóa học thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success("Xóa nhiều khóa học thành công.");
      handleGetListCourses();
      handleCloseConfirmDeleteMultipleCourse();
      setSelectedKeys(new Set());
      dispatch(resetInitialState());
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error("Xóa nhiều khóa học thất bại.");
      dispatch(resetInitialState());
    }
  }, [
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  ]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4">
            <CustomSelect
              placeholder="Trạng thái"
              selectedKeys={[filterBy.status]}
              onChange={(e) => {
                setFilterBy((draft) => {
                  draft.status = e.target.value;
                  draft.page = 1;
                });
              }}
              items={courseStatusActions}
            />
          </div>
          <div className="col-span-4">
            <CustomSelect
              placeholder="Trình độ"
              selectedKeys={[filterBy.level]}
              onChange={(e) => {
                setFilterBy((draft) => {
                  draft.level = e.target.value;
                  draft.page = 1;
                });
              }}
              items={courseLevelActions}
            />
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between gap-3">
          <div className="w-full max-w-[300px]">
            <InputSearch
              onSearchValue={(value: string) => {
                setFilterBy((draft) => {
                  draft.search = value;
                  draft.page = 1;
                });
              }}
            />
          </div>

          <div className="flex gap-3">
            <SelectPerPage
              limit={filterBy.limit}
              onchange={(value: string) => {
                setFilterBy((draft) => {
                  draft.limit = +value;
                  draft.page = 1;
                });
              }}
            />

            <Button
              className="h-10 flex-shrink-0 bg-primary px-5 text-base font-medium text-white"
              startContent={<IoMdAdd size={20} />}
              size="sm"
              onPress={() => setOpenCreateEdit({ open: true, id: "" })}
            >
              Thêm mới
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterBy, selectedKeys]);

  const bottomContent = useMemo(
    () =>
      courses?.length > 0 && (
        <BottomPagination
          total_pages={pagination?.total_pages}
          total_count={pagination.total_count}
          page={filterBy.page}
          startIndex={startIndex}
          endIndex={endIndex}
          onChangePage={(page: number) => {
            setFilterBy((draft) => {
              draft.page = page;
            });
          }}
        />
      ),
    [pagination, filterBy],
  );

  return (
    <>
      {openCreateEdit.open && (
        <ModalAddEditCourse
          isOpen={openCreateEdit.open}
          onOpenChange={handleCloseCreateEdit}
          idCourse={openCreateEdit.id}
        />
      )}

      {openDeleteCourse.open && (
        <ConfirmationDialog
          isOpen={openDeleteCourse.open}
          onCancel={handleCloseConfirmDeleteCourse}
          onConfirm={handleDeleteCourse}
          title={"Xóa khóa học"}
        />
      )}

      {openDeleteMultipleCourse && (
        <ConfirmationDialog
          isOpen={openDeleteMultipleCourse}
          onCancel={handleCloseConfirmDeleteMultipleCourse}
          onConfirm={handleDeleteMultipleCourse}
          title={"Xóa nhiều khóa học"}
        />
      )}

      <div className="overflow-x-auto rounded-lg p-5 shadow-medium">
        <CustomTable<TCourseItem>
          isLoading={isLoading}
          items={courses || []}
          renderCell={renderCell}
          columns={columns}
          topContent={topContent}
          bottomContent={bottomContent}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      </div>
    </>
  );
};

export default CourseManagePage;
