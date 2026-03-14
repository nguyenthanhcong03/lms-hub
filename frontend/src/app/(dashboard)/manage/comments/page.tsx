import Heading from "@/shared/components/common/heading";
import CommentManagePage from "@/modules/admin/comment/manage/comment-manage-page";

import React from "react";

const CommentPageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý bình luận</Heading>
      <CommentManagePage />
    </div>
  );
};

export default CommentPageRoot;
