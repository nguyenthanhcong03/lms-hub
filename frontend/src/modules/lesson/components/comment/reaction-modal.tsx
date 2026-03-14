import ModalNextUI from "@/shared/components/modal";

import { ReactionType } from "@/shared/constants/enums";
import { reactions } from "@/shared/constants/reaction.constant";
import { getAllReactions } from "@/shared/services/reaction";
import { CommentLesson } from "@/shared/types/comment";
import { TReactionItem } from "@/shared/types/reaction";
import { Avatar, Badge, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";

interface ReactionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comment: CommentLesson;
}

const ReactionModal: React.FC<ReactionModalProps> = ({
  isOpen,
  onOpenChange,
  comment,
}) => {
  const [selected, setSelected] = useState<ReactionType | string>("");
  const [listReactions, setListReactions] = useState([]);

  const output = comment.reactions.reduce(
    (acc: Record<ReactionType, number>, curr) => {
      acc[curr.type as ReactionType] =
        (acc[curr.type as ReactionType] || 0) + 1;
      return acc;
    },
    {} as Record<ReactionType, number>,
  );
  const getReaction = (type: ReactionType) => {
    return reactions.find((reaction) => reaction.type === type);
  };

  const fetchAllReactions = async (type: ReactionType | string) => {
    const res = await getAllReactions({
      params: {
        commentId: comment._id,
        type: type,
      },
    });
    setListReactions(res.data || []);
  };

  useEffect(() => {
    fetchAllReactions(selected);
  }, [selected, isOpen]);
  return (
    <ModalNextUI
      title={"Thêm mới mã giảm giá"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      btnSubmitText={"Thêm mới"}
      isFooter={false}
      isHeader={false}
    >
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as ReactionType | "")}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#0093FC]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#0093FC]",
          }}
          color="primary"
          variant="underlined"
        >
          <Tab
            key={""}
            title={
              <div className="flex items-center space-x-2">
                <span>Tất cả</span>
              </div>
            }
          />
          {Object.entries(output).map(([key, value]) => (
            <Tab
              key={key}
              title={
                <div className="flex items-center space-x-2">
                  <span>{getReaction(key as ReactionType)?.icon}</span>
                  <span className="text-sm font-bold">{value}</span>
                </div>
              }
            />
          ))}
        </Tabs>
        <div className="mt-5 space-y-4">
          {listReactions?.map((item: TReactionItem) => (
            <div key={item._id} className="flex items-center gap-4">
              <Badge
                content={getReaction(item.type)?.icon}
                placement="bottom-right"
                shape="circle"
                showOutline={false}
                classNames={{
                  badge: "bg-transparent ",
                }}
              >
                <Avatar
                  src={item?.user?.avatar || "/images/profile-photo.webp"}
                />
              </Badge>
              <span className="font-medium">{item?.user?.username}</span>
            </div>
          ))}
        </div>
      </div>
    </ModalNextUI>
  );
};

export default ReactionModal;
