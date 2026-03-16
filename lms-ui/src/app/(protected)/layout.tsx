"use client";
import { AuthGuard } from "@/components/guards/guard";
import MainFooter from "@/components/layout/main-footer";
import MainHeader from "@/components/layout/main-header";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();

  if (pathname.includes("/learning")) {
    return <AuthGuard>{children} </AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-1">{children}</main>
        <MainFooter />
      </div>
    </AuthGuard>
  );
};

export default MainLayout;
