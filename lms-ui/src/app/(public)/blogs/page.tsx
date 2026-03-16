"use client";

import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";

// Dynamic import for below-the-fold content (progressive loading)
const BlogsContent = dynamic(() => import("./components/blogs-content"));

// Header component (above-the-fold, critical) - Arrow function
const BlogsHeader = () => (
  <div className="text-center mb-10 sm:mb-12 md:mb-16">
    <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
      <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className="text-xs sm:text-sm font-medium">Blog Của Chúng Tôi</span>
    </div>
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
      Bài Viết & Chia Sẻ Mới Nhất
    </h1>
    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
      Khám phá kiến thức, hướng dẫn và tin tức ngành từ đội ngũ chuyên gia. Luôn cập nhật xu hướng mới nhất và các thực
      hành tốt nhất.
    </p>
  </div>
);

// Main page component - Arrow function
const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Critical above-the-fold content - loads immediately */}
        <BlogsHeader />

        {/* Below-the-fold content - progressive loading with SEO */}
        <BlogsContent />
      </div>
    </div>
  );
};

export default BlogPage;
