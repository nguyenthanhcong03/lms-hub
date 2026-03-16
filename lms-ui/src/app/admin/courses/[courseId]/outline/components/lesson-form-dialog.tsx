"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdDelete, MdDescription, MdEdit, MdHelpOutline, MdOutlineSlowMotionVideo } from "react-icons/md";
import { toast } from "sonner";
import * as yup from "yup";

import { useCreateLesson, useLesson, useUpdateLesson } from "@/hooks/use-lessons";
import { QuestionType } from "@/types/quiz";
import type { ContentType, ILessonResource, BackendLessonData, QuizQuestionForm } from "@/types/lesson";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SimpleTimePicker } from "@/components/ui/simple-time-picker";
import { secondsToTimeString, timeStringToSeconds } from "@/utils/format";

interface LessonWithQuestions extends BackendLessonData {
  resource?: ILessonResource;
}

interface LessonFormData {
  title: string;
  contentType: ContentType;
  preview: boolean;
  isPublished: boolean;
  duration?: string;
  resourceDescription?: string;
  quizDescription?: string;
  videoUrl?: string;
  totalAttemptsAllowed?: number;
  passingScorePercentage?: number;

  questions?: QuizQuestionForm[];
}

const lessonFormSchema: yup.ObjectSchema<LessonFormData> = yup.object({
  title: yup.string().required("Tiêu đề là bắt buộc").min(1, "Tiêu đề không thể để trống"),
  contentType: yup
    .mixed<ContentType>()
    .oneOf(["video", "quiz", "article"] as const)
    .required("Loại nội dung là bắt buộc"),
  preview: yup.boolean().default(false),
  isPublished: yup.boolean().default(false),

  duration: yup
    .string()
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, "Dịnh dạng thời gian không hợp lệ"),

  resourceDescription: yup.string().optional(),

  quizDescription: yup.string().when("contentType", {
    is: "quiz",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),

  videoUrl: yup.string().when("contentType", {
    is: "video",
    then: (schema) => schema.url("Vui lòng nhập URL hợp lệ").required("URL video là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),

  totalAttemptsAllowed: yup.number().when("contentType", {
    is: "quiz",
    then: (schema) =>
      schema
        .min(1, "Phải cho phép ít nhất 1 lần thử")
        .max(10, "Không thể vượt quá 10 lần thử")
        .required("Số lần thử là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),
  passingScorePercentage: yup.number().when("contentType", {
    is: "quiz",
    then: (schema) =>
      schema
        .min(1, "Điểm qua tối thiểu là 1%")
        .max(100, "Điểm qua không thể vượt quá 100%")
        .required("Điểm qua là bắt buộc"),
    otherwise: (schema) => schema.optional(),
  }),

  questions: yup.array().optional(),
});

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId?: string;
  chapterId: string;
  courseId: string;
  onSuccess?: () => void;
}

const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case "video":
      return <MdOutlineSlowMotionVideo className="h-4 w-4" />;
    case "article":
      return <MdDescription className="h-4 w-4" />;
    case "quiz":
      return <MdHelpOutline className="h-4 w-4" />;
    default:
      return <MdDescription className="h-4 w-4" />;
  }
};

interface QuestionEditorProps {
  question: QuizQuestionForm;
  onSave: (question: QuizQuestionForm) => void;
  onCancel: () => void;
}

function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [editForm, setEditForm] = useState<QuizQuestionForm>({ ...question });

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...editForm.options];
    newOptions[optionIndex] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const toggleCorrectAnswer = (optionIndex: number, isChecked: boolean) => {
    let newCorrectAnswers = [...editForm.correctAnswers];

    if (isChecked && !newCorrectAnswers.includes(optionIndex)) {
      if (editForm.type === QuestionType.SINGLE_CHOICE || editForm.type === QuestionType.TRUE_FALSE) {
        newCorrectAnswers = [optionIndex];
      } else {
        newCorrectAnswers.push(optionIndex);
      }
    } else if (!isChecked) {
      newCorrectAnswers = newCorrectAnswers.filter((i) => i !== optionIndex);
    }

    setEditForm({ ...editForm, correctAnswers: newCorrectAnswers });
  };

  const addOption = () => {
    if (editForm.options.length < 6) {
      setEditForm({
        ...editForm,
        options: [...editForm.options, ""],
      });
    }
  };

  const removeOption = (optionIndex: number) => {
    if (editForm.options.length > 2) {
      const newOptions = editForm.options.filter((_, i) => i !== optionIndex);
      const newCorrectAnswers = editForm.correctAnswers
        .map((i) => (i > optionIndex ? i - 1 : i))
        .filter((i) => i < newOptions.length);

      setEditForm({
        ...editForm,
        options: newOptions,
        correctAnswers: newCorrectAnswers,
      });
    }
  };

  const handleSave = () => {
    onSave(editForm);
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="p-6">
        <div className="pb-3 mb-4 border-b">
          <h4 className="text-xl font-semibold text-gray-900">Chỉnh sửa câu hỏi</h4>
        </div>

        <div className="space-y-4">
          {/* Chu thich tieng Viet */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Nội dung câu hỏi
            </Label>
            <Textarea
              id="question"
              value={editForm.question}
              onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              placeholder="Nhập câu hỏi của bạn"
              rows={3}
            />
          </div>

          {/* Chu thich tieng Viet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Loại câu hỏi</Label>
              <Select
                value={editForm.type}
                onValueChange={(value: QuestionType) => {
                  const newEditForm = { ...editForm, type: value };

                  if (value === QuestionType.TRUE_FALSE) {
                    newEditForm.options = ["True", "False"];
                    newEditForm.correctAnswers = [0];
                  } else if (editForm.type === QuestionType.TRUE_FALSE) {
                    newEditForm.options = ["Option A", "Option B", "Option C", "Option D"];
                    if (value === QuestionType.SINGLE_CHOICE) {
                      newEditForm.correctAnswers = [0];
                    } else {
                      newEditForm.correctAnswers = [0];
                    }
                  } else if (value === QuestionType.SINGLE_CHOICE) {
                    newEditForm.correctAnswers =
                      editForm.correctAnswers.length > 0 ? [editForm.correctAnswers[0]] : [0];
                  }

                  setEditForm(newEditForm);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Nhiều lựa chọn</SelectItem>
                  <SelectItem value="single_choice">Một lựa chọn</SelectItem>
                  <SelectItem value="true_false">Đúng/Sai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points" className="text-sm font-medium">
                Điểm
              </Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={editForm.point}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    point: parseInt(e.target.value, 10) || 1,
                  })
                }
              />
            </div>
          </div>

          {/* Chu thich tieng Viet */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Đáp án</Label>
            {editForm.type === QuestionType.MULTIPLE_CHOICE ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {editForm.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2 p-2 border rounded-xs">
                    <Checkbox
                      checked={editForm.correctAnswers.includes(optionIndex)}
                      onCheckedChange={(checked) => toggleCorrectAnswer(optionIndex, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        placeholder={`Đáp án ${optionIndex + 1}`}
                      />
                    </div>
                    {editForm.options.length > 2 && editForm.type !== QuestionType.TRUE_FALSE && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(optionIndex)}
                        className="text-red-600"
                      >
                        <MdDelete className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={editForm.correctAnswers[0]?.toString()}
                onValueChange={(value: string) => {
                  setEditForm({
                    ...editForm,
                    correctAnswers: [parseInt(value, 10)],
                  });
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {editForm.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2 p-2 border rounded-md">
                    <RadioGroupItem value={optionIndex.toString()} />
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        placeholder={`Đáp án ${optionIndex + 1}`}
                      />
                    </div>
                    {editForm.options.length > 2 && editForm.type !== QuestionType.TRUE_FALSE && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(optionIndex)}
                        className="text-red-600"
                      >
                        <MdDelete className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}

            {editForm.options.length < 6 && editForm.type !== QuestionType.TRUE_FALSE && (
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <MdAdd className="h-3 w-3 mr-2" />
                Thêm đáp án
              </Button>
            )}
          </div>

          {/* Chu thich tieng Viet */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="text-sm font-medium">
              Giải thích
            </Label>
            <Textarea
              id="explanation"
              value={editForm.explanation}
              onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
              placeholder="Giải thích đáp án đúng"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <Button type="button" onClick={handleSave}>
              Lưu câu hỏi
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const LessonFormDialog = ({ open, onOpenChange, lessonId, chapterId, courseId, onSuccess }: LessonFormDialogProps) => {
  const isEditing = !!lessonId;

  const { data: lesson, isLoading: isLessonLoading } = useLesson(lessonId || "", {
    includeQuestions: true,
  });

  const [questions, setQuestions] = useState<QuizQuestionForm[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const isLoading = createLessonMutation.isPending || updateLessonMutation.isPending || isLessonLoading;

  const form = useForm<LessonFormData>({
    resolver: yupResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      contentType: "video" as ContentType,
      preview: false,
      isPublished: false,
      duration: "00:00:00",
      resourceDescription: "",
      quizDescription: "",
      videoUrl: "",
      totalAttemptsAllowed: 3,
      passingScorePercentage: 70,
      questions: [],
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;
  const selectedContentType = watch("contentType");

  React.useEffect(() => {
    if (open) {
      if (isEditing && lesson && !isLessonLoading) {
        reset({
          title: lesson.title,
          contentType: lesson.contentType,
          preview: lesson.preview,
          isPublished: lesson.isPublished,
          duration: secondsToTimeString(lesson.duration || 0),
          resourceDescription: lesson.resource?.description || "",
          quizDescription: lesson.resource?.description || "",
          videoUrl: lesson.resource?.url || "",
          totalAttemptsAllowed: lesson.resource?.totalAttemptsAllowed || 3,
          passingScorePercentage: lesson.resource?.passingScorePercentage || 70,
          questions: [],
        });

        const lessonWithQuestions = lesson as LessonWithQuestions;
        const existingQuestions = lessonWithQuestions.resource?.questions || [];
        setQuestions(
          existingQuestions.map((q, index) => ({
            ...q,
            id: q.id || `existing-${index}`,
          })),
        );
        setEditingQuestionIndex(null);
      } else if (!isEditing) {
        reset({
          title: "",
          contentType: "video" as ContentType,
          preview: false,
          isPublished: false,
          duration: "00:00:00",
          resourceDescription: "",
          quizDescription: "",
          videoUrl: "",
          totalAttemptsAllowed: 3,
          passingScorePercentage: 70,
          questions: [],
        });

        setQuestions([]);
        setEditingQuestionIndex(null);
      }
    }
  }, [open, isEditing, lesson, isLessonLoading, reset]);

  const addNewQuestion = () => {
    const newQuestion: QuizQuestionForm = {
      id: `temp-${Date.now()}`,
      question: "",
      explanation: "",
      type: QuestionType.MULTIPLE_CHOICE,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswers: [0],
      point: 1,
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestionIndex(questions.length);
  };

  const editQuestion = (index: number) => {
    setEditingQuestionIndex(index);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
    }
  };

  const updateQuestion = (index: number, updatedQuestion: QuizQuestionForm) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleFormSubmit = (data: LessonFormData) => {
    const durationInSeconds = timeStringToSeconds(data.duration || "00:00:00");

    const lessonData: BackendLessonData = {
      title: data.title,
      chapterId,
      courseId,
      contentType: data.contentType,
      order: lesson?.order || 0, // D�ng th? t? hi?n c� ho?c 0 cho lesson m?i (backend s? x? l�)
      preview: data.preview,
      isPublished: data.isPublished,
      duration: durationInSeconds, // Backend y�u c?u don v? gi�y
      resource: {
        description: data.contentType === "quiz" ? data.quizDescription : data.resourceDescription,
        ...(data.contentType === "video" && { url: data.videoUrl }),
        ...(data.contentType === "quiz" && {
          totalAttemptsAllowed: data.totalAttemptsAllowed,
          passingScorePercentage: data.passingScorePercentage,
          questions: questions.map((q) => ({
            question: q.question,
            explanation: q.explanation,
            type: q.type,
            options: q.options,
            correctAnswers: q.correctAnswers,
            point: q.point,
          })),
        }),
      },
    };

    if (isEditing && lesson) {
      lessonData._id = lesson._id;
      lessonData.resourceId = lesson.resourceId;

      updateLessonMutation.mutate(
        {
          id: lesson._id!,
          ...lessonData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật bài học thành công!");
            onOpenChange(false);
            onSuccess?.();
          },
          onError: (error) => {
            console.error("Error updating lesson:", error);
            toast.error("Không thể cập nhật bài học");
          },
        },
      );
    } else {
      createLessonMutation.mutate(lessonData, {
        onSuccess: () => {
          toast.success("Tạo bài học thành công!");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error creating lesson:", error);
          toast.error("Không thể tạo bài học");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <MdEdit className="h-5 w-5" />
                Chỉnh sửa bài học
              </>
            ) : (
              <>
                <MdAdd className="h-5 w-5" />
                Thêm bài học mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin bài học bên dưới." : "Tạo bài học mới cho chương này."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Chu thich tieng Viet */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tiêu đề bài học" disabled={isLoading || isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Loại nội dung <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={isLoading || isSubmitting}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại nội dung" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(["video", "article", "quiz"] as const).map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {getContentTypeIcon(type)}
                                <span className="capitalize">{type}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Chu thich tieng Viet */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Thời lượng</FormLabel>
                        <FormControl>
                          <SimpleTimePicker
                            value={field.value || "00:00:00"}
                            onChange={field.onChange}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Chu thich tieng Viet */}
              <div className="space-y-4">
                {/* Chu thich tieng Viet */}
                {selectedContentType === "video" && (
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          URL Video <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/video.mp4"
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Chu thich tieng Viet */}
                {selectedContentType === "quiz" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="totalAttemptsAllowed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Số lần thử tối đa <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              max="10"
                              disabled={isLoading || isSubmitting}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passingScorePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Điểm qua (%) <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              max="100"
                              disabled={isLoading || isSubmitting}
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedContentType === "quiz" && (
                  <FormField
                    control={form.control}
                    name="quizDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Nhập mô tả bài kiểm tra"
                            rows={3}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Chu thich tieng Viet */}
                {selectedContentType === "quiz" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Câu hỏi ({questions.length})</h3>
                        <p className="text-sm text-gray-500">Thêm câu hỏi cho bài kiểm tra</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addNewQuestion}
                        disabled={isLoading || isSubmitting}
                      >
                        <MdAdd className="h-4 w-4 mr-2" />
                        Thêm câu hỏi
                      </Button>
                    </div>

                    {questions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <p>Chưa có câu hỏi nào. Thêm câu hỏi đầu tiên!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {questions.map((question, index) => (
                          <Card key={question.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Câu hỏi {index + 1}</Badge>
                                  <Badge variant="secondary" className="capitalize">
                                    {question.type.replace("_", " ")}
                                  </Badge>
                                  <Badge variant="outline">{question.point} pts</Badge>
                                </div>
                                <p className="font-medium text-gray-900 mb-2 line-clamp-2">
                                  {question.question || "Chưa có nội dung"}
                                </p>
                                <div className="text-sm text-gray-600">
                                  {question.options.length} đáp án, {question.correctAnswers.length} đáp án đúng
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => editQuestion(index)}
                                  disabled={isLoading || isSubmitting}
                                >
                                  <MdEdit className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteQuestion(index)}
                                  disabled={isLoading || isSubmitting}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <MdDelete className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Chu thich tieng Viet */}
                    {editingQuestionIndex !== null && (
                      <QuestionEditor
                        question={questions[editingQuestionIndex]}
                        onSave={(updatedQuestion: QuizQuestionForm) => {
                          updateQuestion(editingQuestionIndex, updatedQuestion);
                          setEditingQuestionIndex(null);
                        }}
                        onCancel={() => setEditingQuestionIndex(null)}
                      />
                    )}
                  </div>
                )}

                {selectedContentType !== "quiz" && (
                  <FormField
                    control={form.control}
                    name="resourceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Nhập mô tả nội dung"
                            rows={3}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Chu thich tieng Viet */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xs border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Đã xuất bản</FormLabel>
                          <div className="text-sm text-gray-600">Cho học viên thấy bài học này</div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preview"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xs border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Xem trước bài học</FormLabel>
                          <div className="text-sm text-gray-600">
                            Cho phép truy cập miễn phí bài học này làm xem trước
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading || isSubmitting}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading || isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo bài học"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonFormDialog;
