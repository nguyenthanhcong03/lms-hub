"use client";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();
  const handleRedirect = () => {
    const history = globalThis.history;

    if (history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <div className="py-5 lg:py-20">
      <h1 className="mb-5 flex flex-col items-center gap-5 text-center text-3xl font-bold lg:text-5xl">
        <span className="text-gradient relative inline-block text-[100px]">
          <span className="text-primary">4</span>
          <span>0</span>
          <span className="text-secondary">4</span>
        </span>
        <span className="font-extrabold">Không tìm thấy trang</span>
      </h1>
      <p className="mx-auto mb-10 max-w-[600px] text-center text-base text-gray-500 lg:text-xl">
        Dường như trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <button
        onClick={handleRedirect}
        className="mx-auto flex h-12 min-w-[200px] items-center justify-center rounded-full bg-primary px-5 font-bold text-white"
      >
        Quay lại
      </button>
    </div>
  );
};

export default PageNotFound;
