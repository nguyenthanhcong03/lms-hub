import { ReactionType } from "@/shared/constants/enums";
import { reactions } from "@/shared/constants/reaction.constant";
import { useAuth } from "@/shared/contexts/auth-context";
import { createReaction } from "@/shared/services/reaction";
import { useAppDispatch } from "@/shared/store";
import { setReactionComment } from "@/shared/store/comment";
import { CommentLesson } from "@/shared/types/comment";
import { Tooltip } from "@heroui/react";

interface ReactionBarProps {
  comment: CommentLesson;
  parentId?: string;
}

export default function ReactionBar({ comment, parentId }: ReactionBarProps) {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const getReaction = (type: ReactionType) => {
    return reactions.find((reaction) => reaction.type === type);
  };
  const existReaction = comment?.reactions?.find((r) => r.user === user?._id);
  const handleReact = async (reaction: ReactionType) => {
    let kind = "";
    if (existReaction) {
      if (existReaction.type === reaction) {
        kind = "isDelete";
      } else {
        kind = "isUpdate";
      }
    } else {
      kind = "isCreate";
    }

    try {
      const res = await createReaction({
        type: reaction,
        commentId: comment?._id,
      });
      dispatch(
        setReactionComment({
          commentId: comment?._id,
          parentId,
          kind,
          data: {
            _id: res?.data?._id || existReaction?._id,
            type: res?.data?.type || reaction,
            user: res?.data?.user || existReaction?._id,
            comment: res?.data?.comment || existReaction?.comment,
          },
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Tooltip
      placement="top-start"
      radius="full"
      content={
        <div className="flex items-center gap-1">
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              title={reaction.type}
              onClick={() => handleReact(reaction.type)}
              className="text-3xl transition-transform hover:scale-125"
            >
              {reaction.icon}
            </button>
          ))}
        </div>
      }
    >
      <button
        title="Thích"
        className={`text-xs font-bold ${(existReaction?.type && getReaction(existReaction?.type)?.color) || "text-[#0093FC]"}`}
        onClick={() => handleReact(reactions[0].type)}
      >
        {(existReaction?.type && getReaction(existReaction?.type)?.value) ||
          "Thích"}
      </button>
    </Tooltip>
  );
}
