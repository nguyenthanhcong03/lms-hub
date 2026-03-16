"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_AVATAR } from "@/constants";
import { useCourseReviewsWithLoadMore, useDeleteReview } from "@/hooks/use-reviews";
import { useAuthStore } from "@/stores/auth-store";
import { formatRelativeTime } from "@/utils/format";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, Edit, Filter, MoreHorizontal, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import WriteReviewDialog from "./write-review-dialog";

dayjs.extend(relativeTime);

interface Review {
  _id: string;
  userId: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  star: number;
  createdAt: string;
  content: string;
}

interface CourseReviewsProps {
  courseTitle?: string;
  courseId: string;
  fallbackAverageRating?: number;
  fallbackTotalReviews?: number;
}

const CourseReviews = ({
  courseTitle,
  courseId,
  fallbackAverageRating = 0,
  fallbackTotalReviews = 0,
}: CourseReviewsProps) => {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const currentUser = useAuthStore((state) => state.user);

  const deleteReviewMutation = useDeleteReview();

  const { reviews, averageRating, total, ratingDistribution, isLoading, isLoadingMore, hasNextPage, loadMore, reset } =
    useCourseReviewsWithLoadMore(courseId, {
      limit: 5,
      minStar: selectedRatingFilter || undefined,
    });

  const ratingDistributionArray = [5, 4, 3, 2, 1].map((stars) => {
    const count = parseInt(ratingDistribution[stars.toString()]?.toString() || "0");
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, count, percentage };
  });

  const formatReviewCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const isOwner = (review: Review) => currentUser?._id === review.userId;

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setOpenDropdownId(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    setOpenDropdownId(null);
    if (window.confirm("Bạn có chắc muốn xoá đánh giá này không?")) {
      await deleteReviewMutation.mutateAsync({ reviewId, courseId });
    }
  };

  const handleFilterChange = (rating: number | null) => {
    setSelectedRatingFilter(rating);
    setOpenDropdownId(null);
    reset();
  };

  const getFilterLabel = () => {
    if (selectedRatingFilter === null) return "Lọc đánh giá";
    return `${selectedRatingFilter} sao trở lên`;
  };

  const isFilterActive = selectedRatingFilter !== null;

  if (isLoading) {
    return (
      <div className="bg-background rounded-xs shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xs shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-semibold">Đánh giá học viên</h3>

        <div className="flex items-center gap-2">
          {currentUser && (
            <WriteReviewDialog courseTitle={courseTitle} courseId={courseId}>
              <Button size="sm">Viết đánh giá</Button>
            </WriteReviewDialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={isFilterActive ? "default" : "outline"} size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {getFilterLabel()}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleFilterChange(null)} className="flex justify-between">
                Tất cả đánh giá
                {selectedRatingFilter === null && <Check className="w-4 h-4" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {[5, 4, 3, 2, 1].map((rating) => (
                <DropdownMenuItem
                  key={rating}
                  onClick={() => handleFilterChange(rating)}
                  className="flex justify-between"
                >
                  <span>{rating} sao trở lên</span>
                  {selectedRatingFilter === rating && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="p-6 border-b grid sm:grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{(averageRating || fallbackAverageRating).toFixed(1)}</div>

          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(averageRating || fallbackAverageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground">{formatReviewCount(total || fallbackTotalReviews)} đánh giá</p>
        </div>

        <div className="space-y-2">
          {ratingDistributionArray.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-10 text-sm">{item.stars}⭐</span>

              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>

              <span className="w-10 text-sm text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="p-12 text-center">
          <Star className="w-10 h-10 mx-auto text-muted mb-4" />
          <h4 className="font-medium mb-2">Chưa có đánh giá</h4>
          <p className="text-sm text-muted-foreground mb-6">Hãy là người đầu tiên đánh giá khóa học này</p>

          {currentUser ? (
            <WriteReviewDialog courseTitle={courseTitle} courseId={courseId}>
              <Button>Viết đánh giá đầu tiên</Button>
            </WriteReviewDialog>
          ) : (
            <p className="text-sm text-muted-foreground">Đăng nhập để viết đánh giá</p>
          )}
        </div>
      ) : (
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review._id} className="p-6 flex gap-4">
              <Avatar>
                <AvatarImage src={review?.user?.avatar || DEFAULT_AVATAR} />
                <AvatarFallback>{review?.user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <div>
                    <h5 className="font-medium">{review.user.username}</h5>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.star ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                          />
                        ))}
                      </div>

                      {formatRelativeTime(review.createdAt)}
                    </div>
                  </div>

                  {isOwner(review) && (
                    <DropdownMenu
                      open={openDropdownId === review._id}
                      onOpenChange={(o) => setOpenDropdownId(o ? review._id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditReview(review)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDeleteReview(review._id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm leading-relaxed">{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="p-6 text-center border-t">
          <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Đang tải..." : "Xem thêm đánh giá"}
          </Button>
        </div>
      )}

      {editingReview && (
        <WriteReviewDialog
          key={editingReview._id}
          courseTitle={courseTitle}
          courseId={courseId}
          editMode={{
            reviewId: editingReview._id,
            initialStar: editingReview.star,
            initialContent: editingReview.content,
          }}
          onClose={() => setEditingReview(null)}
        />
      )}
    </div>
  );
};

export default CourseReviews;
