"use client";
import { useAppSelector } from "@/shared/store";
import CartItem from "./cart-item";

const CartList = () => {
  const { result } = useAppSelector((state) => state.cart);

  return (
    <>
      <div className="relative mt-8 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-3">
          {result?.items?.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CartList;
