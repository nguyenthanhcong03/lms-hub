"use client";
import { useAppSelector } from "@/shared/store";
import CartList from "./components/cart-list";
import CartEmpty from "./components/cart-empty";

const CartPage = () => {
  const { result, isLoading } = useAppSelector((state) => state.cart);
  return (
    <>
      {!isLoading && (
        <div className="mx-auto max-w-7xl p-6 max-lg:max-w-4xl">
          {(result?.items?.length ?? 0 > 0) ? (
            <>
              <h1 className="text-2xl font-bold text-gray-800">Giỏ hàng</h1>
              <CartList />
            </>
          ) : (
            <CartEmpty />
          )}
        </div>
      )}
    </>
  );
};

export default CartPage;
