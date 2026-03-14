import { useAppDispatch } from "@/shared/store";
import {
  createReviewAsync,
  updateMeReviewAsync,
} from "@/shared/store/review/action";
import { ReviewSchema, reviewSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";

import ModalNextUI from "@/shared/components/modal";
import { useAuth } from "@/shared/contexts/auth-context";
import { addReviewState, updateReviewState } from "@/shared/store/review";
import { Controller, useForm } from "react-hook-form";
import ReactStars from "react-stars";
import { toast } from "react-toastify";
import TextareaField from "@/shared/components/form/text-area-field";

type ModalReviewProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  idReview?: string;
  reviewData?: {
    star?: number;
    content?: string;
  };
};

const ModalReview = ({
  isOpen,
  onOpenChange,
  courseId,
  idReview,
  reviewData,
}: ModalReviewProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const defaultValues = {
    star: reviewData?.star || 5,
    content: reviewData?.content || "",
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSchema>({
    defaultValues,
    mode: "onChange",

    resolver: yupResolver(reviewSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user?._id) {
      toast.error("Vui lòng đăng nhập để đánh giá khóa học");
      return;
    }
    if (idReview) {
      // Update review
      dispatch(
        updateMeReviewAsync({
          id: idReview,
          courseId,
          content: data.content,
          star: data.star,
        }),
      ).then(() => {
        dispatch(
          updateReviewState({
            _id: idReview,
            content: data.content,
            star: data.star,
          }),
        );
      });
    } else {
      dispatch(
        createReviewAsync({
          courseId,
          content: data.content,
          star: data.star,
        }),
      ).then((res) => {
        dispatch(addReviewState(res.payload.data));
      });
    }
  });

  return (
    <ModalNextUI
      title={idReview ? "Cập nhật đánh giá" : "	Đánh giá khóa học"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="lg"
      btnSubmitText={idReview ? "Cập nhật" : "Đánh giá"}
    >
      <div className="gap-5-10 grid w-full grid-cols-1 gap-x-5">
        <Controller
          control={control}
          name="star"
          render={({ field }) => (
            <div className="flex items-center justify-center">
              <ReactStars {...field} count={5} size={30} color2={"#ffd700"} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TextareaField
              {...field}
              label="Nội dung"
              placeholder="Nhập nội dung..."
              className="!h-[200px]"
              isRequired
              isInvalid={!!errors?.content?.message}
              errorMessage={errors?.content?.message}
            />
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalReview;
