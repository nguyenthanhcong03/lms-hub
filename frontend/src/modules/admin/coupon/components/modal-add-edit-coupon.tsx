import CustomDatePicker from "@/shared/components/form/custom-date-picker";
import CustomMultiSelect from "@/shared/components/form/custom-multi-select";
import CustomRadioGroup from "@/shared/components/form/custom-radio-group";
import CustomSelect from "@/shared/components/form/custom-select";

import InputNumberField from "@/shared/components/form/input-number-field";
import InputTextField from "@/shared/components/form/input-text-field";
import ModalNextUI from "@/shared/components/modal";
import { couponStatusActions } from "@/shared/constants/coupon.constant";

import { CouponStatus, CouponType } from "@/shared/constants/enums";
import { getCoupon } from "@/shared/services/coupon";
import { getAllCourses } from "@/shared/services/course";
import { useAppDispatch } from "@/shared/store";
import {
  createCouponAsync,
  updateCouponAsync,
} from "@/shared/store/coupon/action";
import { formatPrice } from "@/utils";

import { CouponSchema, couponSchema } from "@/utils/validation";

import { yupResolver } from "@hookform/resolvers/yup";

import { parseDate } from "@internationalized/date";
import moment from "moment";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface OptionType {
  label: string;
  value: string;
}

interface ModalAddEditCouponProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  idCoupon: string;
}

const ModalAddEditCoupon = ({
  isOpen,
  onOpenChange,
  idCoupon,
}: ModalAddEditCouponProps) => {
  const dispatch = useAppDispatch();

  // =========================
  // 🎯 Default Form Values
  // =========================
  const defaultValues = {
    title: "",
    code: "",
    start_date: parseDate(moment().format("YYYY-MM-DD")) || null,
    end_date: parseDate(moment().format("YYYY-MM-DD")),
    status: CouponStatus.ACTIVE,
    max_uses: "",
    type: CouponType.FIXED,
    value: "",
    courses: [],
  };

  // =========================
  // 🧾 React Hook Form Setup
  // =========================
  const {
    control,
    handleSubmit,
    reset,

    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponSchema>({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(couponSchema),
  });

  const typeWatch = watch("type");

  // =========================
  // 🔄 Load Course Options
  // =========================
  const loadOptionsData = async (
    searchQuery: string,
    _loadedOptions: readonly { label: string; value: string }[],
    { page }: { page: number },
  ) => {
    const res = await getAllCourses({
      params: { page, limit: 10, search: searchQuery },
    });

    const courses = res?.data?.courses?.map(
      (item: { _id: string; title: string }) => ({
        label: item.title,
        value: item._id,
      }),
    );

    return {
      options: courses,
      hasMore: res?.data?.total_pages > page,
      additional: {
        page: searchQuery ? 1 : page + 1,
      },
    };
  };

  // =========================
  // ✅ Submit Handler
  // =========================
  const onSubmit = handleSubmit((data) => {
    const start_date = moment(data.start_date.toString())
      .startOf("day")
      .toDate();

    const end_date = moment(data.end_date.toString()).endOf("day").toDate();
    const value = formatPrice(data.value || "");
    const max_uses = formatPrice(data.max_uses || "");
    const courses = ((data.courses as { value: string }[]) ?? []).map(
      (item) => item.value,
    );
    const payload = {
      ...data,
      value,
      max_uses,
      start_date,
      end_date,
      courses,
    };

    if (idCoupon) {
      dispatch(updateCouponAsync({ id: idCoupon, ...payload }));
    } else {
      dispatch(createCouponAsync(payload));
    }
  });

  // =========================
  // 📥 Fetch Coupon by ID
  // =========================
  const fetchDetailsCoupon = async (id: string) => {
    try {
      const res = await getCoupon(id);
      const data = res?.data;

      if (data) {
        reset({
          code: data.code,
          title: data.title,
          status: data.status,
          type: data.type,
          start_date:
            parseDate(moment(data.start_date).format("YYYY-MM-DD")) || null,
          end_date:
            parseDate(moment(data.end_date).format("YYYY-MM-DD")) || null,
          value: data.value?.toLocaleString(),
          max_uses: data.max_uses?.toLocaleString(),
          courses: data.courses.map((item: { _id: string; title: string }) => ({
            label: item.title,
            value: item._id,
          })),
        });
      }
    } catch (e) {
      console.error("Error fetching coupon details:", e);
    }
  };

  // =========================
  // 🔁 Effect: Load/Edit Mode
  // =========================
  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
    } else if (idCoupon) {
      fetchDetailsCoupon(idCoupon);
    }
  }, [isOpen, idCoupon]);

  // =========================
  // 🖼️ Modal UI
  // =========================
  return (
    <ModalNextUI
      title={idCoupon ? "Cập nhật mã giảm giá" : "Thêm mới mã giảm giá"}
      isOpen={true}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      size="4xl"
      btnSubmitText={idCoupon ? "Cập nhật" : "Thêm mới"}
    >
      <div className="grid w-full grid-cols-2 gap-x-5 gap-y-5">
        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <InputTextField
              {...field}
              isRequired
              label="Tên giảm giá"
              placeholder="Nhập tên giảm giá"
              isInvalid={!!errors?.title}
              errorMessage={errors?.title?.message}
            />
          )}
        />

        {/* Code */}
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <InputTextField
              {...field}
              isRequired
              label="Mã giảm giá"
              placeholder="Nhập mã giảm giá"
              isInvalid={!!errors?.code}
              errorMessage={errors?.code?.message}
            />
          )}
        />

        {/* Start Date */}
        <Controller
          control={control}
          name="start_date"
          render={({ field }) => (
            <CustomDatePicker
              {...field}
              isRequired
              label="Ngày bắt đầu"
              isInvalid={!!errors?.start_date}
              errorMessage={errors?.start_date?.message}
            />
          )}
        />

        {/* End Date */}
        <Controller
          control={control}
          name="end_date"
          render={({ field }) => (
            <CustomDatePicker
              {...field}
              isRequired
              label="Ngày kết thúc"
              isInvalid={!!errors?.end_date}
              errorMessage={errors?.end_date?.message}
            />
          )}
        />

        {/* Discount Type */}
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <CustomRadioGroup
              {...field}
              label="Loại giảm giá"
              items={[
                { label: "Phần trăm", value: CouponType.PERCENT },
                { label: "Số tiền", value: CouponType.FIXED },
              ]}
            />
          )}
        />

        {/* Discount Value */}
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <InputNumberField
              {...field}
              isRequired
              label={
                typeWatch === CouponType.PERCENT
                  ? "Phần trăm giảm giá"
                  : "Số tiền giảm giá"
              }
              placeholder={typeWatch === CouponType.PERCENT ? "10%" : "100,000"}
              isInvalid={!!errors?.value}
              errorMessage={errors?.value?.message}
            />
          )}
        />

        {/* Status */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <CustomSelect
              label="Trạng thái"
              {...field}
              isRequired
              selectedKeys={[field.value]}
              items={couponStatusActions}
              placeholder="--- Chọn ---"
              isInvalid={!!errors?.status}
              errorMessage={errors?.status?.message}
            />
          )}
        />

        {/* Max Uses */}
        <Controller
          control={control}
          name="max_uses"
          render={({ field }) => (
            <InputNumberField
              {...field}
              isRequired
              label="Số lần sử dụng"
              placeholder="100"
              isInvalid={!!errors?.max_uses}
              errorMessage={errors?.max_uses?.message}
            />
          )}
        />

        {/* Courses MultiSelect */}
        <Controller
          control={control}
          name="courses"
          render={({ field }) => (
            <div className="col-start-1 col-end-3">
              <CustomMultiSelect
                {...field}
                value={field.value as OptionType[]}
                isRequired
                label="Khóa học"
                loadOptions={loadOptionsData}
                isInvalid={!!errors?.courses}
                errorMessage={errors?.courses?.message}
              />
            </div>
          )}
        />
      </div>
    </ModalNextUI>
  );
};

export default ModalAddEditCoupon;
