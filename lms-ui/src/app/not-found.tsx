"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-8 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex h-full w-full flex-col items-center justify-center gap-2">
        {/* 404 Number */}
        <h1 className="text-[12rem] md:text-[16rem] leading-tight font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent drop-shadow-sm">
          404
        </h1>

        {/* Error Message */}
        <span className="text-2xl md:text-3xl font-medium text-foreground mb-2">Ối! Không tìm thấy trang!</span>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-md px-4 mb-8">
          Có vẻ như trang bạn đang tìm kiếm <br className="hidden md:block" />
          không tồn tại hoặc đã bị xóa.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {/* Go Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="relative h-12 px-6 font-semibold transition-all duration-300 group 
            rounded-xl border-primary/20 hover:border-primary/40 
            hover:bg-primary/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Quay Lại
          </Button>

          {/* Back to Home Button */}
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground
            shadow-lg hover:shadow-xl transition-all duration-300
            h-12 px-6 rounded-xl font-semibold relative overflow-hidden group"
            asChild
          >
            <Link href="/">
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <Home className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />

              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                Về Trang Chủ
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
