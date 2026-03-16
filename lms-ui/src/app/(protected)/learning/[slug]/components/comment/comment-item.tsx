"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentActions from "./comment-actions";
import ReplyEditor from "./reply-editor";

import { Editor as TipTapEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { useUpdateComment } from "@/hooks/use-comments";
import Toolbar from "@/components/tiptap/toolbar";
import Editor from "@/components/tiptap/editor";
import { IComment } from "@/types/comment";
import { DEFAULT_AVATAR } from "@/constants";

interface CommentItemProps {
  comment: IComment;
  isReplying: boolean;
  replyContent: string;
  isPending: boolean;
  showReplies: boolean;
  loadingReplies: boolean;
  lessonId?: string; // Add lessonId for cache invalidation
  onReply: (commentId: string, userName: string) => void;
  onToggleReplies: () => void;
  onLoadReplies: () => void;
  onReplyContentChange: (content: string) => void;
  onReplyEditorReady: (editor: TipTapEditor) => void;
  onReplySubmit: () => void;
  onReplyCancel: () => void;
  replyingToSpecific?: string | null;
  // Props phục vụ render đệ quy
  showRepliesState?: Record<string, boolean>;
  loadingRepliesState?: Record<string, boolean>;
  onToggleRepliesWithId?: (commentId: string) => void;
  onLoadRepliesWithId?: (commentId: string) => void;
  // Cấp độ lồng để áp dụng giao diện
  level?: number;
}

// Thành phần một bình luận
const CommentItem = ({
  comment,
  isReplying,
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
  replyingToSpecific,
  showRepliesState,
  loadingRepliesState,
  onToggleRepliesWithId,
  onLoadRepliesWithId,
  level = 1,
}: CommentItemProps) => {
  // Trạng thái chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editEditor, setEditEditor] = useState<TipTapEditor | null>(null);

  // Hook cập nhật bình luận
  const updateCommentMutation = useUpdateComment(lessonId);
  const isUpdating = updateCommentMutation.isPending;

  // Tính kích thước avatar theo cấp độ lồng
  const avatarSize = level === 1 ? "h-7 w-7 sm:h-8 sm:w-8" : "h-6 w-6 sm:h-7 sm:w-7";
  const avatarTextSize = level === 1 ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs";

  // Xử lý hành động chỉnh sửa
  const handleEditStart = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleEditSave = async () => {
    const hasContent = editContent.replace(/<[^>]*>/g, "").trim().length > 0;

    if (!hasContent) {
      alert("Nội dung bình luận không được để trống");
      return;
    }

    await updateCommentMutation.updateComment({
      id: comment._id,
      data: { content: editContent },
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    if (editEditor) {
      editEditor.commands.setContent(comment.content);
    }
  };
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <Avatar className={avatarSize}>
          <AvatarImage src={comment.user?.avatar || DEFAULT_AVATAR} alt={comment.user?.username || "Người dùng"} />
          <AvatarFallback className={`bg-primary text-primary-foreground ${avatarTextSize}`}>
            {comment.user?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="truncate text-xs font-medium text-primary sm:text-sm">
              {comment.user?.username || "Người dùng"}
            </span>
            <span className="whitespace-nowrap text-[10px] text-muted-foreground sm:text-xs">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          {isEditing ? (
            <div className="mt-1">
              <div className="overflow-hidden rounded-xs border border-primary/15 bg-background">
                <div className="bg-primary/5">
                  <Toolbar />
                </div>
                <Editor content={editContent} onChange={setEditContent} onReady={setEditEditor} />
                <div className="flex justify-end gap-1.5 sm:gap-2 p-2 sm:p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditCancel}
                    disabled={isUpdating}
                    className="h-8 border-primary/20 text-primary hover:bg-primary/10 sm:h-9 text-xs sm:text-sm"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    disabled={isUpdating}
                    size="sm"
                    className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 sm:h-9 text-xs sm:text-sm"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1.5 sm:mr-2 animate-spin" />
                        <span className="hidden sm:inline">Đang cập nhật...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      "Lưu"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="mt-1 wrap-break-word text-xs leading-relaxed text-foreground sm:text-sm"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          )}

          <CommentActions
            comment={comment}
            userName={comment.user?.username || "Người dùng"}
            lessonId={lessonId}
            onReply={onReply}
            onEdit={handleEditStart}
            level={level}
          />

          {isReplying && replyingToSpecific === comment._id && (
            <ReplyEditor
              content={replyContent}
              isPending={isPending}
              onContentChange={onReplyContentChange}
              onEditorReady={onReplyEditorReady}
              onSubmit={onReplySubmit}
              onCancel={onReplyCancel}
            />
          )}

          {/* Nút hiển thị/ẩn phản hồi */}
          {comment.replyCount > 0 && !showReplies && (
            <div className="mt-1.5 sm:mt-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  onToggleReplies();
                  // Nếu chưa tải phản hồi thì gọi API để tải
                  if (comment.replies.length === 0) {
                    onLoadReplies();
                  }
                }}
                disabled={loadingReplies}
                className="h-auto p-0 text-xs sm:text-sm text-gray-600 cursor-pointer hover:text-blue-600 font-medium underline-offset-4 hover:underline"
              >
                {loadingReplies ? (
                  <>
                    <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin mr-1" />
                    <span className="text-xs sm:text-sm">Đang tải...</span>
                  </>
                ) : (
                  `Xem ${comment.replyCount} ${comment.replyCount === 1 ? "phản hồi" : "phản hồi"}`
                )}
              </Button>
            </div>
          )}

          {/* Danh sách phản hồi */}
          {showReplies && comment.replies.length > 0 && (
            <div className="mt-2 sm:mt-3 space-y-3 sm:space-y-4 relative ml-3 sm:ml-4">
              {/* Đường dọc nối phản hồi theo cấp */}
              <div
                className="absolute -left-8 -top-16 w-px bg-primary/15 sm:-left-10"
                style={{
                  height: `${4 + (comment.replies.length - 1) * 5.5 + 3.2}rem`,
                }}
              ></div>

              <div className="pl-4 sm:pl-6 space-y-2 sm:space-y-3">
                <div className="mb-2 sm:mb-3">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={onToggleReplies}
                    className="h-auto cursor-pointer p-0 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:text-sm"
                  >
                    Ẩn {comment.replyCount} phản hồi
                  </Button>
                </div>

                {/* Hiển thị phản hồi bằng đệ quy */}
                {comment.replies.map((reply: IComment) => (
                  <div key={reply._id} className="relative">
                    {/* Đường cong nối từ nhánh chính đến phản hồi con */}
                    <div className="absolute -left-12 top-2 h-4 w-12 rounded-bl-xs border-l border-b border-r-0 border-t-0 border-primary/15 sm:-left-16 sm:w-16"></div>

                    <CommentItem
                      comment={reply}
                      isReplying={replyingToSpecific === reply._id}
                      replyContent={replyContent}
                      isPending={isPending}
                      showReplies={showRepliesState?.[reply._id] || false}
                      loadingReplies={loadingRepliesState?.[reply._id] || false}
                      lessonId={lessonId}
                      onReply={onReply}
                      onToggleReplies={() => onToggleRepliesWithId?.(reply._id)}
                      onLoadReplies={() => onLoadRepliesWithId?.(reply._id)}
                      onReplyContentChange={onReplyContentChange}
                      onReplyEditorReady={onReplyEditorReady}
                      onReplySubmit={onReplySubmit}
                      onReplyCancel={onReplyCancel}
                      replyingToSpecific={replyingToSpecific}
                      showRepliesState={showRepliesState}
                      loadingRepliesState={loadingRepliesState}
                      onToggleRepliesWithId={onToggleRepliesWithId}
                      onLoadRepliesWithId={onLoadRepliesWithId}
                      level={level + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
