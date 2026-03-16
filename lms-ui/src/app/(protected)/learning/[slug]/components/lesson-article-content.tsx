"use client";

import React from "react";

interface LessonArticleContentProps {
  title: string;
  content: string;
}

// Thành phần hiển thị nội dung bài viết
const LessonArticleContent = ({ title, content }: LessonArticleContentProps) => {
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return `Cập nhật ${now.toLocaleDateString("vi-VN", options)}`;
  };

  return (
    <div className="h-full w-full bg-background">
      {/* Nội dung chính */}
      <div className="mx-auto flex h-full max-w-4xl flex-col">
        {/* Tiêu đề bài viết */}
        <div className="shrink-0 rounded-xs border-b border-primary/10 bg-primary/5 px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6 md:pt-12 md:pb-8">
          <h1 className="mb-2 text-xl font-bold leading-tight text-foreground sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">{getCurrentDate()}</p>
        </div>

        {/* Nội dung bài viết */}
        <div className="flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto px-4 pb-6 sm:px-6 sm:pb-8 md:pb-12"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--primary) / 0.35) hsl(var(--background))",
            }}
          >
            <div
              className="prose prose-sm max-w-none leading-relaxed prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground sm:prose md:prose-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonArticleContent;
