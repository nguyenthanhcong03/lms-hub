"use client";
import Sidebar from "@/shared/components/sidebar/sidebar";
import AdminHeader from "./admin-header";
import PageNotFound from "@/app/not-found";
import { UserRole } from "../constants/enums";
import { useAuth } from "../contexts/auth-context";
type AdminLayoutProps = {
  children: React.ReactNode;
};
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();

  if (!user?.role || ![UserRole.ADMIN, UserRole.EXPERT].includes(user.role))
    return <PageNotFound></PageNotFound>;
  return (
    <div className="wrapper block min-h-screen pb-20 lg:grid lg:grid-cols-[300px,minmax(0,1fr)] lg:pb-0">
      <Sidebar />

      <div className="hidden lg:block" />
      <div>
        <AdminHeader />
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
