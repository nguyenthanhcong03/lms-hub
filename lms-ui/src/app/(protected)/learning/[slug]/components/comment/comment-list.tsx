"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import CommentItem from "./comment-item";

import { Editor as TipTapEditor } from "@tiptap/react";
import { IComment } from "@/types/comment";

interface CommentListProps {
  comments: IComment[];
  isLoading: boolean;
  error: Error | null;
  replyingTo: string | null;
  replyingToSpecific: string | null;
  replyContent: string;
  isPending: boolean;
  showReplies: Record<string, boolean>;
  loadingReplies: Record<string, boolean>;
  lessonId?: string; // Dùng để cập nhật cache theo bài học
  onReply: (commentId: string, userName: string) => void;
  onToggleReplies: (commentId: string) => void;
  onLoadReplies: (commentId: string) => void;
  onReplyContentChange: (content: string) => void;
  onReplyEditorReady: (editor: TipTapEditor) => void;
  onReplySubmit: (commentId: string) => void;
  onReplyCancel: () => void;
  onRefetch: () => void;
}

// Thành phần danh sách bình luận
const CommentList = ({
  comments,
  isLoading,
  error,
  replyingTo,
  replyingToSpecific,
  replyContent,
  isPending,
  showReplies,
  loadingReplies,
  lessonId,
  onReply,
  onToggleReplies,
  onLoadReplies,
  onReplyContentChange,
  onReplyEditorReady,
  onReplySubmit,
  onReplyCancel,
  onRefetch,
}: CommentListProps) => {
  // Trạng thái lỗi
  if (error) {
    return (
      <div className="py-8 px-4 text-center text-destructive sm:py-12">
        <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-50 sm:mb-4 sm:h-12 sm:w-12" />
        <p className="text-xs sm:text-sm">Không thể tải bình luận</p>
        <Button variant="outline" size="sm" onClick={onRefetch} className="mt-2 h-8 text-xs sm:h-9 sm:text-sm">
          Thử lại
        </Button>
      </div>
    );
  }

  // Trạng thái đang tải
  if (isLoading) {
    return (
      <div className="py-8 px-4 text-center text-muted-foreground sm:py-12">
        <Loader2 className="mx-auto mb-3 h-10 w-10 animate-spin opacity-50 sm:mb-4 sm:h-12 sm:w-12" />
        <p className="text-xs sm:text-sm">Đang tải bình luận...</p>
      </div>
    );
  }

  // Trạng thái rỗng
  if (comments.length === 0) {
    return (
      <div className="py-8 px-4 text-center text-muted-foreground sm:py-12">
        <MessageCircle className="mx-auto mb-3 h-10 w-10 opacity-50 sm:mb-4 sm:h-12 sm:w-12" />
        <p className="text-xs sm:text-sm">Chưa có bình luận nào</p>
        <p className="mt-1 text-[10px] sm:text-xs">Hãy là người bình luận đầu tiên!</p>
      </div>
    );
  }

  // Danh sách bình luận
  return (
    <div className="space-y-3 sm:space-y-4">
      {comments.map((comment: IComment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          isReplying={replyingTo === comment._id}
          replyContent={replyContent}
          isPending={isPending}
          showReplies={showReplies[comment._id] || false}
          loadingReplies={loadingReplies[comment._id] || false}
          lessonId={lessonId}
          onReply={onReply}
          onToggleReplies={() => onToggleReplies(comment._id)}
          onLoadReplies={() => onLoadReplies(comment._id)}
          onReplyContentChange={onReplyContentChange}
          onReplyEditorReady={onReplyEditorReady}
          onReplySubmit={() => onReplySubmit(comment._id)}
          onReplyCancel={onReplyCancel}
          replyingToSpecific={replyingToSpecific}
          showRepliesState={showReplies}
          loadingRepliesState={loadingReplies}
          onToggleRepliesWithId={onToggleReplies}
          onLoadRepliesWithId={onLoadReplies}
          level={1}
        />
      ))}
    </div>
  );
};

export default CommentList;
