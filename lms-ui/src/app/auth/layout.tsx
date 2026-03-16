import { AuthGuard } from "@/components/auth/auth-guard";

interface Props {
  children: React.ReactNode;
}

// Auth layout - Arrow function
const AuthLayout = ({ children }: Props) => {
  return (
    <AuthGuard requireAuth={false}>
      <div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default AuthLayout;
