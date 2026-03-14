import Heading from "@/shared/components/common/heading";
import OrderManagePage from "@/modules/admin/order/manage/order-manage-page";

import React from "react";

const OrderPageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý đơn hàng</Heading>
      <OrderManagePage />
    </div>
  );
};

export default OrderPageRoot;
