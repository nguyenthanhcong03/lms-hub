import InputTextField from "@/shared/components/form/input-text-field";

import { useAppDispatch } from "@/shared/store";
import {
  createCategoryAsync,
  updateCategoryAsync,
} from "@/shared/store/category/action";

import { yupResolver } from "@hookform/resolvers/yup";

import ModalNextUI from "@/shared/components/modal";
import { TCategoryItem } from "@/shared/types/category";
import { CategorySchema, categorySchema } from "@/utils/validation";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";

interface ModalAddEditCategoryProps {
  isOpen: boolean;

  onOpenChange: (isOpen: boolean) => void;

  idCategory: string;

  itemData?: TCategoryItem | null;
}

const ModalAddEditCategory = ({
  isOpen,
  onOpenChange,
  idCategory,
  itemData,
}: ModalAddEditCategoryProps) => {
  const dispatch = useAppDispatch();

  const defaultValues = {
    name: itemData?.name || "",
    slug: itemData?.slug || "",
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchema>({
    defaultValues,
    mode: "onChange",

    resolver: yupResolver(categorySchema),
  });

  const onSubmit = handleSubmit((data) => {
    if (idCategory) {
      dispatch(
        updateCategoryAsync({
          ...data,
          id: idCategory,
        }),
      );
    } else {
      dispatch(
        createCategoryAsync({
          ...data,
        }),
      );
    }
  });

  return (
    <ModalNextUI
      title={idCategory ? "Cập nhật danh mục" : "Thêm mới danh mục"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      btnSubmitText={idCategory ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-1 gap-5">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <InputTextField
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                const replaced = slugify(value || "", {
                  lower: true,
                  replacement: "-",
                  locale: "vi",
                  trim: true,
                });
                setValue("slug", replaced);
              }}
              isRequired
              label="Tên danh mục"
              placeholder="Nhập tên danh mục"
              isInvalid={!!errors?.name?.message}
              errorMessage={errors?.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="slug"
          render={({ field }) => (
            <InputTextField
              {...field}
              isRequired
              isDisabled
              label="Đường dẫn danh mục"
              placeholder="danh-muc"
              isInvalid={!!errors?.slug?.message}
              errorMessage={errors?.slug?.message}
            />
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditCategory;
