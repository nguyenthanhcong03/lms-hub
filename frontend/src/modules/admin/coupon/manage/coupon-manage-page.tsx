"use client";

import TableAction from "@/shared/components/common/table-action";
import TableActionItem from "@/shared/components/common/table-action-item";
import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteCouponAsync,
  deleteMultipleCouponAsync,
  getAllCouponsAsync,
} from "@/shared/store/coupon/action";
import { formatFilter, formatPrice } from "@/utils/common";
import { Button, Selection } from "@heroui/react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { IoMdAdd } from "react-icons/io";

import ConfirmationDialog from "@/shared/components/confirmation-dialog";
import {
  couponStatus,
  couponStatusActions,
} from "@/shared/constants/coupon.constant";
import { CouponType } from "@/shared/constants/enums";
import { resetInitialState } from "@/shared/store/coupon";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { LabelStatus } from "@/shared/components/common/label-status";
import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";
import { Coupon } from "@/shared/types/coupon";
import { useImmer } from "use-immer";
import ModalAddEditCoupon from "../components/modal-add-edit-coupon";

const CouponManagePage = () => {
  // =====================
  // 🔧 State Declarations
  // =====================
  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    status: string;
  }>({
    search: "",
    page: 1,
    limit: 10,
    status: "",
  });

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [openDeleteMultipleCoupon, setOpenDeleteMultipleCoupon] =
    useState(false);

  const [openCreateEdit, setOpenCreateEdit] = useState({ open: false, id: "" });
  const [openDeleteCoupon, setOpenDeleteCoupon] = useState({
    open: false,
    id: "",
  });

  // =====================
  // 🔁 Redux
  // =====================

  const dispatch: AppDispatch = useAppDispatch();
  const {
    coupons,
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
  } = useAppSelector((state) => state.coupon);

  // =====================
  // 📊 Table Columns
  // =====================

  const columns = [
    { name: "Mã", uid: "code" },
    { name: "Tiêu đề", uid: "title" },
    { name: "Giảm giá", uid: "value" },
    { name: "Sử dụng", uid: "max_uses" },
    { name: "Trạng thái", uid: "status" },
    { name: "Hành động", uid: "actions" },
  ];

  // =====================
  // 📈 Pagination
  // =====================

  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  // =====================
  // 🧠 Memoized Cell Renderer
  // =====================

  const renderCell = useCallback((item: Coupon, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Coupon];

    switch (columnKey) {
      case "code":
      case "title":
        return <span className="font-medium">{cellValue}</span>;

      case "value":
        return (
          <span className="font-medium">
            {item.type === CouponType.FIXED
              ? formatPrice(item?.value)
              : `${cellValue}%`}
          </span>
        );

      case "max_uses":
        return (
          <span className="font-medium">
            {item.used} / {item.max_uses}
          </span>
        );

      case "status":
        return (
          <LabelStatus color={couponStatus[item.status]?.color}>
            {couponStatus[item.status]?.label}
          </LabelStatus>
        );

      case "actions":
        return (
          <TableAction>
            <TableActionItem
              type="edit"
              onClick={() => setOpenCreateEdit({ open: true, id: item?._id })}
            />
            <TableActionItem
              type="delete"
              onClick={() => setOpenDeleteCoupon({ open: true, id: item?._id })}
            />
          </TableAction>
        );

      default:
        return cellValue;
    }
  }, []);

  // =====================
  // 🚀 Fetch Coupons
  // =====================

  const handleGetListCoupons = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };
    dispatch(getAllCouponsAsync(query));
  };

  // =====================
  // 📦 Modal Handlers
  // =====================

  const handleCloseCreateEdit = () =>
    setOpenCreateEdit({ open: false, id: "" });
  const handleCloseConfirmDeleteCoupon = () =>
    setOpenDeleteCoupon({ open: false, id: "" });
  const handleCloseConfirmDeleteMultipleCoupon = () =>
    setOpenDeleteMultipleCoupon(false);

  const handleDeleteCoupon = () =>
    dispatch(deleteCouponAsync(openDeleteCoupon.id));
  const handleDeleteMultipleCoupon = () =>
    dispatch(
      deleteMultipleCouponAsync({
        couponIds: Array.from(selectedKeys) as string[],
      }),
    );

  // =====================
  // 🧠 Side Effects
  // =====================

  useEffect(() => {
    handleGetListCoupons();
  }, [filterBy]);

  useEffect(() => {
    if (isSuccessCreateEdit) {
      toast.success(
        openCreateEdit.id
          ? "Chỉnh sửa mã giảm giá thành công"
          : "Tạo mới mã giảm giá thành công",
      );
      handleGetListCoupons();
      dispatch(resetInitialState());
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      toast.error(
        typeError
          ? messageErrorCreateEdit
          : openCreateEdit.id
            ? "Chỉnh sửa mã giảm giá thất bại"
            : "Tạo mới mã giảm giá thất bại",
      );
      dispatch(resetInitialState());
    }
  }, [
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    typeError,
  ]);

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success("Xóa mã giảm giá thành công.");
      handleGetListCoupons();
      handleCloseConfirmDeleteCoupon();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error("Xóa mã giảm giá thất bại.");
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success("Xóa nhiều mã giảm giá thành công.");
      handleGetListCoupons();
      handleCloseConfirmDeleteMultipleCoupon();
      setSelectedKeys(new Set());
      dispatch(resetInitialState());
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error("Xóa nhiều mã giảm giá thất bại.");
      dispatch(resetInitialState());
    }
  }, [
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  ]);

  // =====================
  // 🧩 Top Content (Filters, Buttons)
  // =====================

  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4">
            <CustomSelect
              placeholder="Trạng thái"
              onChange={(e) => {
                setFilterBy((draft) => {
                  draft.status = e.target.value;
                  draft.page = 1;
                });
              }}
              items={couponStatusActions}
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
              className="h-10 flex-shrink-0 bg-primary px-4 text-base font-medium text-white"
              startContent={<IoMdAdd size={20} />}
              size="sm"
              onPress={() => setOpenCreateEdit({ open: true, id: "" })}
            >
              Thêm mới
            </Button>
            {[...selectedKeys]?.length > 0 && (
              <Button
                className="h-10 bg-red-500 px-5 text-base font-medium text-white"
                startContent={<FaRegTrashAlt size={18} />}
                size="sm"
                onPress={() => setOpenDeleteMultipleCoupon(true)}
              >
                Xóa nhiều
              </Button>
            )}
          </div>
        </div>
      </div>
    ),
    [filterBy, selectedKeys],
  );

  // =====================
  // 🔻 Bottom Pagination
  // =====================

  const bottomContent = useMemo(
    () =>
      coupons?.length > 0 && (
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
  // =====================
  // 🧾 Render Component
  // =====================

  return (
    <>
      {openCreateEdit.open && (
        <ModalAddEditCoupon
          isOpen={openCreateEdit.open}
          onOpenChange={handleCloseCreateEdit}
          idCoupon={openCreateEdit.id}
        />
      )}

      {openDeleteCoupon.open && (
        <ConfirmationDialog
          isOpen={openDeleteCoupon.open}
          onCancel={handleCloseConfirmDeleteCoupon}
          onConfirm={handleDeleteCoupon}
          title={"Xóa danh mục"}
        />
      )}

      {openDeleteMultipleCoupon && (
        <ConfirmationDialog
          isOpen={openDeleteMultipleCoupon}
          onCancel={handleCloseConfirmDeleteMultipleCoupon}
          onConfirm={handleDeleteMultipleCoupon}
          title={"Xóa nhiều danh mục"}
        />
      )}

      <div className="rounded-lg p-5 shadow-medium">
        <CustomTable
          isLoading={isLoading}
          items={coupons || []}
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
export default CouponManagePage;
