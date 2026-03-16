"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { MdAdd, MdEdit } from "react-icons/md";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PopulatedChapter } from "@/types/chapter";
import { useCreateChapter, useUpdateChapter } from "@/hooks/use-chapters";

const chapterFormSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề là bắt buộc").min(1, "Tiêu đề không thể để trống"),
  description: yup.string().default("").optional(),
  isPublished: yup.boolean().default(false),
});

type ChapterFormData = yup.InferType<typeof chapterFormSchema>;

interface ChapterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter?: PopulatedChapter;
  courseId: string;
}

const ChapterFormDialog = ({ open, onOpenChange, chapter, courseId }: ChapterFormDialogProps) => {
  const isEditing = !!chapter;

  const createChapterMutation = useCreateChapter();
  const updateChapterMutation = useUpdateChapter();

  const form = useForm<ChapterFormData>({
    resolver: yupResolver(chapterFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublished: false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const isLoading = createChapterMutation.isPending || updateChapterMutation.isPending || isSubmitting;

  React.useEffect(() => {
    if (open) {
      if (chapter) {
        reset({
          title: chapter.title,
          description: chapter.description,
          isPublished: chapter.isPublished,
        });
      } else {
        reset({
          title: "",
          description: "",
          isPublished: false,
        });
      }
    } else {
      reset({
        title: "",
        description: "",
        isPublished: false,
      });
    }
  }, [open, chapter, reset]);

  const handleDialogClose = () => {
    reset({
      title: "",
      description: "",
      isPublished: false,
    });
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: ChapterFormData) => {
    const formData = {
      ...data,
      description: data.description || "",
    };

    if (isEditing && chapter) {
      updateChapterMutation.mutate(
        {
          id: chapter._id,
          ...formData,
        },
        {
          onSuccess: () => {
            toast.success("Chương đã được cập nhật!");
            handleDialogClose();
          },
          onError: () => {
            toast.error("Cập nhật chương thất bại");
          },
        },
      );
    } else {
      createChapterMutation.mutate(
        {
          courseId,
          ...formData,
        },
        {
          onSuccess: () => {
            toast.success("Chương đã được tạo thành công!");
            handleDialogClose();
          },
          onError: () => {
            toast.error("Tạo chương thất bại");
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(dialogOpen) => {
        if (!dialogOpen) {
          handleDialogClose();
        } else {
          onOpenChange(dialogOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <MdEdit className="h-5 w-5" />
                Chỉnh sửa Chương
              </>
            ) : (
              <>
                <MdAdd className="h-5 w-5" />
                Thêm Chương mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin chương bên dưới." : "Tạo một chương mới cho khóa học của bạn."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tiêu đề chương" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Nhập mô tả chương (tùy chọn)" rows={3} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xs border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Xuất bản</FormLabel>
                      <div className="text-sm text-gray-600">Ẩn chương này khỏi học viên</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Đang cập nhật..."
                    : "Đang tạo..."
                  : isEditing
                    ? "Cập nhật Chương"
                    : "Tạo Chương"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterFormDialog;
