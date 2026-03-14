export const dynamic = "force-dynamic";
import HomeCourseList from "@/modules/home";

import HeroSection from "@/modules/home/components/hero-section";

import UserLayout from "@/shared/layouts/user-layout";
const HomePageRoot = async () => {
  return (
    <UserLayout>
      <div className="container relative">
        <HeroSection />

        <HomeCourseList />
      </div>
    </UserLayout>
  );
};

export default HomePageRoot;
