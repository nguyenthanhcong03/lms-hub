import CartPage from "@/modules/cart";
import AuthLayoutWrapper from "@/shared/layouts/auth-layout-wrapper";

const CartPageRoot = () => {
  return (
    <AuthLayoutWrapper authGuard={true}>
      <CartPage />
    </AuthLayoutWrapper>
  );
};

export default CartPageRoot;
