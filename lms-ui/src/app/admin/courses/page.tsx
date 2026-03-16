"use client";

import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/configs/permission";
import { useAuthStore } from "@/stores/auth-store";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
const CoursesTable = dynamic(() => import("./components/courses-table"), {
  loading: () => <DataTableSkeleton />,
  ssr: false,
});

const CoursesActionDialog = dynamic(() => import("./components/courses-action-dialog"), {
  ssr: false,
});

const CoursesPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeading title="Khóa học" description="Quản lý khóa học và nội dung khóa học" />
        {hasPermission(PERMISSIONS.COURSE_CREATE) && (
          <Button onClick={handleCreateClick}>
            <MdAdd className="mr-2 h-4 w-4" />
            Thêm khóa học
          </Button>
        )}
      </div>

      {hasPermission(PERMISSIONS.COURSE_READ) ? (
        <CoursesTable />
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
          Bạn không có quyền xem khóa học. Vui lòng liên hệ quản trị viên để được hỗ trợ.
        </div>
      )}

      {hasPermission(PERMISSIONS.COURSE_CREATE) && createDialogOpen && (
        <CoursesActionDialog mode="create" open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      )}
    </div>
  );
};

export default CoursesPage;
