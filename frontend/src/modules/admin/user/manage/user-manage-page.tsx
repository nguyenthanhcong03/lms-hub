"use client";

import TableAction from "@/shared/components/common/table-action";
import TableActionItem from "@/shared/components/common/table-action-item";
import CustomSelect from "@/shared/components/form/custom-select";

import CustomTable from "@/shared/components/table";
import { DEFAULT_IMAGE } from "@/shared/constants";

import { AppDispatch, useAppDispatch, useAppSelector } from "@/shared/store";
import {
  deleteMultipleUserAsync,
  deleteUserAsync,
  getAllUsersAsync,
} from "@/shared/store/user/action";
import { Button, Selection } from "@heroui/react";

import { useCallback, useEffect, useMemo, useState } from "react";

import ConfirmationDialog from "@/shared/components/confirmation-dialog";

import { LabelStatus } from "@/shared/components/common/label-status";
import InputSearch from "@/shared/components/input-search";
import SelectPerPage from "@/shared/components/select-per-page";
import BottomPagination from "@/shared/components/table/bottom-pagination";
import { UserRole, UserStatus } from "@/shared/constants/enums";
import {
  userRoleActions,
  userStatus,
  userStatusActions,
} from "@/shared/constants/user.constant";
import { resetInitialState } from "@/shared/store/user";
import { TUserItem } from "@/shared/types/user";
import { formatFilter } from "@/utils/common";
import moment from "moment";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import ModalAddEditUser from "../components/modal-add-edit-user";

const UserManagePage = () => {
  const [filterBy, setFilterBy] = useImmer<{
    search: string;
    page: number;
    limit: number;
    status: UserStatus | string;
    role: UserRole | string;
  }>({
    search: "",
    page: 1,
    limit: 10,
    status: "",
    role: "",
  });

  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: "",
  });
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: "",
  });

  // ** redux
  const dispatch: AppDispatch = useAppDispatch();
  const {
    users,
    pagination,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isErrorDelete,
    isSuccessDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  } = useAppSelector((state) => state.user);

  // Calculate start and end indices
  const startIndex = (filterBy.page - 1) * Number(filterBy.limit) + 1;
  const endIndex = Math.min(
    filterBy.page * Number(filterBy.limit),
    pagination?.total_count,
  );

  const columns = [
    { name: "Thông tin", uid: "username" },
    { name: "Vai trò", uid: "role" },
    { name: "Trạng thái", uid: "status" },
    { name: "Ngày tạo", uid: "createdAt" },
    { name: "Hành động", uid: "actions" },
  ];
  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: "",
    });
  };
  const renderCell = useCallback((item: TUserItem, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof TUserItem];

    switch (columnKey) {
      case "username":
        return (
          <div className="flex items-center gap-3">
            <Image
              src={item?.avatar || DEFAULT_IMAGE}
              alt={item?.username || ""}
              width={64}
              height={64}
              className="borderDarkMode size-10 flex-shrink-0 rounded-full object-cover"
            />
            <div className="whitespace-nowrap">
              <h4 className="line-clamp-2 block max-w-[400px] whitespace-nowrap text-sm font-bold">
                {item?.username}
              </h4>
              <h5 className="font-medium">{item.email}</h5>
            </div>
          </div>
        );

      case "role":
        return <span className="font-bold uppercase">{cellValue}</span>;

      case "status":
        return (
          <LabelStatus color={userStatus[item.status]?.color}>
            {userStatus[item.status]?.label}
          </LabelStatus>
        );

      case "createdAt":
        return <span>{moment(cellValue).format("DD/MM/YYYY")}</span>;

      case "actions":
        return (
          <TableAction>
            <TableActionItem
              type="edit"
              onClick={() => setOpenCreateEdit({ open: true, id: item?._id })}
            />
            <TableActionItem
              type="delete"
              onClick={() =>
                setOpenDeleteUser({
                  open: true,
                  id: item?._id,
                })
              }
            />
          </TableAction>
        );

      default:
        return cellValue;
    }
  }, []);

  // Fetch API
  const handleGetListUsers = () => {
    const query = {
      params: {
        ...formatFilter(filterBy),
      },
    };

    dispatch(getAllUsersAsync(query));
  };
  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      id: "",
    });
  };
  const handleCloseConfirmDeleteMultipleUser = () => {
    setOpenDeleteMultipleUser(false);
  };
  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id));
  };
  const handleDeleteMultipleUser = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: Array.from(selectedKeys) as string[],
      }),
    );
  };

  useEffect(() => {
    handleGetListUsers();
  }, [filterBy]);

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success("Chỉnh sửa danh mục thành công");
      } else {
        toast.success("Tạo mới danh mục thành công");
      }

      handleGetListUsers();
      dispatch(resetInitialState());
      handleCloseCreateEdit();
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      if (typeError) {
        toast.error(messageErrorCreateEdit);
      } else {
        if (openCreateEdit.id) {
          toast.error(`Chỉnh sửa danh mục thất bại`);
        } else {
          toast.error(`Tạo mới danh mục thất bại`);
        }
      }
      dispatch(resetInitialState());
    }
  }, [
    isSuccessCreateEdit,
    isErrorCreateEdit,
    messageErrorCreateEdit,
    typeError,
    dispatch,
  ]);
  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(`Xóa danh mục thành công.`);

      handleGetListUsers();
      handleCloseConfirmDeleteUser();
      dispatch(resetInitialState());
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(`Xóa danh mục thất bại.`);
      dispatch(resetInitialState());
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete]);

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success("Xóa nhiều danh mục thành công.");
      handleGetListUsers();
      handleCloseConfirmDeleteMultipleUser();
      setSelectedKeys(new Set());
      dispatch(resetInitialState());
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error("Xóa nhiều mã danh mục thất bại.");
      dispatch(resetInitialState());
    }
  }, [
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete,
  ]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4">
            <CustomSelect
              placeholder="Trạng thái"
              selectedKeys={[filterBy.status]}
              onChange={(e) => {
                setFilterBy((draft) => {
                  draft.status = e.target.value;
                  draft.page = 1;
                });
              }}
              items={userStatusActions}
            />
          </div>
          <div className="col-span-4">
            <CustomSelect
              placeholder="Vai trò"
              selectedKeys={[filterBy.role]}
              onChange={(e) => {
                setFilterBy((draft) => {
                  draft.role = e.target.value;
                  draft.page = 1;
                });
              }}
              items={userRoleActions}
            />
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between gap-3">
          <div className="w-full max-w-[300px]">
            <InputSearch
              onSearchValue={(value: string) => {
                setFilterBy((draft) => {
                  draft.search = value;
                  draft.page = 1;
                });
              }}
            />
          </div>

          <div className="flex gap-3">
            <SelectPerPage
              limit={filterBy.limit}
              onchange={(value: string) => {
                setFilterBy((draft) => {
                  draft.limit = +value;
                  draft.page = 1;
                });
              }}
            />
            {[...selectedKeys]?.length > 0 && (
              <Button
                className="h-10 flex-shrink-0 bg-red-500 px-4 text-base font-medium text-white"
                startContent={<FaRegTrashAlt size={18} />}
                size="sm"
                onPress={() => setOpenDeleteMultipleUser(true)}
              >
                Xóa
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }, [filterBy, selectedKeys]);

  const bottomContent = useMemo(
    () =>
      users?.length > 0 && (
        <BottomPagination
          total_pages={pagination?.total_pages}
          total_count={pagination.total_count}
          page={filterBy.page}
          startIndex={startIndex}
          endIndex={endIndex}
          onChangePage={(page: number) => {
            setFilterBy((draft) => {
              draft.page = page;
            });
          }}
        />
      ),
    [pagination, filterBy],
  );

  return (
    <>
      {openCreateEdit.open && (
        <ModalAddEditUser
          isOpen={openCreateEdit.open}
          onOpenChange={handleCloseCreateEdit}
          idUser={openCreateEdit.id}
        />
      )}

      {openDeleteUser.open && (
        <ConfirmationDialog
          isOpen={openDeleteUser.open}
          onCancel={handleCloseConfirmDeleteUser}
          onConfirm={handleDeleteUser}
          title={"Xóa danh mục"}
        />
      )}

      {openDeleteMultipleUser && (
        <ConfirmationDialog
          isOpen={openDeleteMultipleUser}
          onCancel={handleCloseConfirmDeleteMultipleUser}
          onConfirm={handleDeleteMultipleUser}
          title={"Xóa nhiều danh mục"}
        />
      )}

      <div className="rounded-lg p-5 shadow-medium">
        <CustomTable
          isLoading={isLoading}
          items={users || []}
          renderCell={renderCell}
          columns={columns}
          topContent={topContent}
          bottomContent={bottomContent}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
      </div>
    </>
  );
};

export default UserManagePage;
