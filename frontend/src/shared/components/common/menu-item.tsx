import React from "react";
import ActiveLink from "./active-link";

interface MenuItemProps {
  url: string;
  title: string;
  icon: React.ReactNode;
  onlyIcon?: boolean;
  onClick?: () => void;
}

const MenuItem = ({
  icon,
  onlyIcon,
  title = "",
  url = "/",
  onClick,
}: MenuItemProps) => {
  return (
    <li>
      {url ? (
        <ActiveLink url={url}>
          {icon}
          {onlyIcon ? null : title}
        </ActiveLink>
      ) : (
        <div
          onClick={onClick}
          className={`flex cursor-pointer items-center gap-3 border-primary px-8 py-4 text-base text-slate-600 transition-all hover:border-r-[5px] hover:!bg-primary/10 hover:!text-primary`}
        >
          {icon}
          {onlyIcon ? null : title}
        </div>
      )}
    </li>
  );
};

export default MenuItem;
