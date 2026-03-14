export type TParamsGetCategories = {
  limit?: number | string;
  page?: number | string;
  search?: string;
};

export type TParamsCreateCategory = {
  name: string;
  slug: string;
};

export interface TParamsEditCategory extends Partial<TParamsCreateCategory> {
  id: string;
}

export type TParamsDeleteCategory = {
  id: string;
  name: string;
};

export type TParamsDeleteMultipleCategory = {
  categoryIds: string[];
};

export type TCategoryItem = {
  _id: string;
  name: string;
  slug: string;
  createdBy: {
    _id: string;
    username: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};
