"use client";
import InputTextField from "@/shared/components/form/input-text-field";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { registerAuth } from "@/shared/services/auth";
import { getAxiosErrorMessage } from "@/utils";
import { authSchema } from "@/utils/validation";

import { Button } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(authSchema),
  });
  const formFields: {
    name: keyof typeof defaultValues;
    component: React.ElementType;
    label: string;
    isBoolean?: boolean;
    asyncLoad?: boolean;
    width?: string;
    isRequired?: boolean;
    endContent?: React.ReactNode;
    [key: string]: unknown;
  }[] = [
    {
      name: "username",
      component: InputTextField,
      label: "Username",
      isRequired: true,
    },
    {
      name: "email",
      component: InputTextField,
      label: "Email",
      isRequired: true,
      endContent: <MdOutlineMailOutline size={20} />,
    },
    {
      name: "password",
      component: InputTextField,
      label: "Password",
      isRequired: true,
      type: isVisible ? "text" : "password",
      endContent: (
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? <IoEyeOutline size={20} /> : <FaRegEyeSlash size={20} />}
        </button>
      ),
    },
    {
      name: "confirmPassword",
      component: InputTextField,
      label: "Confirm password",
      isRequired: true,
      type: isVisibleConfirm ? "text" : "password",
      endContent: (
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibilityConfirm}
        >
          {isVisibleConfirm ? (
            <IoEyeOutline size={20} />
          ) : (
            <FaRegEyeSlash size={20} />
          )}
        </button>
      ),
    },
  ];

  const onSubmit = handleSubmit(async (values) => {
    const newValues = omit(values, ["confirmPassword"]);
    try {
      const res = await registerAuth(newValues);

      if (res?.data) {
        router.push(ROUTE_CONFIG.LOGIN);
        toast.success("Register account successfully!");
      } else {
        toast.error(res.message || "Register account failed!");
      }
    } catch (error) {
      const message = getAxiosErrorMessage(
        error,
        "Đăng nhập tài khoản thất bại!",
      );
      toast.error(message);
    }
  });
  return (
    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6" action="#">
      <div className="grid w-full grid-cols-1 gap-4 p-4">
        {formFields.map(({ name, component: Component, ...rest }) => (
          <div key={name}>
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <Component
                  {...field}
                  {...rest}
                  placeholder="Nhập dữ liệu"
                  isInvalid={!!errors?.[name]}
                  errorMessage={errors?.[name]?.message}
                  className="h-12"
                />
              )}
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="[hover=true]:!opacity-100 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none"
      >
        Create a account
      </Button>

      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?
        <Link
          href={ROUTE_CONFIG.LOGIN}
          className="font-medium text-primary hover:underline dark:text-primary-500"
        >
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
