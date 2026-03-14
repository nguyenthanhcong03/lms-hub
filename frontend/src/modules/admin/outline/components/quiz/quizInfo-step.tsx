// components/QuizInfoStep.tsx
import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import TextareaField from "@/shared/components/form/text-area-field";
import { getSecondsFromHHMMSS, toHHMMSS } from "@/utils/common";
import { QuizInfoSchema, quizInfoSchema } from "@/utils/validation";
import { Slider } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";

const QuizInfoStep = forwardRef(
  ({ value }: { value: Partial<QuizInfoSchema> | null }, ref) => {
    const {
      handleSubmit,
      control,
      setValue,
      formState: { errors },
    } = useForm<QuizInfoSchema>({
      defaultValues: {
        title: "",
        duration: "00:00",
        limit: 1,
        passing_grade: 50,
        description: "",
      },
      mode: "onChange",
      resolver: yupResolver(quizInfoSchema),
    });

    useImperativeHandle(ref, () => ({
      validateAndGetData: () =>
        new Promise<QuizInfoSchema | undefined>((resolve) => {
          handleSubmit(
            (data) => resolve(data),
            () => resolve(undefined),
          )();
        }),
    }));
    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;

      const seconds = Math.max(0, getSecondsFromHHMMSS(value));

      const time = toHHMMSS(seconds);

      setValue("duration", time);
    };

    useEffect(() => {
      if (value) {
        setValue("title", value?.title || "");
        setValue("slug", value?.slug || "");
        setValue(
          "duration",
          (value?.duration && toHHMMSS(+value?.duration || 0)) || "00:00",
        );
        setValue("limit", value?.limit || 1);
        setValue("passing_grade", value?.passing_grade || 50);
        setValue("description", value?.description || "");
      }
    }, [value, setValue]);

    return (
      <div className="grid w-full grid-cols-2 gap-5 px-4">
        <Controller
          control={control}
          name="title"
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
              label="Tiêu đề"
              isRequired
              placeholder="Nhập tiêu đề"
              isInvalid={!!errors?.title?.message}
              errorMessage={errors?.title?.message}
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
              label="Đường dẫn bài học"
              placeholder="Nhập đường dẫn bài học"
              isInvalid={!!errors?.slug?.message}
              errorMessage={errors?.slug?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="duration"
          render={({ field }) => (
            <InputTextField
              {...field}
              onBlur={onBlur}
              minLength={1}
              isRequired
              label="Thời lượng"
              placeholder="Nhập thời lượng"
            />
          )}
        />
        <Controller
          control={control}
          name="limit"
          render={({ field }) => (
            <InputNumberField
              {...field}
              minLength={1}
              isRequired
              label="Số lần thử"
              placeholder="Nhập số lần thử"
            />
          )}
        />
        <Controller
          control={control}
          name="passing_grade"
          render={({ field }) => (
            <div className="col-span-2">
              <Slider
                {...field}
                className="w-full"
                label="Passing Grade (%)"
                classNames={{
                  label: "text-black text-sm font-semibold",
                }}
                marks={[
                  {
                    value: 20,
                    label: "20%",
                  },
                  {
                    value: 50,
                    label: "50%",
                  },
                  {
                    value: 80,
                    label: "80%",
                  },
                ]}
                maxValue={100}
                minValue={0}
                showTooltip={true}
                step={10}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <div className="col-span-2">
              <TextareaField
                {...field}
                label="Mô tả"
                placeholder="Nhập mô tả"
                isInvalid={!!errors?.description?.message}
                errorMessage={errors?.description?.message}
              />
            </div>
          )}
        />
      </div>
    );
  },
);

QuizInfoStep.displayName = "QuizInfoStep";

export default QuizInfoStep;
