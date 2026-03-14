import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import ModalNextUI from "@/shared/components/modal";
import { getChapter } from "@/shared/services/chapter";
import { useAppDispatch } from "@/shared/store";
import { updateChapterAsync } from "@/shared/store/chapter/action";
import { formatPrice } from "@/utils";
import { ChapterSchema, chapterSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";

type ModalEditChapterProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  idChapter?: string;
};

const ModalEditChapter = ({
  isOpen,
  onOpenChange,
  idChapter,
}: ModalEditChapterProps) => {
  const dispatch = useAppDispatch();

  const defaultValues = {
    title: "",
    order: "",
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ChapterSchema>({
    defaultValues,
    mode: "onChange",

    resolver: yupResolver(chapterSchema),
  });
  const onSubmit = handleSubmit((data) => {
    const order = formatPrice(data.order);
    if (idChapter) {
      dispatch(
        updateChapterAsync({
          id: idChapter,
          title: data.title,
          order,
        }),
      );
    }
  });

  const fetchDetailsChapter = async (id: string) => {
    try {
      const res = await getChapter(id);
      const data = res?.data;

      if (data) {
        reset({
          title: data.title,
          order: data.order,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset({
        ...defaultValues,
      });
    } else if (idChapter && isOpen) {
      fetchDetailsChapter(idChapter);
    }
  }, [isOpen, idChapter]);

  return (
    <ModalNextUI
      title={idChapter ? "Chỉnh sửa chương" : "Thêm chương"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="2xl"
      btnSubmitText={idChapter ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-1 gap-4 p-4">
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <InputTextField
              {...field}
              isRequired
              label="Tên chương"
              placeholder="Nhập tên chương"
              isInvalid={!!errors?.title?.message}
              errorMessage={errors?.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="order"
          render={({ field }) => (
            <InputNumberField
              {...field}
              minLength={1}
              isRequired
              label="Thứ tự"
              placeholder="Nhập thứ tự"
              isInvalid={!!errors?.order}
              errorMessage={errors?.order?.message}
            />
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalEditChapter;
