"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { useImmer } from "use-immer";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CourseInfo, CourseLevel, CourseStatus, ICourse } from "@/types/course";

import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import { ImageUpload } from "@/components/ui/image-upload-simple";
import { useAllCategories } from "@/hooks/use-categories";
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-courses";
import { CourseSchema, courseFormSchema } from "@/validators/course.validator";
import { useEffect, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

export const createEmptyCourseInfo = (): CourseInfo => ({
  requirements: [],
  benefits: [],
  techniques: [],
  documents: [],
  qa: [],
});

// Lược giản schema kiểm tra dữ liệu khóa học cho form (không gồm trường info)

interface CoursesActionDialogProps {
  mode?: "create" | "edit";
  course?: ICourse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CoursesActionDialog = ({ mode = "create", course, open, onOpenChange }: CoursesActionDialogProps) => {
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  // Lấy toàn bộ danh mục từ API (cho dropdown)
  const { data: categories, isLoading: categoriesLoading } = useAllCategories();

  const defaultValues = useMemo(
    () => ({
      title: "",
      slug: "",
      excerpt: "",
      description: "",
      image: "",
      introUrl: "",
      price: 0,
      oldPrice: 0,
      isFree: false,
      status: CourseStatus.DRAFT,
      categoryId: "",
      level: CourseLevel.BEGINNER,
    }),
    [],
  );

  // Tách state cho thông tin khóa học bằng useImmer
  const [courseInfo, setCourseInfo] = useImmer<CourseInfo>(() => course?.info || createEmptyCourseInfo());

  // Theo dõi trạng thái slug có bị sửa tay hay không
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm<CourseSchema>({
    resolver: yupResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = form;

  // Theo dõi trường tiêu đề để tự sinh slug
  const titleValue = watch("title");
  const isFreeValue = watch("isFree");

  // Tự động tạo slug từ tiêu đề
  useEffect(() => {
    if (titleValue && !isSlugManuallyEdited) {
      const generatedSlug = slugify(titleValue, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [titleValue, isSlugManuallyEdited, setValue]);

  // Xử lý bật/tắt khóa học miễn phí - đặt lại giá khi đánh dấu miễn phí
  useEffect(() => {
    if (isFreeValue) {
      setValue("price", 0, { shouldValidate: true });
      setValue("oldPrice", 0, { shouldValidate: true });
    }
  }, [isFreeValue, setValue]);

  // Đặt lại trạng thái sửa tay slug khi mở hộp thoại
  useEffect(() => {
    if (open) {
      setIsSlugManuallyEdited(mode === "edit" && !!course?.slug);
    }
  }, [open, mode, course?.slug]);

  useEffect(() => {
    if (open) {
      const formDefaults = {
        title: course?.title || "",
        slug: course?.slug || "",
        excerpt: course?.excerpt || "",
        description: course?.description || "",
        image: course?.image || "",
        introUrl: course?.introUrl || "",
        price: course?.price || 0,
        oldPrice: course?.oldPrice || 0,
        isFree: course?.isFree || false,
        status: course?.status || CourseStatus.DRAFT,
        categoryId: course?.categoryId || "",
        level: course?.level || CourseLevel.BEGINNER,
      };

      reset(formDefaults);
      setCourseInfo(course?.info || createEmptyCourseInfo());
    }
  }, [open, course, reset, setCourseInfo]);

  const onSubmit = async (data: CourseSchema) => {
    const courseData = {
      ...data,
      info: courseInfo,
    };

    if (mode === "create") {
      await createCourseMutation.mutateAsync(courseData);
      toast.success("Táº¡o khÃ³a há»c thÃ nh cÃ´ng!");
    } else if (course) {
      await updateCourseMutation.mutateAsync({
        id: course._id,
        ...courseData,
      });
      toast.success("Cáº­p nháº­t khÃ³a há»c thÃ nh cÃ´ng!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2 border-b">
          <DialogTitle>{mode === "create" ? "Táº¡o khÃ³a há»c má»›i" : "Chá»‰nh sá»­a khÃ³a há»c"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "ThÃªm khÃ³a há»c má»›i vÃ o ná»n táº£ng."
              : "Cáº­p nháº­t thÃ´ng tin vÃ  cÃ i Ä‘áº·t khÃ³a há»c."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            {/* Khu vực nội dung có thể cuộn */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Phần thông tin cơ bản */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">ThÃ´ng Tin CÆ¡ Báº£n</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            TiÃªu Ä‘á» <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="TiÃªu Ä‘á» khÃ³a há»c" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ÄÆ°á»ng dáº«n <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="course-slug"
                              onChange={(e) => {
                                field.onChange(e);
                                setIsSlugManuallyEdited(true);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tráº¡ng thÃ¡i <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chá»n tráº¡ng thÃ¡i" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={CourseStatus.DRAFT}>NhÃ¡p</SelectItem>
                              <SelectItem value={CourseStatus.PUBLISHED}>ÄÃ£ xuáº¥t báº£n</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="introUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Video Giá»›i Thiá»‡u</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/intro-video.mp4" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Danh má»¥c <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chá»n danh má»¥c" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoriesLoading ? (
                                <SelectItem value="__loading__" disabled>
                                  Äang táº£i danh má»¥c...
                                </SelectItem>
                              ) : categories?.length ? (
                                categories.map((category) => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="__no_categories__" disabled>
                                  KhÃ´ng cÃ³ danh má»¥c
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cáº¥p Ä‘á»™ <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chá»n cáº¥p Ä‘á»™" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CourseLevel).map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Trường tóm tắt */}
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          TÃ³m táº¯t{" "}
                          <span className="text-gray-500 text-xs font-normal">
                            (TÃ³m táº¯t ngáº¯n, tá»‘i Ä‘a 300 kÃ½ tá»±)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="TÃ³m táº¯t ngáº¯n vá» khÃ³a há»c..."
                            className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md    resize-y"
                            maxLength={300}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className="text-xs text-gray-500">{field.value?.length || 0}/300</span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trường hình ảnh */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HÃ¬nh áº£nh</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onError={(error) => console.error("Image upload error:", error)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trường mô tả */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MÃ´ táº£</FormLabel>
                        <FormControl>
                          <div className="border rounded-md overflow-hidden">
                            <Toolbar />
                            <Editor
                              content={field.value}
                              onChange={(content) => field.onChange(content)}
                              className="min-h-[200px]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phần học phí */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Há»c PhÃ­</h3>
                    <div className="flex items-center space-x-6">
                      <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 m-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-medium m-0">KhÃ³a há»c miá»…n phÃ­</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field: { onChange, onBlur, name, value, ref } }) => (
                        <FormItem>
                          <FormLabel>
                            Price {!form.watch("isFree") && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <NumericFormat
                              name={name}
                              value={value}
                              onBlur={onBlur}
                              getInputRef={ref}
                              customInput={Input}
                              thousandSeparator=","
                              decimalSeparator="."
                              suffix=" â‚«"
                              allowNegative={false}
                              placeholder="0 â‚«"
                              disabled={form.watch("isFree")}
                              onValueChange={(values) => onChange(values.floatValue)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="oldPrice"
                      render={({ field: { onChange, onBlur, name, value, ref } }) => (
                        <FormItem>
                          <FormLabel>GiÃ¡ Gá»‘c </FormLabel>
                          <FormControl>
                            <NumericFormat
                              name={name}
                              value={value}
                              onBlur={onBlur}
                              getInputRef={ref}
                              customInput={Input}
                              thousandSeparator=","
                              decimalSeparator="."
                              suffix=" â‚«"
                              allowNegative={false}
                              placeholder="0 â‚«"
                              disabled={form.watch("isFree")}
                              onValueChange={(values) => onChange(values.floatValue)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* Phần chi tiết khóa học */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Chi tiáº¿t khÃ³a há»c</h3>
                  {/* Yêu cầu và lợi ích */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Yêu cầu */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">YÃªu cáº§u</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-dashed hover:border-solid"
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.requirements.push("");
                            })
                          }
                        >
                          <MdAdd className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {courseInfo.requirements.map((requirement, index) => (
                          <div key={index} className="flex w-full gap-2">
                            <Input
                              value={requirement}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.requirements[index] = e.target.value;
                                })
                              }
                              placeholder={`YÃªu cáº§u ${index + 1}`}
                              className="text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.requirements.splice(index, 1);
                                })
                              }
                            >
                              Ã—
                            </Button>
                          </div>
                        ))}
                        {courseInfo.requirements.length === 0 && (
                          <p className="text-sm text-gray-500 italic text-center py-4">ChÆ°a cÃ³ yÃªu cáº§u nÃ o</p>
                        )}
                      </div>
                    </div>

                    {/* Lợi ích */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Lá»£i Ã­ch</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-dashed hover:border-solid"
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.benefits.push("");
                            })
                          }
                        >
                          <MdAdd className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {courseInfo.benefits.map((benefit, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={benefit}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.benefits[index] = e.target.value;
                                })
                              }
                              placeholder={`Lá»£i Ã­ch ${index + 1}`}
                              className="flex-1 text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.benefits.splice(index, 1);
                                })
                              }
                            >
                              Ã—
                            </Button>
                          </div>
                        ))}
                        {courseInfo.benefits.length === 0 && (
                          <p className="text-sm text-gray-500 italic text-center py-4">ChÆ°a cÃ³ lá»£i Ã­ch nÃ o</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kỹ thuật và tài liệu */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kỹ thuật */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Ká»¹ thuáº­t</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-dashed hover:border-solid"
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.techniques.push("");
                            })
                          }
                        >
                          <MdAdd className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {courseInfo.techniques.map((technique, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={technique}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.techniques[index] = e.target.value;
                                })
                              }
                              placeholder={`Ká»¹ thuáº­t ${index + 1}`}
                              className="flex-1 text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.techniques.splice(index, 1);
                                })
                              }
                            >
                              Ã—
                            </Button>
                          </div>
                        ))}
                        {courseInfo.techniques.length === 0 && (
                          <p className="text-sm text-gray-500 italic text-center py-4">ChÆ°a cÃ³ ká»¹ thuáº­t nÃ o</p>
                        )}
                      </div>
                    </div>

                    {/* Tài liệu */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">TÃ i liá»‡u</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-dashed hover:border-solid"
                          onClick={() =>
                            setCourseInfo((draft) => {
                              draft.documents.push("");
                            })
                          }
                        >
                          <MdAdd className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {courseInfo.documents.map((document, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={document}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.documents[index] = e.target.value;
                                })
                              }
                              placeholder={`TÃ i liá»‡u ${index + 1}`}
                              className="flex-1 text-sm"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setCourseInfo((draft) => {
                                  draft.documents.splice(index, 1);
                                })
                              }
                            >
                              Ã—
                            </Button>
                          </div>
                        ))}
                        {courseInfo.documents.length === 0 && (
                          <p className="text-sm text-gray-500 italic text-center py-4">ChÆ°a cÃ³ tÃ i liá»‡u nÃ o</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phần hỏi đáp */}
                <div className="space-y-4">
                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-dashed hover:border-solid"
                      onClick={() =>
                        setCourseInfo((draft) => {
                          draft.qa.push({ question: "", answer: "" });
                        })
                      }
                    >
                      <MdAdd className="h-4 w-4 mr-2" />
                      ThÃªm Q&A
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {courseInfo.qa.map((qaItem, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50/50 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Há»i & ÄÃ¡p #{index + 1}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              setCourseInfo((draft) => {
                                draft.qa.splice(index, 1);
                              })
                            }
                          >
                            Ã—
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">CÃ¢u há»i</Label>
                            <Input
                              value={qaItem.question}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.qa[index].question = e.target.value;
                                })
                              }
                              placeholder="Nháº­p cÃ¢u há»i"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">CÃ¢u tráº£ lá»i</Label>
                            <Input
                              value={qaItem.answer}
                              onChange={(e) =>
                                setCourseInfo((draft) => {
                                  draft.qa[index].answer = e.target.value;
                                })
                              }
                              placeholder="Nháº­p cÃ¢u tráº£ lá»i"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {courseInfo.qa.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500">ChÆ°a cÃ³ cÃ¢u há»i nÃ o</p>
                        <p className="text-xs text-gray-400 mt-1">Nháº¥n &ldquo;ThÃªm Q&A&rdquo; Ä‘á»ƒ báº¯t Ä‘áº§u</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chân trang cố định */}
            <DialogFooter className="flex-shrink-0 border-t px-6 py-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Há»§y
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createCourseMutation.isPending || updateCourseMutation.isPending}
              >
                {isSubmitting || createCourseMutation.isPending || updateCourseMutation.isPending
                  ? "Äang lÆ°u..."
                  : mode === "create"
                    ? "Táº¡o khÃ³a há»c"
                    : "Cáº­p nháº­t"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CoursesActionDialog;
