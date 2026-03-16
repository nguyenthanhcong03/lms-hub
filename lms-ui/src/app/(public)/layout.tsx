import MainFooter from "@/components/layout/main-footer";
import MainHeader from "@/components/layout/main-header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
