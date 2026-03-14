import CustomSelect from "@/shared/components/form/custom-select";
import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import SwitchField from "@/shared/components/form/switch-field";
import { QuizType } from "@/shared/constants/enums";
import { quizTypeActions } from "@/shared/constants/lesson.constant";
import { QuestionSchema, questionSchema } from "@/utils/validation";
import { Accordion, AccordionItem, Button, Checkbox } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from "lodash";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

const defaultTrueFalse = [
  { text: "True", is_correct: false },
  { text: "False", is_correct: false },
];
const defaultValues = {
  question: "",
  type: QuizType.TRUE_FALSE,
  required: true,
  point: "1",
  options: defaultTrueFalse,
};
const QuestionStep = forwardRef(
  ({ value }: { value: Partial<QuestionSchema[]> }, ref) => {
    const [questions, setQuestions] = useState<QuestionSchema[]>([]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const {
      handleSubmit,
      control,
      setValue,
      reset,
      watch,
      formState: { errors },
    } = useForm<QuestionSchema>({
      defaultValues,
      mode: "onChange",
      resolver: yupResolver(questionSchema),
    });
    const itemClasses = {
      title: "text-base font-bold text-default-900 ",
      base: "p-0 ",
      trigger: "p-4 rounded-lg cursor-pointer border-b bg-[#f2f4f7]",
      indicator: "text-medium",
      content: "text-small  p-4 bg-[#f2f4f7]",
    };
    const selectedType = watch("type");

    const optionValues = useWatch({ control, name: "options" });

    const { fields, append, remove, replace } = useFieldArray({
      control,
      name: "options",
    });

    // Khi có value từ props, set lại giá trị cho form
    useEffect(() => {
      if (value.length > 0) {
        const newQuestions = value?.map((item) => ({
          ...item,
          question: item?.question || "",
          options: item?.options || defaultTrueFalse,
          type: item?.type || QuizType.TRUE_FALSE,
        }));
        setQuestions(newQuestions);
      }
    }, [value, setValue]);

    // Khi đổi loại câu hỏi, reset options phù hợp
    useEffect(() => {
      if (isEditing) return; // không reset khi đang edit

      if (selectedType === QuizType.TRUE_FALSE) {
        replace(defaultTrueFalse);
      } else {
        replace([]);
      }
    }, [selectedType, replace, isEditing]);

    const handleSaveQuestion = handleSubmit(async (data) => {
      const clonedData = cloneDeep(data); // clone sâu object

      if (editingIndex !== null) {
        const updated = [...questions];
        updated[editingIndex] = clonedData;
        setQuestions(updated);
        setEditingIndex(null);
        setIsEditing(false);
      } else {
        setQuestions((prev) => [...prev, clonedData]);
      }

      reset(defaultValues);
    });

    const handleEdit = (index: number) => {
      const q = questions[index];
      setIsEditing(true);
      reset(q);
      setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    useImperativeHandle(ref, () => ({
      validateAndGetData: () =>
        new Promise<QuestionSchema[] | undefined>((resolve) => {
          if (questions.length === 0) return resolve(undefined);
          resolve(questions);
        }),
    }));

    return (
      <div className="space-y-6">
        <div className="rounded-lg border px-6 py-4">
          <div className="grid w-full grid-cols-2 gap-5">
            <Controller
              control={control}
              name="question"
              render={({ field }) => (
                <div className="col-span-2">
                  <InputTextField
                    {...field}
                    label="Câu hỏi"
                    isRequired
                    placeholder="Nhập câu hỏi"
                    isInvalid={!!errors?.question?.message}
                    errorMessage={errors?.question?.message}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="col-span-2">
                  <CustomSelect
                    {...field}
                    selectedKeys={field.value ? [field.value] : []}
                    isRequired
                    disallowEmptySelection
                    label="Loại câu hỏi"
                    isInvalid={!!errors?.type}
                    errorMessage={errors?.type?.message}
                    items={quizTypeActions}
                  />
                </div>
              )}
            />

            <Controller
              control={control}
              name="point"
              render={({ field }) => (
                <InputNumberField
                  {...field}
                  label="Điểm"
                  placeholder=""
                  thousandSeparator={false}
                />
              )}
            />
            <Controller
              control={control}
              name="required"
              render={({ field }) => (
                <SwitchField
                  isSelected={field.value}
                  label="Bắt buộc"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-semibold">
                Tùy chọn trả lời
                <span className="text-red-500"> *</span>
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-2 flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`options.${index}.text`}
                    render={({ field }) => (
                      <div className="flex-1">
                        <InputTextField
                          {...field}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    )}
                  />
                  <Checkbox
                    isSelected={optionValues?.[index]?.is_correct}
                    radius={
                      selectedType === QuizType.MULTIPLE_CHOICE
                        ? "none"
                        : "full"
                    }
                    classNames={{
                      wrapper: "border-none outline-none ",
                    }}
                    size="sm"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (selectedType === QuizType.MULTIPLE_CHOICE) {
                        setValue(`options.${index}.is_correct`, checked);
                      } else {
                        fields.forEach((_, i) => {
                          setValue(`options.${i}.is_correct`, i === index);
                        });
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {(selectedType === QuizType.SINGLE_CHOICE ||
                selectedType === QuizType.MULTIPLE_CHOICE) && (
                <button
                  type="button"
                  onClick={() => append({ text: "", is_correct: false })}
                  className="mt-2 text-sm font-medium text-primary"
                >
                  + Thêm tùy chọn
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onPress={() => handleSaveQuestion()}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 p-3 text-sm text-white shadow-lg shadow-indigo-500/50"
              >
                {editingIndex !== null ? "Cập nhật" : "Lưu"}
              </Button>

              {editingIndex !== null && (
                <Button
                  type="button"
                  onPress={() => {
                    reset({
                      question: "",
                      type: QuizType.TRUE_FALSE,
                      options: defaultTrueFalse,
                    });
                    setEditingIndex(null);
                    setIsEditing(false);
                  }}
                  className="bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-500 hover:bg-indigo-100 data-[hover=true]:!opacity-100"
                >
                  Hủy
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* DANH SÁCH CÂU HỎI ĐÃ THÊM */}
        <div className="space-y-2">
          <Accordion
            className="p-0"
            itemClasses={itemClasses}
            fullWidth
            selectionMode="multiple"
            keepContentMounted={true}
            variant="splitted"
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  height: "auto",
                  overflowY: "unset",
                  transition: {
                    height: {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      duration: 1,
                    },
                    opacity: {
                      easings: "ease",
                      duration: 1,
                    },
                  },
                },
                exit: {
                  y: -10,
                  opacity: 0,
                  height: 0,
                  overflowY: "hidden",
                  transition: {
                    height: {
                      easings: "ease",
                      duration: 0.25,
                    },
                    opacity: {
                      easings: "ease",
                      duration: 0.3,
                    },
                  },
                },
              },
            }}
          >
            {questions?.map((q, index) => {
              return (
                <AccordionItem
                  key={index}
                  title={
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex flex-1 items-center gap-2">
                        <IoMenu size={20} className="flex-shrink-0" />
                        <span>{q.question}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="cursor-pointer hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                        >
                          <FiEdit />
                        </div>

                        <span
                          className="cursor-pointer hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                        >
                          <FaRegTrashCan />
                        </span>
                      </div>
                    </div>
                  }
                >
                  {q?.options?.map((option, i) => (
                    <div
                      key={i}
                      className="my-2 flex items-center justify-between rounded-lg border bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <IoMenu size={20} />
                        <span>{option?.text}</span>
                      </div>
                      <div>
                        <Checkbox
                          isSelected={option?.is_correct}
                          radius={
                            q?.type === QuizType.MULTIPLE_CHOICE
                              ? "none"
                              : "full"
                          }
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    );
  },
);
QuestionStep.displayName = "QuestionStep";
export default QuestionStep;
