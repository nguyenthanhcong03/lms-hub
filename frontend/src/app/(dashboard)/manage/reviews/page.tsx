import Heading from "@/shared/components/common/heading";
import ReviewManagePage from "@/modules/admin/review/manage/review-manage-page";

import React from "react";

const ReviewPageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý bình luận</Heading>
      <ReviewManagePage />
    </div>
  );
};

export default ReviewPageRoot;
