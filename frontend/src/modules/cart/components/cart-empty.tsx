"use client";
import { ROUTE_CONFIG } from "@/shared/configs/route";

import Image from "next/image";
import Link from "next/link";

export default function EmptyCartPage() {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="rounded-ful relative mx-auto mb-6 flex h-[200px] w-[200px] items-center justify-center">
          <Image src="/images/empty-cart.jpg" alt="Empty Cart" fill />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">
          Your cart is empty
        </h2>
        <p className="mt-2 text-gray-500">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href={ROUTE_CONFIG.COURSE}
            className="[hover=true]:!opacity-100 flex w-[200px] cursor-pointer items-center justify-center gap-2 rounded-md bg-primary/90 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-primary focus:outline-none"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
