"use client";

import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Editor as TipTapEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";

interface ReplyEditorProps {
  content: string;
  isPending: boolean;
  onContentChange: (content: string) => void;
  onEditorReady: (editor: TipTapEditor) => void;
  onSubmit: () => void;
  onCancel: () => void;
  avatarSize?: "sm" | "md";
}

// Thành phần soạn phản hồi
const ReplyEditor = ({
  content,
  isPending,
  onContentChange,
  onEditorReady,
  onSubmit,
  onCancel,
  avatarSize = "md",
}: ReplyEditorProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const hasContent = content.replace(/<[^>]*>/g, "").trim().length > 0;
  const avatarClasses = avatarSize === "sm" ? "h-7 w-7" : "h-8 w-8";
  const avatarTextSize = avatarSize === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="mt-2 sm:mt-3">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <Avatar className={avatarClasses}>
          <AvatarImage src="" />
          <AvatarFallback className={`bg-primary/20 text-primary ${avatarTextSize}`}>
            {currentUser?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 overflow-hidden rounded-xs border border-primary/15 bg-background">
          <div className="bg-primary/5">
            <Toolbar />
          </div>

          <Editor content={content} onChange={onContentChange} onReady={onEditorReady} />

          <div className="flex justify-end gap-1.5 sm:gap-2 p-2 sm:p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-8 border-primary/20 text-primary hover:bg-primary/10 sm:h-9 text-xs sm:text-sm"
            >
              HỦY
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!hasContent || isPending}
              size="sm"
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 sm:h-9 text-xs sm:text-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1.5 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">ĐANG GỬI...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                "PHẢN HỒI"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyEditor;
