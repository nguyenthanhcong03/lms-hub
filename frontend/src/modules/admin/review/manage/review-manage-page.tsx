"use client";

import TableAction from "@/shared/components/common/table-action";
import TableActionItem from "@/shared/components/common/table-action-item";
import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";
import { DEFAULT_IMAGE } from "@/shared/constants";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteMultipleReviewAsync,
  deleteReviewAsync,
  getAllReviewsAsync,
} from "@/shared/store/review/action";
import { Button, Selection } from "@heroui/react";

import { useCallback, useEffect, useMemo, useState } from "react";

import ConfirmationDialog from "@/shared/components/confirmation-dialog";

import InputSearch from "@/shared/components/input-search";
import { resetInitialState } from "@/shared/store/review";
import moment from "moment";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { LabelStatus } from "@/shared/components/common/label-status";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";
import { ReviewStatus } from "@/shared/constants/enums";
import {
  reviewStatus,
  reviewStatusActions,
} from "@/shared/constants/review.constant";
import { changeStatusReview } from "@/shared/services/review";
import { TReviewItem } from "@/shared/types/review";
import { formatFilter } from "@/utils/common";
import Image from "next/image";
import Swal from "sweetalert2";
import { useImmer } from "use-immer";

const ReviewManagePage = () => {
  const [openDeleteMultipleReview, setOpenDeleteMultipleReview] =
    useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    status: ReviewStatus | string;
  }>({
    search: "",
    page: 1,
    limit: 10,
    status: "",
  });
  const [openDeleteReview, setOpenDeleteReview] = useState({
    open: false,
    id: "",
  });

  // ** redux
  const dispatch: AppDispatch = useAppDispatch();
  const {
    reviews,
    pagination,
    isLoading,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  } = useAppSelector((state) => state.review);

  // Calculate start and end indices
  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  const columns = [
    { name: "Thành viên", uid: "user" },
    { name: "Nội dung ", uid: "content" },
    { name: "Số sao", uid: "star" },
    { name: "Trạng thái", uid: "status" },
    { name: "Ngày tạo", uid: "createdAt" },
    { name: "Hành động", uid: "actions" },
  ];
  const handleChangeStatus = (
    reviewId: string,
    status: ReviewStatus,
    userId: string,
  ) => {
    Swal.fire({
      title: "Thay đổi trạng thái bình luận?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (reviews) => {
      if (reviews.isConfirmed) {
        try {
          await changeStatusReview({
            id: reviewId,
            userId,
            status:
              status === ReviewStatus.ACTIVE
                ? ReviewStatus.INACTIVE
                : ReviewStatus.ACTIVE,
          });
          handleGetListReviews();
          toast.success("Thay đổi trạng thái thành công");
        } catch {
          toast.error("Thay đổi trạng thái thất bại");
        }
      }
    });
  };
  const renderCell = useCallback((item: TReviewItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TReviewItem];

    switch (columnKey) {
      case "user":
        return (
          <div className="flex items-center gap-3">
            <Image
              src={item?.user?.avatar || DEFAULT_IMAGE}
              alt={item?.user?.username || ""}
              width={64}
              height={64}
              className="borderDarkMode size-10 flex-shrink-0 rounded-full object-cover"
            />
            <div className="whitespace-nowrap">
              <h4 className="line-clamp-2 block max-w-[400px] whitespace-nowrap text-sm font-bold">
                {item?.user?.username}
              </h4>
              <h5 className="font-medium">{item?.user?.email}</h5>
            </div>
          </div>
        );
      case "content":
        return (
          <p
            className="Review line-clamp-1 text-sm leading-7"
            dangerouslySetInnerHTML={{ __html: item?.content }}
          />
        );
      case "star":
        return <span>{item?.star}</span>;
      case "status":
        return (
          <LabelStatus
            color={reviewStatus[item.status]?.color}
            onClick={() =>
              handleChangeStatus(item._id, item.status, item.user?._id || "")
            }
          >
            {reviewStatus[item.status]?.label}
          </LabelStatus>
        );

      case "createdAt":
        return <span>{moment(item?.createdAt).format("DD/MM/YYYY")}</span>;

      case "actions":
        return (
          <TableAction>
            <TableActionItem
              type="delete"
              onClick={() =>
                setOpenDeleteReview({
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
  }, []);

  // Fetch API
  const handleGetListReviews = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllReviewsAsync(query));
  };
  const handleCloseConfirmDeleteReview = () => {
    setOpenDeleteReview({
      open: false,
      id: "",
    });
  };
  const handleCloseConfirmDeleteMultipleReview = () => {
    setOpenDeleteMultipleReview(false);
  };
  const handleDeleteReview = () => {
    dispatch(deleteReviewAsync(openDeleteReview.id));
  };
  const handleDeleteMultipleReview = () => {
    dispatch(
      deleteMultipleReviewAsync({
        reviewIds: Array.from(selectedKeys) as string[],
      }),
    );
  };

  useEffect(() => {
    handleGetListReviews();
  }, [filterBy]);

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(`Xóa bình luận thành công.`);

      handleGetListReviews();
      handleCloseConfirmDeleteReview();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa bình luận thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success("Xóa nhiều bình luận thành công.");
      handleGetListReviews();
      handleCloseConfirmDeleteMultipleReview();
      setSelectedKeys(new Set());
      dispatch(resetInitialState());
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error("Xóa nhiều mã bình luận thất bại.");
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
        <div className="grid grid-cols-4 gap-4">
          <InputSearch
            onSearchValue={(value: string) => {
              setFilterBy((draft) => {
                draft.search = value;
                draft.page = 1;
              });
            }}
          />
          <CustomSelect
            placeholder="Trạng thái"
            selectedKeys={[filterBy.status]}
            onChange={(e) => {
              setFilterBy((draft) => {
                draft.status = e.target.value;
                draft.page = 1;
              });
            }}
            items={reviewStatusActions}
          />

          <div className="col-span-1 col-end-5 justify-self-end">
            <div className="flex items-center gap-2">
              <SelectPerPage
                limit={filterBy.limit}
                onchange={(value: string) => {
                  setFilterBy((draft) => {
                    draft.limit = +value;
                    draft.page = 1;
                  });
                }}
              />

              {[...selectedKeys]?.length > 0 && (
                <Button
                  className="h-10 flex-shrink-0 bg-red-500 px-4 text-base font-medium text-white"
                  startContent={<FaRegTrashAlt size={18} />}
                  size="sm"
                  onPress={() => setOpenDeleteMultipleReview(true)}
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [filterBy, selectedKeys]);

  const bottomContent = useMemo(
    () =>
      reviews?.length > 0 && (
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
      {openDeleteReview.open && (
        <ConfirmationDialog
          isOpen={openDeleteReview.open}
          onCancel={handleCloseConfirmDeleteReview}
          onConfirm={handleDeleteReview}
          title={"Xóa bình luận"}
        />
      )}

      {openDeleteMultipleReview && (
        <ConfirmationDialog
          isOpen={openDeleteMultipleReview}
          onCancel={handleCloseConfirmDeleteMultipleReview}
          onConfirm={handleDeleteMultipleReview}
          title={"Xóa nhiều bình luận"}
        />
      )}

      <div className="rounded-lg p-5 shadow-medium">
        <CustomTable
          isLoading={isLoading}
          items={reviews || []}
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

export default ReviewManagePage;
