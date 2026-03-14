import { CommentLesson } from "@/shared/types/comment";
import CommentInfo from "./comment-info";

const CommentItem = ({ comment }: { comment: CommentLesson }) => {
  return (
    <div>
      {/* Level 1 comment */}
      <CommentInfo comment={comment} />

      {/* Level 2 replies (includes children & grandchildren) */}
      {(comment?.is_btn_reply || comment?.is_add_reply) &&
      (comment?.replies ?? []).length > 0 ? (
        <div className="ml-10 mt-2 space-y-2 border-l-2 pl-4">
          {(comment?.replies ?? []).map((reply, index) => (
            <CommentInfo key={index} comment={reply} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CommentItem;
