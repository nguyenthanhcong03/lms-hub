import InputTextField from "@/shared/components/form/input-text-field";

import { useAppDispatch } from "@/shared/store";
import { updateUserAsync } from "@/shared/store/user/action";

import { yupResolver } from "@hookform/resolvers/yup";

import ModalNextUI from "@/shared/components/modal";

import CustomMultiSelect from "@/shared/components/form/custom-multi-select";
import CustomSelect from "@/shared/components/form/custom-select";

import { getAllCourses } from "@/shared/services/course";
import { getUserInfo } from "@/shared/services/user";
import { UserSchema, userSchema } from "@/utils/validation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  userRoleActions,
  userStatusActions,
} from "@/shared/constants/user.constant";

type ModalAddEditUserProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  idUser: string;
};

const ModalAddEditUser = ({
  isOpen,
  onOpenChange,
  idUser,
}: ModalAddEditUserProps) => {
  const dispatch = useAppDispatch();

  const defaultValues = {
    username: "",
    email: "",
    status: "",
    courses: [],
    role: "",
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserSchema>({
    defaultValues,
    mode: "onBlur",

    resolver: yupResolver(userSchema),
  });

  const onSubmit = handleSubmit((data) => {
    const courses = ((data.courses as { value: string }[]) ?? []).map(
      (item) => item.value,
    );
    if (idUser) {
      dispatch(
        updateUserAsync({
          ...data,
          courses,
          id: idUser,
        }),
      );
    }
  });
  const loadOptionsData = async (
    searchQuery: string,
    _loadedOptions: { label: string; value: string }[],
    { page }: { page: number },
  ) => {
    const res = await getAllCourses({
      params: { page, limit: 10, search: searchQuery },
    });

    const courses = res?.data?.courses?.map(
      (item: { title: string; _id: string }) => ({
        label: item.title,
        value: item._id,
      }),
    );

    return {
      options: courses,
      hasMore: res?.data?.pagination?.total_pages > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };
  const formFields: {
    name: keyof typeof defaultValues;
    component: React.ElementType;
    label: string;
    isBoolean?: boolean;
    asyncLoad?: boolean;
    width?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isSelect?: boolean;
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
      name: "status",
      component: CustomSelect,
      isRequired: true,
      label: "Status",
      items: userStatusActions,
      isSelect: true,
    },
    {
      name: "role",
      component: CustomSelect,
      isRequired: true,
      label: "Role",
      items: userRoleActions,
      isSelect: true,
    },

    {
      name: "courses",
      component: CustomMultiSelect,
      label: "Khóa học",
      loadOptions: loadOptionsData,
      width: "col-span-2",
    },
  ];
  const fetchDetailsUser = async (userId: string) => {
    try {
      const res = await getUserInfo(userId);
      const data = res?.data;

      if (data) {
        reset({
          username: data.username,
          email: data.email,
          status: data.status,
          courses: data.courses.map((item: { _id: string; title: string }) => ({
            label: item.title,
            value: item._id,
          })),
          role: data.role,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      reset({
        // Reset with default values when the modal is closed
        ...defaultValues,
      });
    } else if (idUser && isOpen) {
      // Fetch order details if `idCourse` exists and modal is open
      fetchDetailsUser(idUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, idUser]);

  return (
    <ModalNextUI
      title={idUser ? "Cập nhật người dùng" : "Thêm mới người dùng"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="4xl"
      btnSubmitText={idUser ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-2 gap-4">
        {formFields.map(
          ({ name, component: Component, isSelect, width, ...rest }) => (
            <div key={name} className={width ? width : "col-span-1"}>
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field }) => {
                  return isSelect ? (
                    <Component
                      {...field}
                      {...rest}
                      selectedKeys={[field.value]}
                      placeholder="--- Chọn ---"
                      isInvalid={!!errors?.[name]}
                      errorMessage={errors?.[name]?.message}
                    />
                  ) : (
                    <Component
                      {...field}
                      {...rest}
                      placeholder="Nhập dữ liệu"
                      isInvalid={!!errors?.[name]}
                      errorMessage={errors?.[name]?.message}
                      className="h-12"
                    />
                  );
                }}
              />
            </div>
          ),
        )}
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditUser;
