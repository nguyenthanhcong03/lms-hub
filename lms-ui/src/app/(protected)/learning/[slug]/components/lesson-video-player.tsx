"use client";

import React, { useState, useEffect } from "react";

interface LessonVideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  onComplete?: () => void;
  isSidebarOpen?: boolean;
}

// Thành phần trình phát video bài học
const LessonVideoPlayer = ({ videoUrl, title, description, onComplete }: LessonVideoPlayerProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Tách ID video YouTube từ URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Tự đánh dấu hoàn thành sau khi video tải (mô phỏng)
  useEffect(() => {
    if (isVideoLoaded) {
      // Mô phỏng hoàn thành sau một khoảng thời gian
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVideoLoaded, onComplete]);

  if (!videoId) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div
          className="relative w-full rounded-xs border border-primary/20 bg-primary/95"
          style={{ paddingBottom: "56.25%" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h3 className="text-base sm:text-lg font-medium mb-2">Video không hợp lệ</h3>
              <p className="text-sm sm:text-base text-primary-foreground/75">
                Không thể phát video. Vui lòng kiểm tra lại URL.
              </p>
            </div>
          </div>
        </div>

        {/* Tiêu đề và mô tả */}
        <div className="mt-4 sm:mt-6 rounded-xs border border-primary/15 bg-primary/5 p-4 sm:p-6">
          <h1 className="mb-3 text-xl font-bold text-foreground sm:mb-4 sm:text-2xl">{title}</h1>
          {description && (
            <div className="prose prose-sm max-w-none prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground sm:prose">
              <div
                className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Trình phát video */}
      <div className="w-full bg-primary/10 p-0 sm:px-4 md:p-8 lg:p-12 xl:p-16">
        <div className="relative overflow-hidden rounded-xs border border-primary/15 pt-[56.25%] shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1`}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
          />
        </div>
      </div>

      {/* Tiêu đề và mô tả */}
      <div className="w-full mt-4 sm:mt-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="rounded-xs border border-primary/15 bg-primary/5 p-4 shadow-sm sm:p-6">
          <h1 className="mb-3 text-xl font-bold text-foreground sm:mb-4 sm:text-2xl">{title}</h1>
          {description && (
            <div className="prose prose-sm max-w-none prose-headings:text-primary prose-a:text-primary prose-strong:text-foreground sm:prose">
              <div
                className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonVideoPlayer;
