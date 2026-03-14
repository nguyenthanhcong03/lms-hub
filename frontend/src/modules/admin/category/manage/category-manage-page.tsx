"use client";

import TableAction from "@/shared/components/common/table-action";
import TableActionItem from "@/shared/components/common/table-action-item";

import CustomTable from "@/shared/components/table";
import { DEFAULT_AVATAR } from "@/shared/constants";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteCategoryAsync,
  deleteMultipleCategoryAsync,
  getAllCategoriesAsync,
} from "@/shared/store/category/action";
import { Button, Selection } from "@heroui/react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { IoMdAdd } from "react-icons/io";

import ConfirmationDialog from "@/shared/components/confirmation-dialog";

import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";
import { resetInitialState } from "@/shared/store/category";
import { TCategoryItem } from "@/shared/types/category";
import { formatFilter } from "@/utils/common";
import moment from "moment";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import ModalAddEditCategory from "../components/modal-add-edit-category";

const CategoryManagePage = () => {
  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
  }>({
    search: "",
    page: 1,
    limit: 10,
  });
  const [openDeleteMultipleCategory, setOpenDeleteMultipleCategory] =
    useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const [openCreateEdit, setOpenCreateEdit] = useState<{
    open: boolean;
    id: string;
    itemData: TCategoryItem | null;
  }>({
    open: false,
    id: "",
    itemData: null,
  });
  const [openDeleteCategory, setOpenDeleteCategory] = useState({
    open: false,
    id: "",
  });

  // ** redux
  const dispatch: AppDispatch = useAppDispatch();
  const {
    categories,
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
  } = useAppSelector((state) => state.category);

  // Calculate start and end indices
  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  const columns = [
    { name: "Tên danh mục", uid: "name" },
    { name: "Người tạo", uid: "createdBy" },
    { name: "Ngày tạo", uid: "createdAt" },
    { name: "Hành động", uid: "actions" },
  ];
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: "",
      itemData: null,
    });
  };
  const renderCell = useCallback(
    (item: TCategoryItem, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof TCategoryItem];

      switch (columnKey) {
        case "createdBy":
          return (
            <div className="flex items-center gap-3">
              <Image
                src={item?.createdBy?.avatar || DEFAULT_AVATAR}
                alt={""}
                width={64}
                height={64}
                className="borderDarkMode size-10 flex-shrink-0 rounded-full object-cover"
              />
              <div className="whitespace-nowrap">
                <h4 className="line-clamp-2 block max-w-[400px] whitespace-nowrap text-sm font-bold">
                  {item?.createdBy?.username}
                </h4>
                <h5 className="font-medium">{item?.createdBy?.email}</h5>
              </div>
            </div>
          );
        case "name":
          return <span className="font-medium">{item?.name}</span>;

        case "createdAt":
          return <span>{moment(item?.createdAt).format("DD/MM/YYYY")}</span>;

        case "actions":
          return (
            <TableAction>
              <TableActionItem
                type="edit"
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: item?._id,
                    itemData: item,
                  })
                }
              />
              <TableActionItem
                type="delete"
                onClick={() =>
                  setOpenDeleteCategory({
                    open: true,
                    id: item?._id,
                  })
                }
              />
            </TableAction>
          );

        default:
          return <span>{typeof cellValue === "string" ? cellValue : ""}</span>;
      }
    },
    [],
  );

  // Fetch API
  const handleGetListCategories = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllCategoriesAsync(query));
  };
  const handleCloseConfirmDeleteCategory = () => {
    setOpenDeleteCategory({
      open: false,
      id: "",
    });
  };
  const handleCloseConfirmDeleteMultipleCategory = () => {
    setOpenDeleteMultipleCategory(false);
  };
  const handleDeleteCategory = () => {
    dispatch(deleteCategoryAsync(openDeleteCategory.id));
  };
  const handleDeleteMultipleCategory = () => {
    dispatch(
      deleteMultipleCategoryAsync({
        categoryIds: Array.from(selectedKeys) as string[],
      }),
    );
  };

  useEffect(() => {
    handleGetListCategories();
  }, [filterBy]);

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success("Chỉnh sửa danh mục thành công");
      } else {
        toast.success("Tạo mới danh mục thành công");
      }
      handleGetListCategories();
      dispatch(resetInitialState());
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      if (typeError) {
        toast.error(messageErrorCreateEdit);
      } else {
        if (openCreateEdit.id) {
          toast.error(`Chỉnh sửa danh mục thất bại`);
        } else {
          toast.error(`Tạo mới danh mục thất bại`);
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
      toast.success(`Xóa danh mục thành công.`);

      handleGetListCategories();
      handleCloseConfirmDeleteCategory();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa danh mục thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success("Xóa nhiều danh mục thành công.");
      handleGetListCategories();
      handleCloseConfirmDeleteMultipleCategory();
      setSelectedKeys(new Set());
      dispatch(resetInitialState());
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error("Xóa nhiều mã danh mục thất bại.");
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
              className="h-10 flex-shrink-0 bg-primary px-4 text-base font-medium text-white"
              startContent={<IoMdAdd size={20} />}
              size="sm"
              onPress={() =>
                setOpenCreateEdit({ open: true, id: "", itemData: null })
              }
            >
              Thêm mới
            </Button>
            {[...selectedKeys]?.length > 0 && (
              <Button
                className="h-10 flex-shrink-0 bg-red-500 px-4 text-base font-medium text-white"
                startContent={<FaRegTrashAlt size={18} />}
                size="sm"
                onPress={() => setOpenDeleteMultipleCategory(true)}
              >
                Xóa
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }, [filterBy, selectedKeys]);

  const bottomContent = useMemo(
    () =>
      categories?.length > 0 && (
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
        <ModalAddEditCategory
          isOpen={openCreateEdit.open}
          onOpenChange={handleCloseCreateEdit}
          idCategory={openCreateEdit.id}
          itemData={openCreateEdit.itemData}
        />
      )}

      {openDeleteCategory.open && (
        <ConfirmationDialog
          isOpen={openDeleteCategory.open}
          onCancel={handleCloseConfirmDeleteCategory}
          onConfirm={handleDeleteCategory}
          title={"Xóa danh mục"}
        />
      )}

      {openDeleteMultipleCategory && (
        <ConfirmationDialog
          isOpen={openDeleteMultipleCategory}
          onCancel={handleCloseConfirmDeleteMultipleCategory}
          onConfirm={handleDeleteMultipleCategory}
          title={"Xóa nhiều danh mục"}
        />
      )}

      <div className="rounded-lg p-5 shadow-medium">
        <CustomTable<TCategoryItem>
          isLoading={isLoading}
          items={categories || []}
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

export default CategoryManagePage;
