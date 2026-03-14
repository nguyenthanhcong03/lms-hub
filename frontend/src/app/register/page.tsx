"use client";
import RegisterPage from "@/modules/register";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";
import BlankLayout from "@/shared/layouts/blank-layout";

const RegisterPageRoot = () => {
  return (
    <AuthLayoutWrapper
      guestGuard={true}
      getLayout={(page: React.ReactNode) => <BlankLayout>{page}</BlankLayout>}
    >
      <RegisterPage />
    </AuthLayoutWrapper>
  );
};

export default RegisterPageRoot;
