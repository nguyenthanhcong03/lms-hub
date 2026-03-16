import { AdminGuard } from "@/components/auth/auth-guard";
import { AdminLayout } from "@/components/layout/admin-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
};

export default Layout;
