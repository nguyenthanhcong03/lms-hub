import {
  AppDispatch,
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/shared/store";
import { getAllCommentsByLessonAsync } from "@/shared/store/comment/action";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CommentItem from "./comment-item";
import CommentMainForm from "./comment-main-form";

import { getAllCommentsByLesson } from "@/shared/services/comment";
import { setComments } from "@/shared/store/comment";
import { uniqBy } from "lodash";
import { useSearchParams } from "next/navigation";
import { FaCircleCheck } from "react-icons/fa6";
const CommentSection = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id") || "";
  const dispatch: AppDispatch = useAppDispatch();
  const { comments, pagination, isLoading } = useAppSelector(
    (state: RootState) => state.comment,
  );

  const [page, setPage] = useState(1);

  const fetchComments = async (nextPage: number) => {
    const query = {
      params: {
        limit: 10,
        page: nextPage,
        lessonId,
      },
    };
    const res = await getAllCommentsByLesson(query);

    dispatch(
      setComments(uniqBy([...comments, ...(res.data.comments || [])], "_id")),
    );
  };

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchComments(nextPage);
      return nextPage;
    });
  };
  useEffect(() => {
    const query = {
      params: {
        limit: 10,
        page: 1,
        lessonId,
      },
    };

    if (lessonId) {
      dispatch(getAllCommentsByLessonAsync(query));
    }
  }, [lessonId]);
  return (
    <div
      id="scrollableDiv"
      className="h-full w-full space-y-4 overflow-y-auto px-6"
    >
      <CommentMainForm />

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner
            classNames={{ label: "text-foreground " }}
            variant="gradient"
            size="sm"
          />
          <span className="inline-block pl-2"> Đang tải bình luận...</span>
        </div>
      ) : (
        <>
          {comments?.length > 0 ? (
            <InfiniteScroll
              dataLength={comments.length}
              next={handleLoadMoreData}
              hasMore={pagination?.total_count > comments.length}
              scrollableTarget="scrollableDiv"
              loader={
                <Spinner
                  classNames={{ label: "text-foreground " }}
                  variant="gradient"
                  size="sm"
                />
              }
              endMessage={
                <p className="flex items-center justify-center gap-2">
                  <FaCircleCheck size={18} className="text-green-500" />
                  <span>Đã tải hết bình luận!</span>
                </p>
              }
            >
              <>
                {!!pagination?.total_count && (
                  <h2 className="text-lg font-bold text-slate-500">
                    {pagination?.total_count} bình luận
                  </h2>
                )}
                {comments
                  .filter((comment) => !comment.parentId)
                  .map((comment) => (
                    <div key={comment?._id} className="my-4">
                      <CommentItem comment={comment} />
                    </div>
                  ))}
              </>
            </InfiniteScroll>
          ) : (
            <div className="mt-10 flex items-center justify-center">
              Chưa có bình luận nào
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
