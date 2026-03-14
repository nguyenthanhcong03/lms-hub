import { CiFilter } from "react-icons/ci";
import BtnResetFilter from "./btn-reset-filter";
import CategoryFilter from "./category-filter";
import LevelFilter from "./level-filter";
import PriceFilter from "./price-filter";
import ReviewFilter from "./rating-filter";

const AsideFilter = () => {
  return (
    <div className="space-y-4">
      <CategoryFilter />
      <div className="flex items-center gap-2">
        <CiFilter />
        <span className="font-bold uppercase">Bộ lọc tìm kiếm</span>
      </div>
      <div className="my-4 h-[1px] bg-gray-300" />
      <PriceFilter />
      <div className="my-4 h-[1px] bg-gray-300" />
      <LevelFilter />
      <div className="my-4 h-[1px] bg-gray-300" />
      <div className="text-sm">Đánh giá</div>
      <ReviewFilter />
      <div className="my-4 h-[1px] bg-gray-300" />
      <BtnResetFilter />
    </div>
  );
};

export default AsideFilter;
