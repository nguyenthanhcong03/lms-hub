import { useAppDispatch } from "@/shared/store";
import {
  createCourseAsync,
  updateCourseAsync,
} from "@/shared/store/course/action";

import { yupResolver } from "@hookform/resolvers/yup";

import CustomSelect from "@/shared/components/form/custom-select";
import ModalNextUI from "@/shared/components/modal";
import { CourseSchema, courseSchema } from "@/utils/validation";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";

import {
  courseLevelActions,
  courseStatusActions,
} from "@/shared/constants/course.constant";
import { UploadDropzone } from "@/utils/uploadthing";
import { Radio, RadioGroup } from "@heroui/react";
import Image from "next/image";
import { useImmer } from "use-immer";

import DynamicFieldArray from "@/shared/components/form/dynamic-field-array";
import { CourseInfo, CourseStatus, CourseType } from "@/shared/constants/enums";
import { getAllCategories } from "@/shared/services/category";
import { getDetailsCourse } from "@/shared/services/course";
import { AppDispatch } from "@/shared/store";
import { cn } from "@/utils/common";

import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import TextareaField from "@/shared/components/form/text-area-field";
import { TCategoryItem } from "@/shared/types/category";
import { formatPrice } from "@/utils";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
const actionClassName =
  "size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded  p-2 transition-all  hover:text-gray-500 dark:hover:text-opacity-80";

interface ModalAddEditCourseProps {
  isOpen: boolean;

  onOpenChange: (isOpen: boolean) => void;

  idCourse: string;
}

const ModalAddEditCourse = ({
  isOpen,
  onOpenChange,
  idCourse,
}: ModalAddEditCourseProps) => {
  const dispatch: AppDispatch = useAppDispatch();

  const [categories, setCategories] = useState([]);

  const defaultValues = {
    title: "",
    slug: "",
    price: "",
    old_price: "",
    intro_url: "",
    description: "",
    image: "",
    type: CourseType.PAID,
    status: CourseStatus.APPROVED,
    level: undefined,
    category: "",

    info: {
      requirements: [],
      benefits: [],
      techniques: [],
      documents: [],
      qa: [],
    },
  };
  const [courseInfo, setCourseInfo] = useImmer<{
    requirements: string[];
    benefits: string[];
    techniques: string[];
    documents: string[];
    qa: { question: string; answer: string }[];
  }>({
    requirements: [],
    benefits: [],
    techniques: [],
    documents: [],
    qa: [],
  });

  const handleInfoData = (type: CourseInfo) => {
    if (type === CourseInfo.QA) {
      setCourseInfo((draft) => {
        draft.qa.push({ question: "", answer: "" });
      });
      return;
    }
    setCourseInfo((draft) => {
      draft[type].push("");
    });
  };

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<CourseSchema>({
    defaultValues,
    mode: "onChange",

    resolver: yupResolver(courseSchema),
  });

  const type = watch("type"); // Watch the `type` field

  useEffect(() => {
    if (type === CourseType.FREE) {
      clearErrors("price"); // Clear any error message for the price field
    }
  }, [type, setValue, clearErrors]);

  const onSubmit = handleSubmit((data) => {
    const price = formatPrice(data?.price || "");
    const old_price = formatPrice(data.old_price || "");

    if (idCourse) {
      dispatch(
        updateCourseAsync({
          ...data,
          id: idCourse,
          info: courseInfo,
          price,
          old_price,
        }),
      );
    } else {
      dispatch(
        createCourseAsync({
          ...data,
          info: courseInfo,
          price,
          old_price,
        }),
      );
    }
  });

  const imageWatch = watch("image");

  // Fetch API
  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories({
        params: {
          limit: -1,
          page: -1,
        },
      });
      const data =
        res?.data?.result?.map((item: TCategoryItem) => ({
          value: item._id,
          label: item.name,
        })) || [];

      setCategories(data);
    } catch (e) {
      console.error(e); // Optional: Add error-handling logic
    }
  };

  const fetchDetailsCourse = async (courseId: string) => {
    try {
      const res = await getDetailsCourse(courseId);
      const data = res?.data;

      if (data) {
        reset({
          title: data.title,
          slug: data.slug,
          price: data.price,
          old_price: data.old_price,
          intro_url: data.intro_url,
          description: data.description,
          image: data.image,
          type: data.type,
          status: data.status,
          level: data.level,
          category: data.category,
        });

        setCourseInfo((draft) => {
          draft.requirements = data.info.requirements;
          draft.benefits = data.info.benefits;
          draft.techniques = data.info.techniques;
          draft.documents = data.info.documents;
          draft.qa = data.info.qa;
        });
      }
    } catch (e) {
      console.error(e); // Optional: Add error-handling logic
    }
  };

  useEffect(() => {
    fetchAllCategories();
    if (!isOpen) {
      reset({
        // Reset with default values when the modal is closed
        ...defaultValues,
      });
    } else if (idCourse && isOpen) {
      // Fetch order details if `idCourse` exists and modal is open
      fetchDetailsCourse(idCourse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idCourse]);

  return (
    <ModalNextUI
      title={idCourse ? "Cập nhật khóa học" : "Thêm mới khóa học"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="5xl"
      btnSubmitText={idCourse ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-2 gap-4 p-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="col-span-2 flex w-full items-center justify-center">
              <RadioGroup
                {...field}
                label=""
                orientation="horizontal"
                classNames={{
                  wrapper: "gap-8",
                }}
              >
                <Radio value={CourseType.PAID}>Trả phí</Radio>
                <Radio value={CourseType.FREE}>Miễn phí</Radio>
              </RadioGroup>
            </div>
          )}
        />
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
              isRequired
              label="Tên khóa học"
              placeholder="Nhập tên khóa học"
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
              label="Đường dẫn khóa học"
              placeholder="khoa-hoc-lap-trinh"
              isInvalid={!!errors?.slug?.message}
              errorMessage={errors?.slug?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <InputNumberField
              {...field}
              isRequired
              label="Giá khuyến mãi"
              placeholder="Nhập giá khuyến mãi"
              isInvalid={!!errors?.price}
              errorMessage={errors?.price?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="old_price"
          render={({ field }) => (
            <InputNumberField
              {...field}
              label="Giá gốc"
              placeholder="Nhập giá gốc"
              isInvalid={!!errors?.old_price}
              errorMessage={errors?.old_price?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="intro_url"
          render={({ field }) => (
            <InputTextField
              {...field}
              label="Youtube URL"
              placeholder="Nhập Youtube URL"
              isInvalid={!!errors?.intro_url?.message}
              errorMessage={errors?.intro_url?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CustomSelect
              {...field}
              selectedKeys={field.value ? [field.value] : []}
              label="Danh mục"
              placeholder="Chọn danh mục"
              isInvalid={!!errors?.category}
              errorMessage={errors?.category?.message}
              items={categories}
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <CustomSelect
              {...field}
              selectedKeys={[field.value]}
              label="Trạng thái"
              isInvalid={!!errors?.status}
              errorMessage={errors?.status?.message}
              items={courseStatusActions}
            />
          )}
        />
        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <CustomSelect
              {...field}
              selectedKeys={field.value ? [field.value] : []}
              label="Trình độ"
              isInvalid={!!errors?.level}
              errorMessage={errors?.level?.message}
              items={courseLevelActions}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextareaField
              {...field}
              label="Mô tả khóa học"
              placeholder="Nhập mô tả..."
              className="!h-[250px]"
            />
          )}
        />
        <Controller
          control={control}
          name="image"
          render={() => (
            <div>
              <label
                htmlFor=""
                className="inline-block pb-1 text-sm font-semibold"
              >
                Ảnh đại diện
              </label>
              <>
                {imageWatch && (
                  <div className="group relative">
                    <Image
                      src={imageWatch}
                      alt="Course Image"
                      width={800}
                      height={400}
                      className="h-[250px] w-full rounded-lg object-cover"
                    />
                    <button
                      className={cn(
                        actionClassName,
                        "invisible absolute right-2 top-2 rounded-full opacity-0 hover:bg-red-500 hover:!text-white group-hover:visible group-hover:opacity-100",
                      )}
                      onClick={() => setValue("image", "")}
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                )}
                {!imageWatch && (
                  <UploadDropzone
                    className="!mt-0 h-[250px] cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-grayDarker"
                    appearance={{ button: "bg-primary " }}
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      setValue("image", res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    config={{
                      mode: "auto",
                    }}
                  />
                )}
              </>
            </div>
          )}
        />
        <Controller
          control={control}
          name="info.requirements"
          render={() => (
            <DynamicFieldArray
              label="Yêu cầu"
              onAdd={() => handleInfoData(CourseInfo.REQUIREMENTS)}
            >
              {courseInfo.requirements.map((r, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputTextField
                      key={index}
                      placeholder={`Yêu cầu số ${index + 1}`}
                      value={r}
                      onChange={(event) => {
                        setCourseInfo((draft) => {
                          draft.requirements[index] = event.target.value;
                        });
                      }}
                    />
                  </div>
                  <button
                    className="rounded-lg border p-2.5 text-red-500"
                    onClick={() => {
                      setCourseInfo((draft) => {
                        draft.requirements.splice(index, 1);
                      });
                    }}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              ))}
            </DynamicFieldArray>
          )}
        />
        <Controller
          control={control}
          name="info.benefits"
          render={() => (
            <DynamicFieldArray
              label="Lợi ích"
              onAdd={() => handleInfoData(CourseInfo.BENEFITS)}
            >
              {courseInfo.benefits.map((r, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputTextField
                      placeholder={`Lợi ích số ${index + 1}`}
                      value={r}
                      onChange={(event) => {
                        setCourseInfo((draft) => {
                          draft.benefits[index] = event.target.value;
                        });
                      }}
                    />
                  </div>
                  <button
                    className="rounded-lg border p-2.5 text-red-500"
                    onClick={() => {
                      setCourseInfo((draft) => {
                        draft.benefits.splice(index, 1);
                      });
                    }}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              ))}
            </DynamicFieldArray>
          )}
        />
        <Controller
          control={control}
          name="info.techniques"
          render={() => (
            <DynamicFieldArray
              label="Công nghệ"
              onAdd={() => handleInfoData(CourseInfo.TECHNIQUES)}
            >
              {courseInfo.techniques.map((r, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputTextField
                      placeholder={`Công nghệ số ${index + 1}`}
                      value={r}
                      onChange={(event) => {
                        setCourseInfo((draft) => {
                          draft.techniques[index] = event.target.value;
                        });
                      }}
                    />
                  </div>
                  <button
                    className="rounded-lg border p-2.5 text-red-500"
                    onClick={() => {
                      setCourseInfo((draft) => {
                        draft.techniques.splice(index, 1);
                      });
                    }}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              ))}
            </DynamicFieldArray>
          )}
        />
        <Controller
          control={control}
          name="info.documents"
          render={() => (
            <DynamicFieldArray
              label="Tài liệu"
              onAdd={() => handleInfoData(CourseInfo.DOCUMENTS)}
            >
              {courseInfo.documents.map((r, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputTextField
                      placeholder={`Tài liệu số ${index + 1}`}
                      value={r}
                      onChange={(event) => {
                        setCourseInfo((draft) => {
                          draft.documents[index] = event.target.value;
                        });
                      }}
                    />
                  </div>
                  <button
                    className="rounded-lg border p-2.5 text-red-500"
                    onClick={() => {
                      setCourseInfo((draft) => {
                        draft.documents.splice(index, 1);
                      });
                    }}
                  >
                    <FaRegTrashCan />
                  </button>
                </div>
              ))}
            </DynamicFieldArray>
          )}
        />
        <Controller
          control={control}
          name="info.qa"
          render={() => (
            <DynamicFieldArray
              label="Q.A"
              onAdd={() => handleInfoData(CourseInfo.QA)}
              className="col-start-1 col-end-3"
            >
              {courseInfo.qa.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-5">
                  <InputTextField
                    key={index}
                    placeholder={`Câu hỏi số ${index + 1}`}
                    value={item.question}
                    onChange={(event) => {
                      setCourseInfo((draft) => {
                        draft.qa[index].question = event.target.value;
                      });
                    }}
                  />
                  <InputTextField
                    key={index}
                    placeholder={`Câu trả lời số ${index + 1}`}
                    value={item.answer}
                    onChange={(event) => {
                      setCourseInfo((draft) => {
                        draft.qa[index].answer = event.target.value;
                      });
                    }}
                  />
                </div>
              ))}
            </DynamicFieldArray>
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditCourse;
