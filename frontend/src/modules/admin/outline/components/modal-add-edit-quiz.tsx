import ModalNextUI from "@/shared/components/modal";
import { LessonType } from "@/shared/constants/enums";
import { useAppDispatch } from "@/shared/store";
import {
  createLessonAsync,
  updateLessonAsync,
} from "@/shared/store/lesson/action";
import { getSecondsFromHHMMSS } from "@/utils/common";
import { QuestionSchema, QuizInfoSchema } from "@/utils/validation";
import { Button, ModalFooter } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import QuestionStep from "./quiz/question-step";
import QuizInfoStep from "./quiz/quizInfo-step";

import { getLessonByAdmin } from "@/shared/services/lesson";
import PreviewStep from "./quiz/preview-step";

const steps = ["Quiz Info", "Questions", "Setting"];
interface ModalAddEditQuizProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  idLesson?: string;
  chapterId: string;
  courseId: string;
}

const ModalAddEditQuiz = ({
  isOpen,
  onOpenChange,
  idLesson,
  chapterId,
  courseId,
}: ModalAddEditQuizProps) => {
  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [quizInfo, setQuizInfo] = useState<QuizInfoSchema | null>(null);

  const [questions, setQuestions] = useState<QuestionSchema[]>([]);

  const quizInfoRef = useRef<{
    validateAndGetData: () => Promise<QuizInfoSchema | null>;
  } | null>(null);
  const questionStepRef = useRef<{
    validateAndGetData: () => Promise<QuestionSchema[]>;
  } | null>(null);

  const handleNextStep = async () => {
    if (currentStep === 0 && quizInfoRef.current) {
      const result = await quizInfoRef.current.validateAndGetData();
      if (!result) return;
      setQuizInfo(result);
    }

    if (currentStep === 1 && questionStepRef.current) {
      const result = await questionStepRef.current.validateAndGetData();
      if (!result) return;
      setQuestions(result);
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleSubmit = async () => {
    const duration =
      typeof quizInfo?.duration === "string"
        ? Math.max(0, getSecondsFromHHMMSS(quizInfo?.duration))
        : quizInfo?.duration;

    const payload = {
      ...quizInfo,
      duration,
      type: LessonType.QUIZ,
      questions,
      chapterId,
      courseId,
    };

    if (idLesson) {
      dispatch(
        updateLessonAsync({
          id: idLesson,
          ...payload,
        }),
      );
    } else {
      dispatch(createLessonAsync(payload));
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <QuizInfoStep ref={quizInfoRef} value={quizInfo} />;
      case 1:
        return <QuestionStep ref={questionStepRef} value={questions} />;
      case 2:
        return <PreviewStep questions={questions} quizInfo={quizInfo} />;
      default:
        return null;
    }
  };

  // Fetch API
  const fetchDetailsLesson = async (id: string) => {
    try {
      const res = await getLessonByAdmin(id);
      const data = res?.data;

      if (data) {
        setQuizInfo({
          title: data?.title,
          slug: data?.slug,
          duration: data?.resource?.duration,
          description: data?.resource?.description,
          passing_grade: data?.resource?.passing_grade,
          limit: data?.resource?.limit,
        });
        setQuestions(data.resource.questions);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (idLesson && isOpen) {
      fetchDetailsLesson(idLesson);
    }
  }, [isOpen, idLesson]);
  return (
    <ModalNextUI
      title={idLesson ? "Chỉnh sửa quiz" : "Thêm quiz"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      footer={
        <ModalFooter className="flex items-center justify-between border-t">
          <Button
            onPress={prevStep}
            type="button"
            disabled={currentStep === 0}
            color="default"
            variant="bordered"
            radius="full"
            className={`border-1 font-medium ${
              currentStep === 0 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-500 hover:bg-indigo-100 data-[hover=true]:!opacity-100"
              radius="full"
              onPress={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            {currentStep === 2 ? (
              <Button
                type="button"
                onPress={handleSubmit}
                className="bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
              >
                {idLesson ? "Cập nhật" : "Thêm mới"}
              </Button>
            ) : (
              <Button
                type="button"
                className="bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={handleNextStep}
              >
                Tiếp theo
              </Button>
            )}
          </div>
        </ModalFooter>
      }
      isFooter={false}
    >
      <div className="space-y-4">
        {/* Stepper UI */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-1 flex-col items-center"
            >
              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                      ? "bg-primary"
                      : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-center text-sm">{step}</span>
              {index !== steps.length - 1 && (
                <div className="absolute left-1/2 top-4 z-0 h-1 w-full bg-gray-300">
                  <div
                    className={`h-1 transition-all duration-500 ${
                      currentStep > index
                        ? "w-full bg-primary"
                        : "w-0 bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">{renderStepContent()}</div>
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditQuiz;
