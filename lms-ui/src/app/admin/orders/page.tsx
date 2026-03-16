"use client";

import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";
import dynamic from "next/dynamic";

const OrdersTable = dynamic(() => import("./components/orders-table"), {
  loading: () => <DataTableSkeleton />,
  ssr: false,
});

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <AdminHeading title="Orders" description="Manage customer orders and order status" />

      <OrdersTable />
    </div>
  );
};

export default OrdersPage;
