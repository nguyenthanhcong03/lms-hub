import Heading from "@/shared/components/common/heading";
import CouponManagePage from "@/modules/admin/coupon/manage/coupon-manage-page";

import React from "react";

const CouponPageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading className="">Quản lý giảm giá</Heading>
      <CouponManagePage />
    </div>
  );
};

export default CouponPageRoot;
