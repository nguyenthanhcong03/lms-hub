import InputTextField from "@/shared/components/form/input-text-field";
import ModalNextUI from "@/shared/components/modal";
import { editorOptions } from "@/shared/constants";

import { LessonType } from "@/shared/constants/enums";
import { getLesson } from "@/shared/services/lesson";
import { useAppDispatch } from "@/shared/store";
import {
  createLessonAsync,
  updateLessonAsync,
} from "@/shared/store/lesson/action";
import { getSecondsFromHHMMSS, toHHMMSS } from "@/utils/common";
import { LessonSchema, lessonSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";

interface ModalAddEditLessonProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  idLesson?: string;
  chapterId: string;
  courseId: string;
}

const ModalAddEditLesson = ({
  isOpen,
  onOpenChange,
  idLesson,
  chapterId,
  courseId,
}: ModalAddEditLessonProps) => {
  const editorRef = useRef<unknown>(null);
  const dispatch = useAppDispatch();

  const defaultValues = {
    title: "",
    slug: "",
    duration: "00:00",
    video_url: "",
    content: "",
  };

  const {
    handleSubmit,
    control,
    reset,
    setValue,

    formState: { errors, isSubmitting },
  } = useForm<LessonSchema>({
    defaultValues,
    mode: "onBlur",

    resolver: yupResolver(lessonSchema),
  });
  const onSubmit = handleSubmit((data) => {
    const duration = Math.max(0, getSecondsFromHHMMSS(data.duration));
    if (idLesson) {
      dispatch(
        updateLessonAsync({
          id: idLesson,
          chapterId,
          courseId,
          type: LessonType.VIDEO,
          ...data,
          duration,
        }),
      );
    } else {
      dispatch(
        createLessonAsync({
          chapterId,
          courseId,
          ...data,
          duration,
          type: LessonType.VIDEO,
        }),
      );
    }
  });

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const seconds = Math.max(0, getSecondsFromHHMMSS(value));

    const time = toHHMMSS(seconds);

    setValue("duration", time);
  };

  // Fetch API
  const fetchDetailsLesson = async (id: string) => {
    try {
      const res = await getLesson(id);
      const data = res?.data;

      if (data) {
        reset({
          title: data.title,
          slug: data.slug,
          duration: toHHMMSS(data.duration),
          video_url: data?.resource?.video_url,
          content: data?.resource?.content,
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
    } else if (idLesson && isOpen) {
      fetchDetailsLesson(idLesson);
    }
  }, [isOpen, idLesson]);
  return (
    <ModalNextUI
      title={idLesson ? "Chỉnh sửa bài học" : "Thêm bài học"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="4xl"
      btnSubmitText={idLesson ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-2 gap-4 p-4">
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
              label="Tên bài học"
              placeholder="Nhập tên bài học"
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
              readOnly
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
              isRequired
              label="Thời lượng"
              placeholder="Nhập thời lượng"
              isInvalid={!!errors?.duration}
              errorMessage={errors?.duration?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="video_url"
          render={({ field }) => (
            <InputTextField
              {...field}
              isRequired
              label="Video URL"
              placeholder="Nhập video URL"
              isInvalid={!!errors?.video_url?.message}
              errorMessage={errors?.video_url?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <div className="col-start-1 col-end-3">
              <label
                htmlFor=""
                className="inline-block pb-1.5 text-sm font-bold"
              >
                Nội dung
              </label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                onInit={(_evt, editor) => {
                  (editorRef.current = editor).setContent(field.value || "");
                }}
                value={field.value}
                {...editorOptions(field, "light")}
                // init={{
                //   resize: true,
                //   plugins: "autoresize",
                //   autoresize_bottom_margin: 0,
                //   min_height: 300,
                // }}
              />
            </div>
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditLesson;
