
export interface LayoutType {
  mixbar?: string;
  topbar?: string;
  sidebar?: string;
}

export interface SearchFormInterFace {
  [key: string]: string | number | [];
}

export type PagainationType = {
  pageSize?: number;
  currentPage?: number;
  username?: string;
  big?: number;
  sex?: number;
  address?: string;
  time?: Date;
};

export type AvatarUploadType = "round" | "circle";

export type AvatarProps = {
  width?: string | number;
  height?: string | number;
  type?: AvatarUploadType;
  disabled?: boolean;
  fileType?: string[];
  fileSize?: number;
  uploadParam?: {
    id: number | string;
  };
};
