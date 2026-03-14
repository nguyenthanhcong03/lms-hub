"use client";
import { Accordion, AccordionItem, Button } from "@heroui/react";
import { useEffect, useState } from "react";

import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { LuSquarePlus } from "react-icons/lu";

import { toast } from "react-toastify";

import ConfirmationDialog from "@/shared/components/confirmation-dialog";
import { RootState, useAppDispatch, useAppSelector } from "@/shared/store";
import { resetInitialState as resetInitialStateChapter } from "@/shared/store/chapter";
import {
  createChapterAsync,
  deleteChapterAsync,
  getAllChaptersAsync,
} from "@/shared/store/chapter/action";
import { resetInitialState } from "@/shared/store/lesson";
import { deleteLessonAsync } from "@/shared/store/lesson/action";
import ListLesson from "../components/lesson-list";
import ModalAddEditLesson from "../components/modal-add-edit-lesson";
import ModalEditChapter from "../components/modal-edit-chapter";
import ModalAddEditQuiz from "../components/modal-add-edit-quiz";
import { Chapter } from "@/shared/types/chapter";

const OutlineCoursePage = ({ courseId }: { courseId: string }) => {
  const [openCreateEditLesson, setOpenCreateEditLesson] = useState({
    open: false,
    id: "",
    chapterId: "",
  });
  const [openCreateEditQuiz, setOpenCreateEditQuiz] = useState({
    open: false,
    id: "",
    chapterId: "",
  });
  const [openEditChapter, setOpenEditChapter] = useState({
    open: false,
    id: "",
  });

  const [openDeleteLesson, setOpenDeleteLesson] = useState({
    open: false,
    id: "",
  });
  const [openDeleteChapter, setOpenDeleteChapter] = useState({
    open: false,
    id: "",
  });
  const dispatch = useAppDispatch();
  const {
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError,
  } = useAppSelector((state: RootState) => state.lesson);
  const {
    chapters,
    pagination,
    isSuccessCreateEdit: isSuccessCreateEditChapter,
    isErrorCreateEdit: isErrorCreateEditChapter,
    messageErrorCreateEdit: messageErrorCreateEditChapter,
    isSuccessDelete: isSuccessDeleteChapter,
    isErrorDelete: isErrorDeleteChapter,
    messageErrorDelete: messageErrorDeleteChapter,
    typeError: typeErrorChapter,
  } = useAppSelector((state: RootState) => state.chapter);

  const handleGetListChapters = (courseId: string) => {
    const query = {
      params: {
        limit: -1,
        page: -1,
        courseId,
      },
    };

    dispatch(getAllChaptersAsync(query));
  };

  const handleCloseCreateEdit = () => {
    setOpenCreateEditLesson({
      open: false,
      id: "",
      chapterId: "",
    });
  };
  const handleCloseCreateEditQuiz = () => {
    setOpenCreateEditQuiz({
      open: false,
      id: "",
      chapterId: "",
    });
  };
  const handleCloseEditChapter = () => {
    setOpenEditChapter({
      open: false,
      id: "",
    });
  };
  const handleDeleteChapter = () => {
    dispatch(deleteChapterAsync(openDeleteChapter.id));
  };
  const handleCloseConfirmDeleteChapter = () => {
    setOpenDeleteChapter({
      open: false,
      id: "",
    });
  };
  const handleDeleteLesson = () => {
    dispatch(deleteLessonAsync(openDeleteLesson.id));
  };
  const handleCloseConfirmDeleteLesson = () => {
    setOpenDeleteLesson({
      open: false,
      id: "",
    });
  };
  useEffect(() => {
    if (courseId) {
      handleGetListChapters(courseId);
    }
  }, [courseId]);

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEditLesson.id) {
        toast.success("Chỉnh sửa bài học thành công");
      } else {
        toast.success("Tạo mới bài học thành công");
      }

      handleGetListChapters(courseId);
      dispatch(resetInitialState());
      handleCloseCreateEditQuiz();
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      if (typeError) {
        toast.error(messageErrorCreateEdit);
      } else {
        if (openCreateEditLesson.id) {
          toast.error(`Chỉnh sửa bài học thất bại`);
        } else {
          toast.error(`Tạo mới bài học thất bại`);
        }
      }
      dispatch(resetInitialState());
    }
  }, [
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    typeError,
    dispatch,
    courseId,
  ]);

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(`Xóa bài học thành công.`);

      handleGetListChapters(courseId);
      handleCloseConfirmDeleteLesson();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa chương thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete, courseId]);

  useEffect(() => {
    if (isSuccessCreateEditChapter) {
      if (openEditChapter.id) {
        toast.success("Chỉnh sửa chương thành công");
      } else {
        toast.success("Tạo mới chương thành công");
      }

      handleGetListChapters(courseId);
      dispatch(resetInitialStateChapter());
      handleCloseEditChapter();
    } else if (
      isErrorCreateEditChapter &&
      messageErrorCreateEditChapter &&
      typeErrorChapter
    ) {
      if (typeErrorChapter) {
        toast.error(messageErrorCreateEditChapter);
      } else {
        if (openEditChapter.id) {
          toast.error(`Chỉnh sửa chương thất bại`);
        } else {
          toast.error(`Tạo mới chương thất bại`);
        }
      }
      dispatch(resetInitialStateChapter());
    }
  }, [
    isSuccessCreateEditChapter,
    isErrorCreateEditChapter,
    messageErrorCreateEditChapter,
    typeErrorChapter,
    dispatch,
    courseId,
  ]);
  useEffect(() => {
    if (isSuccessDeleteChapter) {
      toast.success(`Xóa chương thành công.`);
      handleGetListChapters(courseId);
      handleCloseConfirmDeleteChapter();
      dispatch(resetInitialStateChapter());
    } else if (isErrorDeleteChapter && messageErrorDeleteChapter) {
      toast.error(`Xóa chương thất bại.`);
      dispatch(resetInitialStateChapter());
    }
  }, [
    isSuccessDeleteChapter,
    isErrorDeleteChapter,
    messageErrorDeleteChapter,
    courseId,
  ]);

  const handleAddNewChapter = () => {
    dispatch(
      createChapterAsync({
        title: `${pagination?.total_count + 1}.`,
        course: courseId,
        order: +pagination?.total_count + 1,
      }),
    );
  };

  return (
    <>
      <ConfirmationDialog
        isOpen={openDeleteLesson.open}
        onCancel={handleCloseConfirmDeleteLesson}
        onConfirm={handleDeleteLesson}
        title={"Xóa bài học"}
      />

      {openCreateEditLesson.open && (
        <ModalAddEditLesson
          isOpen={openCreateEditLesson.open}
          onOpenChange={handleCloseCreateEdit}
          idLesson={openCreateEditLesson.id}
          chapterId={openCreateEditLesson.chapterId}
          courseId={courseId}
        />
      )}
      {openCreateEditQuiz.open && (
        <ModalAddEditQuiz
          isOpen={openCreateEditQuiz.open}
          onOpenChange={handleCloseCreateEditQuiz}
          idLesson={openCreateEditQuiz.id}
          chapterId={openCreateEditQuiz.chapterId}
          courseId={courseId}
        />
      )}
      {openEditChapter.open && (
        <ModalEditChapter
          isOpen={openEditChapter.open}
          onOpenChange={handleCloseEditChapter}
          idChapter={openEditChapter.id}
        />
      )}

      {openDeleteChapter.open && (
        <ConfirmationDialog
          isOpen={openDeleteChapter.open}
          onCancel={handleCloseConfirmDeleteChapter}
          onConfirm={handleDeleteChapter}
          title={"Xóa chương"}
        />
      )}

      <div className="space-y-4">
        <Accordion
          className="p-0"
          itemClasses={{
            title: " font-semibold text-default-900 ",
            base: "p-0 rounded-md my-1",
            trigger: "p-4 cursor-pointer",
            indicator: "text-medium",
            content: "text-sm p-4 bg-[#f2f4f7]",
          }}
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
          {(chapters as Chapter[])?.map((chapter, index) => {
            return (
              <AccordionItem
                key={index}
                title={
                  <div className="flex items-center justify-between">
                    <div className="relative flex flex-1 items-center gap-2">
                      <IoMenu size={20} className="flex-shrink-0" />
                      <h3>{chapter?.title}</h3>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenEditChapter({
                            open: true,
                            id: chapter?._id,
                          });
                        }}
                      >
                        <FiEdit />
                      </span>

                      <span
                        className="cursor-pointer hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDeleteChapter({
                            open: true,
                            id: chapter._id,
                          });
                        }}
                      >
                        <FaRegTrashCan />
                      </span>
                    </div>
                  </div>
                }
              >
                <ListLesson
                  chapter={chapter}
                  setOpenCreateEditLesson={setOpenCreateEditLesson}
                  setOpenCreateEditQuiz={setOpenCreateEditQuiz}
                  setOpenDeleteLesson={setOpenDeleteLesson}
                />
              </AccordionItem>
            );
          })}
        </Accordion>
        <Button
          onPress={handleAddNewChapter}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 p-3 text-sm text-white shadow-lg shadow-indigo-500/50"
          size="md"
        >
          <LuSquarePlus size={18} />
          <span>Thêm chương mới</span>
        </Button>
      </div>
    </>
  );
};

export default OutlineCoursePage;
