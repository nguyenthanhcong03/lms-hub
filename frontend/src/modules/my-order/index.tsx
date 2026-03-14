"use client";

import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import { getAllOrdersOfMeAsync } from "@/shared/store/order/action";
import { cn, formatFilter } from "@/utils/common";
import { Selection } from "@heroui/react";
import Swal from "sweetalert2";

import { useCallback, useEffect, useMemo, useState } from "react";

import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";

import { LabelStatus } from "@/shared/components/common/label-status";
import { OrderStatus } from "@/shared/constants/enums";
import {
  orderStatus,
  orderStatusActions,
} from "@/shared/constants/order.constant";
import { updateOrder } from "@/shared/services/order";
import { ITEMS_PER_PAGE } from "@/shared/constants";
import { TOrder } from "@/shared/types/order";
import { formatThousand } from "@/utils";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import OrderAction from "../admin/order/components/order-action";

const MyOrderPage = () => {
  // =====================
  // 🔧 State Declarations
  // =====================

  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    status: OrderStatus | string;
  }>({
    search: "",
    page: 1,
    limit: ITEMS_PER_PAGE,
    status: "",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  // ** redux
  const dispatch: AppDispatch = useAppDispatch();
  const { orders, pagination, isLoading } = useAppSelector(
    (state) => state.order,
  );

  const handleCancelOrder = ({
    orderId,
    code,
    status,
  }: {
    orderId: string;
    code: string;
    status: OrderStatus;
  }) => {
    Swal.fire({
      title: `Bạn muốn hủy bỏ đơn hàng ${code}?`,
      text: "Vui lòng kiểm tra kỹ trước khi thực hiện",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    })
      .then(async (orders) => {
        if (orders.isConfirmed) {
          await updateOrder({ id: orderId, status });
          handleGetListOrdersOfMe();
          toast.success("Cập nhật đơn hàng thành công");
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  // =====================
  // 📈 Pagination
  // =====================

  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  const columns = [
    { name: "Mã đơn hàng", uid: "code" },
    { name: "Khóa học", uid: "course" },
    { name: "Số tiền", uid: "total" },
    { name: "Mã giảm giá", uid: "coupon" },
    { name: "Trạng thái", uid: "status" },
    { name: "Hành động", uid: "actions" },
  ];

  const renderCell = useCallback((item: TOrder, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TOrder];

    const itemOrderStatus = {
      isCompleted: item.status === OrderStatus.COMPLETED,
      isPending: item.status === OrderStatus.PENDING,
      isCanceled: item.status === OrderStatus.CANCELED,
    };
    switch (columnKey) {
      case "code":
        return <span className="font-bold">{item?.code}</span>;
      case "course":
        return <span className="font-bold">{item.course?.title}</span>;

      case "total":
        return (
          <>
            {itemOrderStatus?.isCanceled && (
              <p className="font-bold text-red-500">
                {formatThousand(item.total)}
              </p>
            )}
            {!itemOrderStatus.isCanceled && (
              <div className="flex flex-col items-start gap-2">
                {item.amount > 0 && item.total > 0 && (
                  <p className="font-medium">{formatThousand(item.amount)}</p>
                )}
                {item.total <= 0 ? (
                  <p className="font-medium text-primary">Miễn phí</p>
                ) : (
                  <p
                    className={cn(
                      "font-bold",
                      itemOrderStatus.isCompleted
                        ? "text-green-500"
                        : "text-orange-500",
                    )}
                  >
                    {formatThousand(item.total)}
                  </p>
                )}
              </div>
            )}
          </>
        );
      case "coupon":
        return (
          <>
            {!!item.coupon?.code && (
              <div className="flex flex-col gap-2">
                <div className="font-bold">{item.coupon?.code}</div>
                <div className="font-bold text-green-500">
                  -{formatThousand(item?.discount || 0)}
                </div>
              </div>
            )}
          </>
        );
      case "status":
        return (
          <LabelStatus color={orderStatus[item.status]?.color}>
            {orderStatus[item.status]?.label}
          </LabelStatus>
        );

      case "actions":
        return (
          <>
            {itemOrderStatus.isPending && (
              <div className="flex items-center justify-center">
                <OrderAction
                  onClick={() =>
                    handleCancelOrder({
                      orderId: item._id,
                      code: item.code,
                      status: OrderStatus.CANCELED,
                    })
                  }
                >
                  <MdOutlineCancel size={18} className="text-red-500" />
                </OrderAction>
              </div>
            )}
          </>
        );

      default:
        return <span>{typeof cellValue === "string" ? cellValue : ""}</span>;
    }
  }, []);

  // Fetch API
  const handleGetListOrdersOfMe = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllOrdersOfMeAsync(query));
  };

  useEffect(() => {
    handleGetListOrdersOfMe();
  }, [filterBy]);
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
              items={orderStatusActions}
            />
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <div className="w-[300px]">
            <InputSearch
              onSearchValue={(value: string) => {
                setFilterBy((draft) => {
                  draft.search = value;
                  draft.page = 1;
                });
              }}
            />
          </div>

          <div>
            <SelectPerPage
              limit={filterBy.limit}
              onchange={(value: string) => {
                setFilterBy((draft) => {
                  draft.limit = +value;
                  draft.page = 1;
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }, [filterBy, selectedKeys]);

  // =====================
  // 🔻 Bottom Pagination
  // =====================

  const bottomContent = useMemo(
    () =>
      orders?.length > 0 && (
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
    <div className="rounded-lg p-5 shadow-medium">
      <CustomTable<TOrder>
        isLoading={isLoading}
        items={orders || []}
        renderCell={renderCell}
        columns={columns}
        topContent={topContent}
        bottomContent={bottomContent}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        selectionMode="none"
      />
    </div>
  );
};

export default MyOrderPage;
