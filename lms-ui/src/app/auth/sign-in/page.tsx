import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTE_CONFIG } from "@/configs/routes";
import SignInForm from "./components/sign-in-form";

// Sign-in page - Arrow function
const SignIn = () => {
  return (
    <Card className="gap-4 py-6">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Đăng nhập tài khoản</CardTitle>
        <CardDescription>Nhập email của bạn bên dưới để đăng nhập</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full px-8 text-center text-sm">
          Chưa có tài khoản?{" "}
          <a href={ROUTE_CONFIG.AUTH.SIGN_UP} className="hover:text-primary underline underline-offset-4">
            Đăng ký
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
