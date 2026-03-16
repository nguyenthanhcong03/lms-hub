"use client";

import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";
import dynamic from "next/dynamic";

const UsersTable = dynamic(() => import("./components/users-table"), {
  loading: () => <DataTableSkeleton />,
  ssr: false,
});

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeading title="Người dùng" description="Quản lý người dùng của bạn, bao gồm học viên và giảng viên." />
      </div>

      <UsersTable />
    </div>
  );
};

export default UsersPage;
