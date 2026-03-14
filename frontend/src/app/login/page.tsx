import LoginPage from "@/modules/login";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";
import BlankLayout from "@/shared/layouts/blank-layout";

const LoginPageRoot = async ({
  searchParams,
}: {
  searchParams: Promise<{
    returnUrl: string;
  }>;
}) => {
  const { returnUrl } = await searchParams;
  return (
    <AuthLayoutWrapper
      guestGuard={true}
      getLayout={(page: React.ReactNode) => <BlankLayout>{page}</BlankLayout>}
    >
      <LoginPage returnUrl={returnUrl} />
    </AuthLayoutWrapper>
  );
};

export default LoginPageRoot;
