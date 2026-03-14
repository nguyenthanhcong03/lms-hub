import AdminLayout from "@/shared/layouts/admin-layout";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";
import React from "react";

const AdminLayoutRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayoutWrapper
      authGuard={true}
      getLayout={(page) => <AdminLayout>{page}</AdminLayout>}
    >
      {children}
    </AuthLayoutWrapper>
  );
};

export default AdminLayoutRoot;
