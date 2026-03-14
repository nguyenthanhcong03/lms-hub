"use client";
import { LabelStatus } from "@/shared/components/common/label-status";
import { getAllQuizAttemptsByUser } from "@/shared/services/quiz-attempt";
import { toHHMMSS } from "@/utils/common";
import { Button } from "@heroui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import QuizAttemptModal from "./quiz-attempt-modal";
import { Lesson } from "@/shared/types/lesson";
import { useRouter } from "next/navigation";

type QuizStartProps = {
  lessonInfo: Lesson;
  onStart: () => void;
  nextLesson: string | null;
};
type QuizAttempt = {
  _id: string;
  createdAt: string;
  answers: { is_correct: boolean }[];
  total_point: number;
  earned_point: number;
  time_taken: number;
  is_passed: boolean;
};
const QuizStart = ({ lessonInfo, onStart, nextLesson }: QuizStartProps) => {
  const router = useRouter();

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  const [openModalQuiz, setOpenModalQuiz] = useState({
    open: false,
    id: "",
  });
  const handleCloseModalQuiz = () => {
    setOpenModalQuiz({
      open: false,
      id: "",
    });
  };

  const fetchAllQuizAttemptsByUSer = async (quizId: string) => {
    const res = await getAllQuizAttemptsByUser({
      params: { quizId },
    });
    setQuizAttempts(res?.data || []);
  };

  useEffect(() => {
    if (lessonInfo?.resource?._id) {
      fetchAllQuizAttemptsByUSer(lessonInfo?.resource?._id);
    }
  }, [lessonInfo?.resource?._id]);

  return (
    <>
      {openModalQuiz.open && (
        <QuizAttemptModal
          isOpen={openModalQuiz.open}
          quizAttemptId={openModalQuiz.id}
          onOpenChange={handleCloseModalQuiz}
        />
      )}
      <div>
        <div className="mx-auto max-w-2xl rounded-lg border bg-white p-10 shadow-md">
          <div>
            <p className="mb-2">Bài kiểm tra</p>
            <h2 className="mb-2 text-2xl font-semibold">
              {lessonInfo?.resource?.title}
            </h2>
            <p className="text-gray-600">{lessonInfo?.resource?.description}</p>
          </div>
          <hr className="my-6" />
          <div className="space-y-4">
            <p>
              <span className="text-gray-500">Số câu hỏi:</span>{" "}
              <span className="font-medium">
                {lessonInfo?.resource?.questions.length}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Thời hạn bài tập:</span>{" "}
              <span className="font-medium">
                {toHHMMSS(lessonInfo?.resource?.duration)}
              </span>
            </p>
            <p>
              <span className="text-gray-500">Tổng số lần cố gắng:</span>
              <span className="font-medium">
                {quizAttempts?.length}/{lessonInfo?.resource?.limit}
              </span>
            </p>
            <p>
              <span className="text-gray-500">
                Điểm tối thiểu để hoàn thành:
              </span>
              <span className="font-medium">
                {lessonInfo?.resource?.passing_grade}%
              </span>
            </p>
          </div>
          <div className="mt-10 flex items-center gap-2">
            {lessonInfo?.resource?.limit > quizAttempts?.length && (
              <Button
                type="button"
                className="bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 data-[hover=true]:!opacity-100"
                radius="full"
                onPress={onStart}
              >
                Start
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              className="border-1 text-sm font-medium data-[hover=true]:!bg-gray-100"
              radius="full"
              isDisabled={!nextLesson}
              onPress={() =>
                router.push(
                  `/learning/${lessonInfo?.course?.slug}?id=${nextLesson}`,
                )
              }
            >
              Skip
            </Button>
          </div>
        </div>
        <hr className="my-10" />
        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-2">Ngày</th>
              <th className="border p-2">Câu hỏi</th>
              <th className="border p-2">Tổng số điểm</th>
              <th className="border p-2">Câu trả lời đúng</th>
              <th className="border p-2">Câu trả lời sai</th>
              <th className="border p-2">Điểm được chấm</th>
              <th className="border p-2">Thời gian hoành thành</th>
              <th className="border p-2">Kết quả</th>
              <th className="border p-2">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {quizAttempts?.length > 0
              ? quizAttempts.map((item) => (
                  <tr key={item._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">
                      {moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="border p-2">{item?.answers?.length}</td>
                    <td className="border p-2">
                      {item?.total_point.toFixed(2)}
                    </td>
                    <td className="border p-2">
                      {item?.answers?.filter((it) => it.is_correct).length}
                    </td>
                    <td className="border p-2">
                      {item?.answers?.filter((it) => !it.is_correct).length}
                    </td>
                    <td className="border p-2">
                      {item?.earned_point.toFixed(2)} (
                      {(
                        (item?.earned_point * 100) / item?.total_point || 0
                      ).toFixed(2)}
                      %)
                    </td>
                    <td className="border p-2">{toHHMMSS(item?.time_taken)}</td>
                    <td className="border p-2">
                      <LabelStatus
                        color={item?.is_passed ? "success" : "danger"}
                      >
                        {item?.is_passed ? "Đậu" : "Trượt"}
                      </LabelStatus>
                    </td>
                    <td className="border p-2">
                      <button
                        className="p-2 text-blue-500"
                        onClick={() => {
                          setOpenModalQuiz({
                            open: true,
                            id: item._id,
                          });
                        }}
                      >
                        <FaRegEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuizStart;
