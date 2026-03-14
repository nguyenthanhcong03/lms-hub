"use client";
import FallbackSpinner from "@/shared/components/fall-back";
import { LessonType } from "@/shared/constants/enums";
import { useAuth } from "@/shared/contexts/auth-context";
import { getAllChapters } from "@/shared/services/chapter";
import { getLesson } from "@/shared/services/lesson";
import { Chapter } from "@/shared/types/chapter";
import { Lesson } from "@/shared/types/lesson";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CommentDrawer = dynamic(
  () => import("./components/comment/comment-drawer"),
  {
    ssr: false,
  },
);
const LessonBottom = dynamic(() => import("./components/lesson-bottom"));
const LessonHeader = dynamic(() => import("./components/lesson-header"));
const LessonOutline = dynamic(() => import("./components/lesson-outline"));

const QuizContent = dynamic(() => import("./components/quiz-content"));
const LessonContent = dynamic(() => import("./components/lesson-content"));

const LessonDetailsPage = ({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: string;
}) => {
  const { user } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [lessonInfo, setLessonInfo] = useState<Lesson | null>(null);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const lessonList = chapters?.flatMap((chapter) => chapter.lessons) || [];

  const lessonIndex = lessonList.findIndex(
    (lesson) => lesson._id.toString() === lessonInfo?._id,
  );
  const nextLesson = lessonList[lessonIndex + 1]?._id || null;
  const prevLesson = lessonList[lessonIndex - 1]?._id || null;

  const fetchDetailsLesson = async () => {
    const res = await getLesson(lessonId);

    setLessonInfo(res?.data || null);
  };

  const fetchAllChapters = async (courseId: string) => {
    const res = await getAllChapters({
      params: { page: -1, limit: -1, courseId },
    });

    setChapters(res?.data?.chapters || []);
  };

  useEffect(() => {
    if (lessonId && courseSlug) {
      fetchDetailsLesson();
    }
  }, [lessonId, courseSlug]);

  useEffect(() => {
    if (lessonInfo?.course?._id) {
      fetchAllChapters(lessonInfo.course._id);
    }
  }, [lessonInfo?.course?._id]);

  const allow = useMemo(
    () =>
      lessonInfo?.course?._id &&
      user?.courses?.some((course) => course === lessonInfo.course._id),
    [user, lessonInfo],
  );

  if (lessonInfo && !allow) {
    notFound();
  }
  if (!lessonInfo) return <FallbackSpinner />;
  return (
    <>
      <LessonOutline
        isExpanded={isExpanded}
        chapters={chapters}
        lessonInfo={lessonInfo}
      />
      <CommentDrawer isExpanded={isExpanded} />

      <div
        className={`scrollbar-custom relative h-screen flex-1 overflow-x-auto transition-all duration-300 ease-in-out ${isExpanded ? "mr-0" : "md:mr-[23%]"}`}
      >
        <LessonHeader
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          chapters={chapters}
          lessonInfo={lessonInfo}
        />
        {lessonInfo?.type === LessonType.QUIZ ? (
          <QuizContent
            isExpanded={isExpanded}
            lessonInfo={lessonInfo}
            nextLesson={nextLesson}
          />
        ) : (
          <LessonContent isExpanded={isExpanded} lessonInfo={lessonInfo} />
        )}
      </div>

      <LessonBottom
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        lessonInfo={lessonInfo}
      />
    </>
  );
};

export default LessonDetailsPage;
