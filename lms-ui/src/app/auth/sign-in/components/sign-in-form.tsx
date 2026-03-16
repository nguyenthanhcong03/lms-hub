"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTE_CONFIG } from "@/configs/routes";
import { useLogin } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SignInFormProps = HTMLAttributes<HTMLFormElement>;

const formSchema = yup.object({
  email: yup.string().required("Vui lòng nhập email của bạn").email("Vui lòng nhập email hợp lệ"),
  password: yup.string().required("Vui lòng nhập mật khẩu của bạn").min(7, "Mật khẩu phải có ít nhất 7 ký tự"),
});

type FormData = yup.InferType<typeof formSchema>;

// Sign-in form component - Arrow function
const SignInForm = ({ className, ...props }: SignInFormProps) => {
  const loginMutation = useLogin();

  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormData) {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid gap-6", className)} {...props}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Mật Khẩu</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                href={ROUTE_CONFIG.AUTH.FORGOT_PASSWORD}
                className="absolute -top-0.5 right-0 text-sm  hover:opacity-75"
              >
                Quên mật khẩu?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
