import React from "react";
import Header from "./header";
import Footer from "./footer";
type UserLayoutProps = {
  children: React.ReactNode;
};
const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div>
      <Header />
      <div className="min-h-[50vh]"> {children}</div>
      <Footer />
    </div>
  );
};

export default UserLayout;
