"use client";
import { useAuth } from "@/shared/contexts/auth-context";
import { createComment } from "@/shared/services/comment";
import { useAppDispatch } from "@/shared/store";
import { addComment } from "@/shared/store/comment";
import { TCommentFormData } from "@/shared/types/comment";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CommentForm from "./comment-form";

const CommentMainForm = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id") || "";
  const dispatch = useAppDispatch();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { user } = useAuth();

  const handleAddComment = async (data: TCommentFormData) => {
    const res = await createComment({
      ...data,
      lessonId,
    });
    dispatch(addComment(res.data));

    setShowCommentForm(false);
  };

  return (
    <>
      {showCommentForm ? (
        <CommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowCommentForm(false)}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src={user?.avatar || "/images/profile-photo.webp"}
            width={40}
            height={40}
            alt=""
            className="shrink-0 rounded-full"
          />
          <div
            className="w-full rounded-lg bg-[#eef4fc] p-2.5 text-sm font-semibold text-gray-500"
            onClick={() => setShowCommentForm(true)}
          >
            Viết bình luận...
          </div>
        </div>
      )}
    </>
  );
};

export default CommentMainForm;
