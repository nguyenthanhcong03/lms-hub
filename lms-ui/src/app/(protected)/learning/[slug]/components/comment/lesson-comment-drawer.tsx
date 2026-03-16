"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCreateComment, useInfiniteComments, useLoadReplies } from "@/hooks/use-comments";
import { CommentsService } from "@/services/comments";
import { useAuthStore } from "@/stores/auth-store";
import { IComment } from "@/types/comment";
import { Editor as TipTapEditor } from "@tiptap/react";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CommentEditor from "./comment-editor";
import CommentList from "./comment-list";

interface LessonCommentDrawerProps {
  lessonId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Thành phần ngăn bình luận bài học
const LessonCommentDrawer = ({ lessonId, isOpen, onOpenChange }: LessonCommentDrawerProps) => {
  // Lấy người dùng hiện tại từ auth store
  const currentUser = useAuthStore((state) => state.user);

  // React Query hooks - chỉ tải dữ liệu khi drawer mở
  const {
    data: commentsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteComments(lessonId);

  const createCommentMutation = useCreateComment();
  const { loadReplies, loadingReplies } = useLoadReplies(lessonId);

  // State cục bộ
  const [isComposing, setIsComposing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToSpecific, setReplyingToSpecific] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const [mainEditorContent, setMainEditorContent] = useState("");
  const [replyEditorContent, setReplyEditorContent] = useState("");
  const [mainEditor, setMainEditor] = useState<TipTapEditor | null>(null);
  const [replyEditor, setReplyEditor] = useState<TipTapEditor | null>(null);

  // Ref cho vùng cuộn
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách bình luận từ dữ liệu API
  const comments = commentsData?.pages.flatMap((page) => page.comments) || [];
  const totalComments = commentsData?.pages[0]?.pagination?.total || 0;

  // Bắt sự kiện cuộn để tải thêm
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Kích hoạt khi cuộn gần đáy (90%)
    if (scrolledPercentage > 0.9) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Gắn listener cuộn
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Không render nếu chưa đăng nhập
  if (!currentUser) {
    return null;
  }

  const handleSendMessage = async () => {
    const hasContent = mainEditorContent.replace(/<[^>]*>/g, "").trim().length > 0;

    if (hasContent) {
      try {
        await createCommentMutation.mutateAsync({
          content: mainEditorContent,
          lessonId,
        });

        setMainEditorContent("");
        setIsComposing(false);

        // Xóa nội dung editor
        if (mainEditor) {
          mainEditor.commands.clearContent();
        }
      } catch (error) {
        console.error("Failed to create comment:", error);
      }
    }
  };

  const handleSendReply = async (parentCommentId: string) => {
    // Use replyingToSpecific if available, otherwise fall back to replyingTo
    const actualParentId = replyingToSpecific || replyingTo || parentCommentId;

    const hasContent = replyEditorContent.replace(/<[^>]*>/g, "").trim().length > 0;

    if (hasContent) {
      try {
        const mentionRegex = /<span[^>]*data-id="([^"]*)"[^>]*>/g;
        const mentions: string[] = [];
        let match;
        while ((match = mentionRegex.exec(replyEditorContent)) !== null) {
          mentions.push(match[1]);
        }

        await createCommentMutation.mutateAsync({
          content: replyEditorContent,
          lessonId,
          parentId: actualParentId,
          mentions: mentions.length > 0 ? mentions : undefined,
        });

        // No need for local state management anymore
        // React Query cache will be updated automatically by useCreateComment

        setShowReplies((prev: Record<string, boolean>) => ({
          ...prev,
          [actualParentId]: true,
        }));

        setReplyEditorContent("");
        setReplyingTo(null);
        setReplyingToSpecific(null);

        // Xóa nội dung editor
        if (replyEditor) {
          replyEditor.commands.clearContent();
        }
      } catch (error) {
        console.error("Failed to create reply:", error);
      }
    }
  };

  const handleCancel = () => {
    if (mainEditor && mainEditor.view && mainEditor.view.dom) {
      try {
        mainEditor.commands.clearContent();
      } catch (error) {
        console.warn("Editor not ready for clearing:", error);
      }
    }
    setMainEditorContent("");
    setIsComposing(false);
  };

  const handleCancelReply = () => {
    if (replyEditor && replyEditor.view && replyEditor.view.dom) {
      try {
        replyEditor.commands.clearContent();
      } catch (error) {
        console.warn("Reply editor not ready for clearing:", error);
      }
    }
    setReplyEditorContent("");
    setReplyingTo(null);
    setReplyingToSpecific(null);
  };

  const handleReply = (commentId: string, userName: string) => {
    // Hàm đệ quy để tìm comment theo ID hoặc username
    const findComment = (
      comments: IComment[],
      searchId: string,
      searchUserName?: string,
    ): { comment: IComment; parentId?: string } | null => {
      for (const comment of comments) {
        if (comment._id === searchId || comment.user?.username === searchUserName) {
          return { comment };
        }
        if (comment.replies?.length > 0) {
          const found = findComment(comment.replies, searchId, searchUserName);
          if (found) {
            return { ...found, parentId: comment._id };
          }
        }
      }
      return null;
    };

    // Tìm bình luận mục tiêu
    const found = findComment(comments, commentId);
    if (!found) {
      return;
    }

    // Khi trả lời, parentId là chính comment đang được trả lời
    const parentCommentId = commentId;
    const specificCommentId = commentId;
    const parentLevel = found.comment.level || 1;

    // Kiểm tra giới hạn cấp phản hồi (tối đa 5 cấp)
    if (!CommentsService.canAddReply(parentLevel)) {
      toast.error("Không thể trả lời ở cấp này. Tối đa 5 cấp phản hồi.");
      return;
    }

    setReplyingTo(parentCommentId);
    setReplyingToSpecific(specificCommentId);

    // Tìm userId để gắn mention
    const foundUser = findComment(comments, commentId, userName);
    const userId = foundUser?.comment.userId || commentId;

    const mentionHTML = `<span data-type="mention" data-id="${userId}" data-label="${userName}">@${userName}</span>&nbsp;`;

    setReplyEditorContent(mentionHTML);

    setTimeout(() => {
      if (replyEditor && replyEditor.view && replyEditor.view.dom) {
        try {
          replyEditor.commands.setContent(mentionHTML);
          replyEditor.commands.focus("end");
        } catch (error) {
          console.warn("Editor chưa sẵn sàng:", error);
        }
      }
    }, 100);
  };

  const handleLoadReplies = async (commentId: string) => {
    const success = await loadReplies(commentId, comments);
    if (success) {
      setShowReplies((prev: Record<string, boolean>) => ({
        ...prev,
        [commentId]: true,
      }));
    }
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev: Record<string, boolean>) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      direction="right"
      dismissible={true}
      shouldScaleBackground={false}
    >
      <DrawerContent className="h-full w-full! sm:w-150! md:w-175! lg:w-200! max-w-200!">
        <div className="w-full h-full">
          <DrawerHeader className="border-b border-primary/15 bg-primary/5 px-4 pb-3 sm:px-6 sm:pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <DrawerTitle className="truncate text-base font-semibold text-foreground sm:text-lg">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      <span className="text-sm sm:text-base">Đang tải...</span>
                    </div>
                  ) : (
                    `${totalComments} bình luận`
                  )}
                </DrawerTitle>
                <DrawerDescription className="mt-0.5 hidden text-xs text-muted-foreground sm:mt-1 sm:block sm:text-sm">
                  Nếu thấy bình luận rác, vui lòng báo quản trị viên.
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 shrink-0 rounded-xs p-0 sm:h-8 sm:w-8">
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex flex-col h-full">
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 sm:pb-24 space-y-3 sm:space-y-4"
            >
              <div className="mb-3 sm:mb-4">
                <CommentEditor
                  isComposing={isComposing}
                  content={mainEditorContent}
                  isPending={createCommentMutation.isPending}
                  onComposingChange={setIsComposing}
                  onContentChange={setMainEditorContent}
                  onEditorReady={setMainEditor}
                  onSubmit={handleSendMessage}
                  onCancel={handleCancel}
                />
              </div>

              <CommentList
                comments={comments}
                isLoading={isLoading}
                error={error}
                replyingTo={replyingTo}
                replyingToSpecific={replyingToSpecific}
                replyContent={replyEditorContent}
                isPending={createCommentMutation.isPending}
                showReplies={showReplies}
                loadingReplies={loadingReplies}
                lessonId={lessonId}
                onReply={handleReply}
                onToggleReplies={toggleReplies}
                onLoadReplies={handleLoadReplies}
                onReplyContentChange={setReplyEditorContent}
                onReplyEditorReady={setReplyEditor}
                onReplySubmit={handleSendReply}
                onReplyCancel={handleCancelReply}
                onRefetch={refetch}
              />

              {/* Chỉ báo tải thêm khi cuộn vô hạn */}
              {isFetchingNextPage && (
                <div className="flex justify-center py-3 sm:py-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground sm:gap-2">
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Đang tải thêm...</span>
                  </div>
                </div>
              )}

              {/* Chỉ báo đã tải hết bình luận */}
              {!hasNextPage && comments.length > 0 && (
                <div className="flex justify-center py-3 sm:py-4">
                  <span className="text-xs text-muted-foreground/70 sm:text-sm">Đã tải hết bình luận</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LessonCommentDrawer;
