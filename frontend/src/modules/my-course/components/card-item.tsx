import React from "react";

type TCardItemProps = {
  item: { icon: React.ReactNode; qty: number; description: string };
};

const CardItem = ({ item }: TCardItemProps) => {
  return (
    <div className="h-[200px] rounded border shadow">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          {item?.icon}
        </div>
        <span className="text-2xl font-bold">{item.qty}</span>
        <p>{item.description} </p>
      </div>
    </div>
  );
};

export default CardItem;
