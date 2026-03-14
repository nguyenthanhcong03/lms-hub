import { formatPrice } from "@/utils/common";
import { Button, useDisclosure } from "@heroui/react";
import Image from "next/image";
import CartModal from "./cart-modal";
import { DEFAULT_IMAGE } from "@/shared/constants";
import { IoMdClose } from "react-icons/io";
import { removeItemFromCart } from "@/shared/services/cart";
import { toast } from "react-toastify";
import { getAxiosErrorMessage } from "@/utils";
import { getCartByUserAsync } from "@/shared/store/cart/action";
import { useAppDispatch } from "@/shared/store";
import { TCartItem } from "@/shared/types/cart";

type CartItemProps = {
  item: TCartItem;
};

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpenChange } = useDisclosure();

  const handleRemoveItem = async () => {
    try {
      await removeItemFromCart(item?.course?._id);
      dispatch(getCartByUserAsync());
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      const message = getAxiosErrorMessage(error, "Xóa sản phẩm thất bại!");
      toast.error(message);
    }
  };

  return (
    <>
      {isOpen && (
        <CartModal isOpen={isOpen} onOpenChange={onOpenChange} item={item} />
      )}
      <div className="relative rounded-lg bg-white p-6 shadow-[0_0px_4px_0px_rgba(6,81,237,0.2)]">
        <button
          className="absolute right-4 top-4 hover:text-red-500"
          onClick={handleRemoveItem}
        >
          <IoMdClose size={20} />
        </button>
        <div className="flex items-center gap-4 max-sm:flex-col max-sm:gap-6">
          <div className="relative h-[150px] w-[150px] shrink-0">
            <Image
              src={item?.course?.image || DEFAULT_IMAGE}
              fill
              className="rounded-2xl"
              alt="product image"
            />
          </div>

          <div className="w-full sm:border-l sm:border-gray-300 sm:pl-4">
            <h3 className="text-lg font-bold text-gray-800">
              {item?.course?.title}
            </h3>

            <hr className="my-4 border-gray-300" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base text-default-500 line-through">
                  {formatPrice(item?.course?.old_price)}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(item?.course?.price)}
                </span>
              </div>

              <Button
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary/90 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none"
                onPress={onOpenChange}
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
