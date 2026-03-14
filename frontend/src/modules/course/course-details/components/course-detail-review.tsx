"use client";
import TableActionItem from "@/shared/components/common/table-action-item";
import ConfirmationDialog from "@/shared/components/confirmation-dialog";
import CustomSelect from "@/shared/components/form/custom-select";
import { FILTER_REVIEW_CMS } from "@/shared/constants";

import InputSearch from "@/shared/components/input-search";
import { useAuth } from "@/shared/contexts/auth-context";
import { getAllReviewsByCourse } from "@/shared/services/review";
import { RootState, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteReviewState,
  resetInitialState,
  setReviews,
} from "@/shared/store/review";
import {
  deleteMeReviewAsync,
  getAllReviewsByCourseAsync,
} from "@/shared/store/review/action";
import { TReviewItem } from "@/shared/types/review";
import { formatFilter } from "@/utils/common";
import { Avatar, Button, Progress } from "@heroui/react";
import { uniqBy } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-stars";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import ModalReview from "./modal-review";

const CourseDetailReview = ({ courseId }: { courseId: string }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    min_star: string;
  }>({
    search: "",
    page: 1,
    limit: 4,
    min_star: "",
  });
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: "",
    data: {},
  });
  const [openDeleteReview, setOpenDeleteReview] = useState({
    open: false,
    id: "",
  });
  const {
    reviews,
    pagination,
    rating_distribution,
    average_rating,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
  } = useAppSelector((state: RootState) => state.review);

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    return {
      star,
      count: rating_distribution?.find((s) => s.star === star)?.count || 0,
    };
  });

  const fetchMoreReviews = async (nextPage: number) => {
    const query = {
      params: {
        courseId,
        ...formatFilter(filterBy),
        page: nextPage,
      },
    };
    const res = await getAllReviewsByCourse(query);

    dispatch(
      setReviews(uniqBy([...reviews, ...(res.data.reviews || [])], "_id")),
    );
  };

  // Fetch API
  const handleGetListReviews = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
        courseId,
        page: 1,
      },
    };

    dispatch(getAllReviewsByCourseAsync(query));
  };
  const handleCloseConfirmDeleteReview = () => {
    setOpenDeleteReview({
      open: false,
      id: "",
    });
  };
  const handleDeleteReview = () => {
    dispatch(deleteMeReviewAsync(openDeleteReview.id));
    dispatch(deleteReviewState(openDeleteReview.id));
  };

  useEffect(() => {
    handleGetListReviews();
  }, [filterBy.min_star, filterBy.search, courseId]);

  const handleLoadMoreData = async () => {
    if (pagination?.total_count > reviews.length) {
      fetchMoreReviews(filterBy.page + 1);
      setFilterBy((draft) => {
        draft.page = draft.page + 1;
      });
    }
  };
  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success("Chỉnh sửa đánh giá thành công");
      } else {
        toast.success("Tạo mới đánh giá thành công");
        handleGetListReviews();
      }
      dispatch(resetInitialState());
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      if (typeError) {
        toast.error(messageErrorCreateEdit);
      } else {
        if (openCreateEdit.id) {
          toast.error(`Chỉnh sửa đánh giá thất bại`);
        } else {
          toast.error(`Tạo mới đánh giá thất bại`);
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
      toast.success(`Xóa đánh giá thành công.`);
      handleCloseConfirmDeleteReview();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa đánh giá thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: "",
      data: {},
    });
  };
  return (
    <>
      {openCreateEdit.open && (
        <ModalReview
          isOpen={openCreateEdit.open}
          onOpenChange={handleCloseCreateEdit}
          courseId={courseId}
          idReview={openCreateEdit.id}
          reviewData={openCreateEdit.data}
        />
      )}

      {openDeleteReview.open && (
        <ConfirmationDialog
          isOpen={openDeleteReview.open}
          onCancel={handleCloseConfirmDeleteReview}
          onConfirm={handleDeleteReview}
          title="Xác nhận xóa đánh giá"
        />
      )}

      <section className="relative">
        <div className="lg-6 mx-auto w-full max-w-7xl space-y-8 px-4 md:px-5">
          <div className="w-full">
            <h2 className="font-manrope mb-4 text-center text-xl font-bold text-black">
              Đánh giá khóa học
            </h2>
            <div className="flex w-full items-center gap-10 rounded-xl border p-4">
              <div className="flex flex-shrink-0 flex-col items-center justify-center gap-2">
                <span className="text-7xl font-bold text-gray-800">
                  {average_rating}
                </span>
                {!!average_rating && (
                  <ReactStars
                    value={average_rating || 0}
                    count={5}
                    size={30}
                    color2={"#f5a524"}
                    edit={false}
                  />
                )}

                <p>Tổng cộng {pagination?.total_count} Đánh giá</p>
              </div>
              <div className="flex w-full flex-col gap-y-4">
                {distribution?.map((item, index) => (
                  <div key={index} className="flex w-full items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="mr-0.5 text-lg font-medium text-black">
                        {item?.star}
                      </span>
                      <FaStar size={18} className="text-[#f5a524]" />
                    </div>

                    <Progress
                      className="max-w-md"
                      classNames={{
                        track: "h-2",
                      }}
                      color="warning"
                      size="md"
                      value={(item?.count / pagination?.total_count) * 100}
                    />
                    <p className="mr-0.5 text-lg font-medium text-black">
                      {item?.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <InputSearch
                onSearchValue={(value: string) => {
                  setFilterBy((draft) => {
                    draft.search = value;
                    draft.page = 1;
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[150px]">
                <CustomSelect
                  placeholder="Chọn số sao"
                  items={FILTER_REVIEW_CMS}
                  selectedKeys={[filterBy.min_star]}
                  onChange={(e) =>
                    setFilterBy((draft) => {
                      draft.min_star = e.target.value;
                      draft.page = 1;
                    })
                  }
                />
              </div>
              <Button
                onPress={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: "",
                    data: {},
                  })
                }
                className="flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-base text-white shadow-lg shadow-indigo-500/50"
              >
                Viết đánh giá
              </Button>
            </div>
          </div>

          {/* Review list */}

          <div className="space-y-4">
            {reviews.map((item: TReviewItem, index: number) => (
              <div key={index} className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      isBordered
                      size="md"
                      radius="full"
                      src={item?.user?.avatar || ""}
                    />
                    <div className="flex flex-col justify-center">
                      <span className="font-bold">{item?.user?.username}</span>
                      <div className="flex items-center gap-2">
                        <ReactStars
                          value={item?.star}
                          count={5}
                          size={20}
                          color2={"#f5a524"}
                          edit={false}
                        />
                        <span className="text-sm text-gray-500">
                          {moment(item?.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {item?.user?._id === user?._id && (
                    <div className="flex items-center gap-2">
                      <TableActionItem
                        type="edit"
                        onClick={() =>
                          setOpenCreateEdit({
                            open: true,
                            id: item?._id,
                            data: item,
                          })
                        }
                      />
                      <TableActionItem
                        type="delete"
                        onClick={() =>
                          setOpenDeleteReview({
                            open: true,
                            id: item?._id,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <p>{item?.content}</p>
              </div>
            ))}
          </div>
          {pagination?.total_count > reviews.length && (
            <div className="flex justify-center">
              <Button
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-base text-white shadow-lg shadow-indigo-500/50 hover:bg-indigo-600"
                onPress={handleLoadMoreData}
              >
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CourseDetailReview;
