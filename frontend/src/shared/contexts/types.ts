import { UserRole } from "../constants/enums";

export type UserDataType = {
  _id: string;
  role: UserRole;
  username?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  courses?: string[];
};

export type AuthValuesType = {
  loading: boolean;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  initAuth: () => Promise<void>;
  handleLogout: () => void;
};
