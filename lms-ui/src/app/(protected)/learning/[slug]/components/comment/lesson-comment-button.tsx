"use client";

import { Button } from "@/components/ui/button";
import { FaComments } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface LessonCommentButtonProps {
  className?: string;
  onClick: () => void;
}

function LessonCommentButton({ className, onClick }: LessonCommentButtonProps) {
  return (
    <div className={cn("fixed z-50", className)}>
      <Button
        onClick={onClick}
        className={cn(
          "h-9 rounded-full border border-primary/15 bg-primary px-3 shadow-lg transition-all duration-300 sm:h-10 sm:px-4",
          "text-primary-foreground backdrop-blur-xl",
          "hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20",
          "active:scale-95 transform-gpu will-change-transform",
          "flex items-center justify-center gap-1.5 sm:gap-2 min-w-fit",
        )}
      >
        <FaComments className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
        <span className="text-xs font-medium text-primary-foreground sm:text-sm">Hỏi đáp</span>
      </Button>
    </div>
  );
}

export default LessonCommentButton;
