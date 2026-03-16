"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommentReactions, useDeleteComment } from "@/hooks/use-comments";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { IComment, ReactionType, getReactionCounts, getUserReaction } from "@/types/comment";
import { Edit3, MoreHorizontal, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CommentActionsProps {
  comment: IComment;
  userName: string;
  lessonId?: string; // Dùng cho cập nhật cache
  onReply: (commentId: string, userName: string) => void;
  onEdit?: (commentId: string) => void;
  level?: number; // Cấp độ lồng của bình luận
}

// Thành phần thao tác bình luận
const CommentActions = ({ comment, userName, lessonId, onReply, onEdit, level = 1 }: CommentActionsProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?._id;
  const userReaction = getUserReaction(comment, currentUserId);
  const [showReactions, setShowReactions] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hook xử lý thao tác bình luận
  const { toggleReaction, isLoading } = useCommentReactions({ lessonId });
  const deleteCommentMutation = useDeleteComment(lessonId);

  // Kiểm tra người dùng hiện tại có phải chủ bình luận không
  const isCommentOwner = currentUserId === comment.userId;

  // Hàm xử lý sửa và xóa
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(comment._id);
    }
  };

  const handleDeleteClick = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
      return;
    }

    await deleteCommentMutation.deleteComment(comment._id);
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 150); // Delay nhẹ để tránh nhấp nháy
  };

  // Dọn timeout khi unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleReactionSelect = (reaction: ReactionType) => {
    toggleReaction(comment._id, reaction, currentUserId);
    setShowReactions(false); // Đóng popup sau khi chọn cảm xúc
  };

  const handleLikeClick = () => {
    // Chuyển trạng thái thích nhanh
    toggleReaction(comment._id, ReactionType.LIKE, currentUserId);
  };

  const getReactionDisplay = () => {
    if (!userReaction) {
      return {
        icon: <ThumbsUp className="h-4 w-4 mr-1" />,
        text: "Thích",
        color: "text-muted-foreground",
      };
    }

    switch (userReaction) {
      case ReactionType.LIKE:
        return {
          icon: <ThumbsUp className="h-4 w-4 mr-1" />,
          text: "Thích",
          color: "text-primary",
        };
      case ReactionType.LOVE:
        return {
          icon: <span className="text-sm mr-1">❤️</span>,
          text: "Yêu thích",
          color: "text-red-500",
        };
      case ReactionType.CARE:
        return {
          icon: <span className="mr-1">🤗</span>,
          text: "Quan tâm",
          color: "text-yellow-600",
        };
      case ReactionType.FUN:
        return {
          icon: <span className="mr-1">😂</span>,
          text: "Haha",
          color: "text-yellow-600",
        };
      case ReactionType.WOW:
        return {
          icon: <span className="mr-1">😮</span>,
          text: "Ngạc nhiên",
          color: "text-yellow-600",
        };
      case ReactionType.SAD:
        return {
          icon: <span className="mr-1">😢</span>,
          text: "Buồn",
          color: "text-yellow-600",
        };
      case ReactionType.ANGRY:
        return {
          icon: <span className="mr-1">😡</span>,
          text: "Tức giận",
          color: "text-red-600",
        };
      default:
        return {
          icon: <ThumbsUp className="h-3 w-3 mr-1" />,
          text: "Thích",
          color: "text-muted-foreground",
        };
    }
  };

  const reactionDisplay = getReactionDisplay();

  // Danh sách cảm xúc trong popup
  const reactions = [
    { type: ReactionType.LIKE, emoji: "👍", label: "Thích" },
    { type: ReactionType.LOVE, emoji: "❤️", label: "Yêu thích" },
    { type: ReactionType.CARE, emoji: "🤗", label: "Quan tâm" },
    { type: ReactionType.FUN, emoji: "😂", label: "Haha" },
    { type: ReactionType.WOW, emoji: "😮", label: "Ngạc nhiên" },
    { type: ReactionType.SAD, emoji: "😢", label: "Buồn" },
    { type: ReactionType.ANGRY, emoji: "😡", label: "Tức giận" },
  ];

  // Tính số lượng cảm xúc
  const reactionCounts = getReactionCounts(comment);

  const activeReactions = reactions.filter((reaction) => reactionCounts[reaction.type] > 0);

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mt-1.5 sm:mt-2">
      <div className="flex items-center justify-between gap-2">
        {/* Bên trái: nút thao tác */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeClick}
              disabled={isLoading}
              className={cn(
                "h-auto p-0.5 sm:p-1 text-[10px] sm:text-xs transition-all duration-300 hover:scale-105",
                "hover:bg-primary/10 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                reactionDisplay.color,
              )}
            >
              {reactionDisplay.icon}
              <span className="hidden sm:inline">{reactionDisplay.text}</span>
            </Button>

            {/* Bộ chọn cảm xúc - ẩn trên mobile */}
            <div
              className={cn(
                "absolute bottom-full left-0 mb-2 sm:mb-3 hidden sm:block",
                "rounded-xs border border-primary/15 bg-background px-3 py-1.5 shadow-lg sm:px-4 sm:py-2",
                "transition-all duration-200 ease-out z-50",
                showReactions
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2 pointer-events-none",
              )}
            >
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                {reactions.map((reaction, index) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReactionSelect(reaction.type)}
                    disabled={isLoading}
                    className={cn(
                      "group relative cursor-pointer p-1 sm:p-2 rounded-full",
                      "transition-all duration-300 ease-out",
                      "hover:bg-primary/10 active:bg-primary/20",
                      "transform-gpu will-change-transform",
                      "hover:scale-125 hover:-translate-y-2 hover:rotate-6",
                      "hover:shadow-lg hover:shadow-black/15",
                      "active:scale-95 active:transition-none",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:rotate-0",
                      userReaction === reaction.type && "scale-110 bg-primary/15 shadow-md ring-1 ring-primary/25",
                      "animate-in fade-in-0 zoom-in-95",
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                      transform: "translate3d(0, 0, 0)",
                      backfaceVisibility: "hidden",
                    }}
                    title={reaction.label}
                  >
                    <span
                      className={cn(
                        "text-xl sm:text-2xl block transition-all duration-300 ease-out",
                        "group-hover:scale-110 group-hover:rotate-3",
                        "group-active:scale-95",
                      )}
                      style={{
                        filter: userReaction === reaction.type ? "brightness(1.3) saturate(1.2)" : "none",
                      }}
                    >
                      {reaction.emoji}
                    </span>

                    {/* Nhãn khi hover */}
                    <div
                      className={cn(
                        "absolute -top-8 left-1/2 transform -translate-x-1/2",
                        "rounded-xs bg-foreground px-1.5 py-0.5 text-[10px] text-background sm:px-2 sm:py-1 sm:text-xs",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        "pointer-events-none whitespace-nowrap z-50",
                      )}
                    >
                      {reaction.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {level < 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment._id, userName)}
              className="h-auto p-0.5 text-[10px] text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-primary active:scale-95 sm:p-1 sm:text-xs"
            >
              Trả lời
            </Button>
          )}
        </div>

        {/* Bên phải: tổng hợp cảm xúc */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {totalReactions > 0 && (
            <div className="flex cursor-pointer items-center rounded-xs bg-primary/5 px-1.5 py-0.5 transition-colors hover:bg-primary/10 sm:px-2 sm:py-1">
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                {activeReactions.slice(0, 3).map((reaction) => (
                  <span key={reaction.type} className="text-xs sm:text-sm">
                    {reaction.emoji}
                  </span>
                ))}
              </div>
              {totalReactions > 0 && (
                <span className="ml-1 text-[10px] font-medium text-muted-foreground sm:ml-2 sm:text-sm">
                  {totalReactions}
                </span>
              )}
            </div>
          )}

          {isCommentOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-primary sm:p-1"
                  disabled={deleteCommentMutation.isPending}
                >
                  <MoreHorizontal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-30 sm:w-35">
                <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer text-xs sm:text-sm">
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  disabled={deleteCommentMutation.isPending}
                  variant="destructive"
                  className="cursor-pointer text-xs sm:text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">{deleteCommentMutation.isPending ? "Đang xóa..." : "Xóa"}</span>
                  <span className="sm:hidden">{deleteCommentMutation.isPending ? "..." : "Xóa"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentActions;
