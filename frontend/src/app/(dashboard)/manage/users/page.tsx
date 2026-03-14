import Heading from "@/shared/components/common/heading";
import UserManagePage from "@/modules/admin/user/manage/user-manage-page";

import React from "react";

const UserPage = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý người dùng </Heading>
      <UserManagePage />
    </div>
  );
};

export default UserPage;
