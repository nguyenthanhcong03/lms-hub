import { useAuth } from "@/shared/contexts/auth-context";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/shared/services/comment";
import { useAppDispatch } from "@/shared/store";
import {
  addComment,
  editComment,
  removeComment,
  setShowReplyComment,
} from "@/shared/store/comment";
import { getAllRepliesAsync } from "@/shared/store/comment/action";
import { TCommentFormData, CommentLesson } from "@/shared/types/comment";
import { Listbox, ListboxItem, useDisclosure } from "@heroui/react";
import moment from "moment";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import CommentForm from "./comment-form";
import ReactionBar from "./comment-reaction";
import PopoverAction from "./popover-action";
import ReactionModal from "./reaction-modal";
import { reactions } from "@/shared/constants/reaction.constant";

interface ICommentInfoProps {
  comment: CommentLesson;
}

const CommentInfo = ({ comment }: ICommentInfoProps) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id")?.toString() || "";

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const dispatch = useAppDispatch();

  const handleReplyToComment = async (data: TCommentFormData) => {
    const res = await createComment({
      ...data,
      lessonId,
      parentId: comment?.parentId || comment._id,
    });
    dispatch(addComment(res.data));
    setShowReplyForm(false);
  };

  const handleEditComment = async (data: TCommentFormData) => {
    try {
      const res = await updateComment({
        ...data,
        id: comment._id,
      });
      dispatch(
        editComment({
          id: comment._id,
          parentId: comment?.parentId,
          content: res.data.content,
          mentions: res.data.mentions,
        }),
      );
      setShowEditForm(false);
    } catch {
      toast.error("Có lỗi xảy ra trong quá trình chỉnh sửa bình luận");
    }
  };

  const handleDeleteComment = async () => {
    try {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa bình luận này không?",
      );
      if (!confirmDelete) return;
      setIsOpenPopover(false);
      await deleteComment(comment._id);
      dispatch(removeComment({ id: comment._id, parentId: comment?.parentId }));
    } catch {
      toast.error("Có lỗi xảy ra trong quá trình xóa bình luận");
    }
  };

  const handleFetchListReplies = async (parentId: string) => {
    dispatch(
      setShowReplyComment({ parentId, is_btn_reply: !comment?.is_btn_reply }),
    );

    dispatch(
      getAllRepliesAsync({
        params: {
          parentId,
        },
      }),
    );
  };

  //list reaction
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const listReactions = reactions.filter((item) => {
    const isExist = comment?.reactions?.some(
      (reaction) => reaction.type === item.type,
    );
    return isExist;
  });

  return (
    <>
      {isOpen && (
        <ReactionModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          comment={comment}
        />
      )}

      <div className="my-5">
        <div className="flex items-start gap-4">
          <Image
            src={comment?.user?.avatar || "/images/profile-photo.webp"}
            width={comment?.parentId ? 30 : 40}
            height={comment?.parentId ? 30 : 40}
            alt=""
            className="shrink-0 rounded-full"
          />

          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold">{comment.user.username}</p>
                <span className="text-xs text-gray-800">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <p
              className="comment text-sm leading-7"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />

            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ReactionBar comment={comment} parentId={comment?.parentId} />

                <button
                  className="text-xs font-bold text-[#0093FC]"
                  onClick={() => setShowReplyForm(true)}
                >
                  Phản hồi
                </button>
              </div>
              <div className="flex items-center gap-2">
                {!!comment?.reactions?.length && (
                  <div
                    onClick={onOpen}
                    className="flex cursor-pointer items-center justify-center gap-1"
                  >
                    <div>
                      {listReactions?.map((item) => (
                        <span key={item.type} className="">
                          {item.icon}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm">
                      {comment?.reactions?.length}
                    </span>
                  </div>
                )}

                <PopoverAction
                  trigger={
                    <button className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-100">
                      <BsThreeDots />
                    </button>
                  }
                  isOpen={isOpenPopover}
                  setIsOpen={setIsOpenPopover}
                >
                  <Listbox
                    aria-label="Actions"
                    onAction={(action) => {
                      if (action === "edit") {
                        setShowEditForm(true);
                        setIsOpenPopover(false);
                      } else if (action === "delete") {
                        handleDeleteComment();
                      } else if (action === "report") {
                        // Handle edit action
                      }
                    }}
                  >
                    {user?._id === comment?.user?._id ? (
                      <>
                        <ListboxItem key="edit">Chỉnh sửa</ListboxItem>
                        <ListboxItem key="delete">Xóa bình luận</ListboxItem>
                      </>
                    ) : null}
                    <ListboxItem key="report">Báo cáo vi phạm</ListboxItem>
                  </Listbox>
                </PopoverAction>
              </div>
            </div>
            {showEditForm && (
              <div className="mt-4">
                <CommentForm
                  onSubmit={handleEditComment}
                  onCancel={() => setShowEditForm(false)}
                  comment={comment}
                  isEdit
                />
              </div>
            )}
            {showReplyForm && (
              <div className="mt-4">
                <CommentForm
                  onSubmit={handleReplyToComment}
                  onCancel={() => setShowReplyForm(false)}
                  comment={comment}
                />
              </div>
            )}
            {!comment.parentId && !!comment?.replies_count && (
              <button
                className="-mb-4 -ml-3 mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold hover:bg-gray-100"
                onClick={() =>
                  handleFetchListReplies(comment?.parentId || comment._id)
                }
              >
                <span
                  className={`${comment?.is_btn_reply ? "rotate-180" : ""} `}
                >
                  <IoIosArrowDown />
                </span>
                <span className="text-sm">
                  {comment?.replies_count} phản hồi
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentInfo;
