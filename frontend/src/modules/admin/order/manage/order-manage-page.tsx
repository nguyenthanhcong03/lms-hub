"use client";

import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import { getAllOrdersAsync } from "@/shared/store/order/action";
import { cn, formatFilter } from "@/utils/common";
import { Button, Selection } from "@heroui/react";
import Swal from "sweetalert2";

import { useCallback, useEffect, useMemo, useState } from "react";

import { IoMdAdd } from "react-icons/io";

import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";

import { LabelStatus } from "@/shared/components/common/label-status";
import { DEFAULT_AVATAR, ITEMS_PER_PAGE } from "@/shared/constants";
import { OrderStatus } from "@/shared/constants/enums";
import {
  orderStatus,
  orderStatusActions,
} from "@/shared/constants/order.constant";
import { updateOrder } from "@/shared/services/order";
import { TOrder } from "@/shared/types/order";
import { formatThousand } from "@/utils";
import Image from "next/image";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import OrderAction from "../components/order-action";

const OrderManagePage = () => {
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

  const handleUpdateOrder = async ({
    orderId,
    status,
  }: {
    orderId: string;
    status: OrderStatus;
  }) => {
    if (status === OrderStatus.CANCELED) {
      Swal.fire({
        title: "Bạn có chắc muốn hủy đơn hàng không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hủy luôn",
        cancelButtonText: "Thoát",
      })
        .then(async (orders) => {
          if (orders.isConfirmed) {
            await updateOrder({ id: orderId, status });
            handleGetListOrders();
            toast.success("Cập nhật đơn hàng thành công");
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        });
    }
    if (status === OrderStatus.COMPLETED) {
      try {
        await updateOrder({ id: orderId, status });

        handleGetListOrders();

        toast.success("Cập nhật đơn hàng thành công");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
      }
    }
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
    { name: "Thành viên", uid: "user" },
    { name: "Số tiền", uid: "total" },
    { name: "Mã giảm giá", uid: "coupon" },
    { name: "Trạng thái", uid: "status" },
    { name: "Hành động", uid: "actions" },
  ];

  const renderCell = useCallback((item: TOrder, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TOrder];

    const itemOrderStatus = {
      isApproved: item.status === OrderStatus.COMPLETED,
      isPending: item.status === OrderStatus.PENDING,
      isRejected: item.status === OrderStatus.CANCELED,
    };
    switch (columnKey) {
      case "code":
        return <span className="font-bold">{item?.code}</span>;
      case "course":
        return <span className="font-bold">{item.course?.title}</span>;
      case "user":
        return (
          <div className="flex items-center gap-2">
            <Image
              src={item?.user?.avatar || DEFAULT_AVATAR}
              alt={""}
              width={64}
              height={64}
              className="size-10 flex-shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold">{item?.user?.username}</span>
              <span className="text-sm font-medium">{item?.user?.email}</span>
            </div>
          </div>
        );
      case "total":
        return (
          <>
            {itemOrderStatus?.isRejected && (
              <p className={"font-bold text-red-500"}>
                {formatThousand(item.total)}
              </p>
            )}
            {!itemOrderStatus.isRejected && (
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
                      itemOrderStatus.isApproved
                        ? "text-green-500"
                        : "text-orange-500",
                    )}
                  >
                    {itemOrderStatus.isApproved && "+"}
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
            {!itemOrderStatus.isRejected && (
              <div className="flex gap-3">
                {itemOrderStatus.isPending && (
                  <OrderAction
                    onClick={() =>
                      handleUpdateOrder({
                        orderId: item._id,
                        status: OrderStatus.COMPLETED,
                      })
                    }
                  >
                    <FaRegCheckCircle className="h-5 w-5 text-green-500" />
                  </OrderAction>
                )}
                <OrderAction
                  onClick={() =>
                    handleUpdateOrder({
                      orderId: item._id,
                      status: OrderStatus.CANCELED,
                    })
                  }
                >
                  <MdOutlineCancel className="h-5 w-5 text-red-500" />
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
  const handleGetListOrders = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllOrdersAsync(query));
  };

  useEffect(() => {
    handleGetListOrders();
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
        <div className="flex items-center justify-between gap-3">
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
            >
              Add New
            </Button>
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
    <>
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
        />
      </div>
    </>
  );
};

export default OrderManagePage;
