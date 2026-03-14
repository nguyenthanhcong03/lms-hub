import Heading from "@/shared/components/common/heading";
import CategoryManagePage from "@/modules/admin/category/manage/category-manage-page";

import React from "react";

const CategoryPageRoot = () => {
  return (
    <div className="space-y-5">
      <Heading>Quản lý danh mục</Heading>
      <CategoryManagePage />
    </div>
  );
};

export default CategoryPageRoot;
