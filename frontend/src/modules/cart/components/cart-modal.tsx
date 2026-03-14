"use client";
import InputTextField from "@/shared/components/form/input-text-field";
import ModalNextUI from "@/shared/components/modal";
import { ROUTE_CONFIG } from "@/shared/configs/route";
import { DEFAULT_IMAGE } from "@/shared/constants";
import { CouponType } from "@/shared/constants/enums";
import { applyCoupon } from "@/shared/services/coupon";
import { createOrder } from "@/shared/services/order";
import { formatPrice } from "@/utils/common";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
interface CartModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: {
    course: {
      _id: string;
      price: number;
      old_price?: number;
      image?: string;
      title: string;
    };
  };
}
interface CreateOrderParams {
  code: string;
  course: string;
  total: number;
  amount: number;
  coupon: string;
  discount?: number;
}
const CartModal = ({ isOpen, onOpenChange, item }: CartModalProps) => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [couponId, setCouponId] = useState("");
  const [price, setPrice] = useState(item.course.price);
  const [discount, setDiscount] = useState(0);
  const handleApplyCoupon = async () => {
    try {
      const response = await applyCoupon({
        code: couponCode.toUpperCase(),
        courseId: item.course._id,
      });

      const couponData = response?.data;
      const couponType = couponData?.type;
      let finalPrice = item.course.price;

      if (couponType === CouponType.PERCENT) {
        finalPrice =
          item.course.price -
          Math.ceil((item.course.price * couponData?.value) / 100);

        setDiscount(Math.ceil((item.course.price * couponData?.value) / 100));
      } else if (couponType === CouponType.FIXED) {
        finalPrice = item.course.price - couponData?.value;
        setDiscount(couponData?.value);
      }

      setPrice(finalPrice);

      toast.success("Áp dụng mã giảm giá thành công");
      setIsApplied(true);
      setCouponId(couponData?._id);
    } catch (error) {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const handleRemoveCoupon = () => {
    setIsApplied(false);
    setPrice(item.course.price);
    setDiscount(0);
  };

  const createOrderCode = () => `DH-${Date.now().toString().slice(-6)}`;

  const handleEnrollCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderParams: CreateOrderParams = {
        code: createOrderCode(),
        course: item.course._id,
        total: price,
        amount: item.course.price,
        coupon: couponId,
        discount,
      };
      await createOrder(orderParams);
      toast.success("Đặt hàng thành công");
      onOpenChange(false);
      router.push(ROUTE_CONFIG.MANAGE_PERSONAL.MY_ORDER);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    setCouponCode("");
    handleRemoveCoupon();
  };
  return (
    <ModalNextUI
      isOpen={isOpen}
      onOpenChange={handleCloseModal}
      title="Xác nhận đơn hàng"
      size="2xl"
      btnSubmitText="Đặt hàng"
      onSubmit={handleEnrollCourse}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative h-[100px] w-[100px] shrink-0">
            <Image
              src={item?.course?.image || DEFAULT_IMAGE}
              fill
              className="rounded-2xl"
              alt="product image"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-gray-800">
              {item?.course?.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base text-default-500 line-through">
                {formatPrice(item?.course?.old_price ?? 0)}
              </span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(item?.course?.price)}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {isApplied && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                      Giảm giá
                    </span>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      - {formatPrice(discount)}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <InputTextField
                      value={couponCode}
                      disabled={isApplied}
                      onValueChange={setCouponCode}
                      placeholder="Nhập mã..."
                    />
                  </div>
                  {isApplied ? (
                    <Button
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary/90 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none"
                      onPress={handleRemoveCoupon}
                    >
                      Hủy
                    </Button>
                  ) : (
                    <Button
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary/90 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none"
                      onPress={handleApplyCoupon}
                    >
                      Áp dụng
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-base font-bold text-gray-900 dark:text-white">
                  Tổng tiền
                </dt>
                <dd className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(price)}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalNextUI>
  );
};

export default CartModal;
