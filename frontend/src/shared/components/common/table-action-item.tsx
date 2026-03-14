import Link from "next/link";
import { JSX } from "react";
import { FaEdit, FaEye, FaRegTrashAlt } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";

type TableActionIcon = "edit" | "delete" | "view" | "study" | "approve";

interface TableActionItemProps {
  onClick?: () => void;
  type: TableActionIcon;
  url?: string;
}

const TableActionItem = ({ onClick, type, url }: TableActionItemProps) => {
  const icons: Record<TableActionIcon, JSX.Element> = {
    edit: <FaEdit />,
    delete: <FaRegTrashAlt />,
    view: <FaEye />,
    study: <FiBookOpen />,
    approve: <div>✔</div>, // Placeholder for approve
  };

  const baseClassName =
    "size-8 rounded-md border outline-none flex items-center justify-center p-2 text-gray-500 hover:border-opacity-80";

  if (url) {
    return (
      <Link className={baseClassName} href={url}>
        {icons[type]}
      </Link>
    );
  }

  return (
    <button className={baseClassName} onClick={onClick} type="button">
      {icons[type]}
    </button>
  );
};

export default TableActionItem;
