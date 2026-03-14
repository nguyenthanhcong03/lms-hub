import { UserStatus, UserRole } from "@/shared/constants/enums";

export type TParamsGetUsers = {
  limit?: number | string;
  page?: number | string;
  search?: string;
  order?: string;
};

export type TParamsEditUser = {
  id: string;
  username: string;
  email: string;
  status: UserStatus | string;
  role: UserRole | string;
  courses: string[];
};

export type TParamsDeleteUser = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleUser = {
  userIds: string[];
};

export type TUserItem = {
  _id: string;
  username?: string;
  email?: string;
  status: UserStatus;
  role: UserRole;
  courses?: string[];
  phone?: string;
  avatar?: string;
};
