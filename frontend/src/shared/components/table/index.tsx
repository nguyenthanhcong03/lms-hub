"use client";
import {
  Selection,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow,
} from "@heroui/react";
import React from "react";
import NoData from "../common/no-data";
interface ColumnType {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface ICustomTableProps<T> extends Partial<TableProps> {
  isLoading?: boolean;
  items: T[];
  columns: ColumnType[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  setSelectedKeys: (keys: Selection) => void;
}

const CustomTable = <T extends { _id: string }>({
  isLoading,
  items,
  columns,
  renderCell,
  setSelectedKeys,
  ...props
}: ICustomTableProps<T>) => {
  const classNames = React.useMemo(
    () => ({
      wrapper: "max-h-[382px] ",

      th: "bg-gray-100 whitespace-nowrap text-default-500 border-b border-divider text-sm",
      td: [
        "border-b",
        "border-divider",
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
      loadingWrapper: ["mt-[150px]"],
    }),
    [],
  );

  return (
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContentPlacement="outside"
      classNames={classNames}
      selectionMode="multiple"
      {...props}
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        if (typeof keys === "string" && keys === "all") {
          setSelectedKeys(new Set(items.map((item) => item._id)));
        } else {
          setSelectedKeys(new Set(keys));
        }
      }}
      onCellAction={() => {}}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        emptyContent={<NoData />}
        items={items || []}
        loadingContent={
          <div className="">
            <Spinner />
          </div>
        }
      >
        {(item) => (
          <TableRow key={item?._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default CustomTable;
