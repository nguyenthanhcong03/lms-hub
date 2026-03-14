import { useEffect } from "react";

import { useAuth } from "@/shared/contexts/auth-context";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import { updateAuthMe } from "@/shared/services/auth";
import { ProfileSchema, profileSchema } from "@/utils/validation";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "@/utils";

const UpdateInfo = () => {
  const { user, initAuth } = useAuth();

  const defaultValues = {
    username: "",
    email: "",
    phone: "",
    role: "",
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(profileSchema),
  });

  const formFields: {
    name: keyof ProfileSchema;
    component: React.ComponentType<{ [key: string]: unknown }>;
    label: string;
    isBoolean?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
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
      isDisabled: true,
    },
    {
      name: "phone",
      component: InputNumberField,
      label: "Phone",
      thousandSeparator: false,
      maxLength: 10,
    },
    {
      name: "role",
      component: InputTextField,
      isDisabled: true,
      isRequired: true,
      label: "Role",
    },
  ];

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateAuthMe({
        username: values.username,
        phone: values.phone,
      });
      initAuth();

      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      const message = getAxiosErrorMessage(
        error,
        "Cập nhật thông tin thất bại!",
      );
      toast.error(message);
    }
  });

  useEffect(() => {
    reset({
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      role: user?.role,
    });
  }, [user]);
  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-10 p-4" action="#">
      <div className="grid w-full grid-cols-2 gap-4">
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
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
        color="primary"
        variant="shadow"
      >
        Cập nhật thông tin
      </Button>
    </form>
  );
};

export default UpdateInfo;
