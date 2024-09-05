/**
 * 全局设置的类型声明
 */
declare namespace AppTypeConfig {
  type ElementPlusSizeType = "large" | "default" | "small";
  interface MetaProp {
    icon: string;
    title: string;
    activeMenu?: string;
    isLink?: string;
    isHide: boolean;
    isFull: boolean;
    isAffix: boolean;
    isKeepAlive: boolean;
    hidden?: boolean;
    parentName?: string;
  }
  interface MenuOption {
    path: string;
    name: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: AppTypeConfig.MetaProp;
    children?: AppTypeConfig.MenuOption[];
    noShowingChildren?: boolean;
    alwaysShow?: boolean;
  }
  interface SettingConfig {
    showHeaderBar?: boolean;
    showFooterBar?: boolean;
    showHeaderLogo?: boolean;
    showTagsView?: boolean;
    showBreadcrumb?: boolean;
    layout?: string;
    color?: string;
    themeName?: string;
    topShowCollapsed?: boolean;
  }
}

/**
 * 删除接口的默认类型声明
 */
declare interface DelDefaultData {
  ids: number[];
}

/**
 * 请求参数类型声明
 */
declare namespace Req {
  interface loginParam {
    username: string;
    password: string;
    code?: string;
  }
  interface DelStudentParam {
    ids: number[];
  }
  interface SaveStudentParam {
    id?: number | string;
    username: string;
    age: number | string;
    address: string;
    sex: number | string;
    big: number | string;
    color: string;
    hobby: string;
    school: string;
    time: Date | string;
    avatarUrl: string;
  }
  interface MenuListParam {
    pageSize?: number;
    currentPage?: number;
    username?: string;
    big?: number;
    sex?: number;
    address?: string;
    time?: Date;
  }

  interface GetRoleParam {
    userId: number;
  }
  /**
   * reqSaveAccount 保存账号信息接口的请求参数
   *
   * id: number 数值类型 为可选参数，更新账号信息时需要传递id参数
   *
   * username: string 字符串类型 账号名为必选参数
   *
   * password: string 字符串类型 账号密码为必选参数
   */
  interface SaveAccountParam {
    id?: number;
    username: string;
    password: string;
  }

  interface DelAccountParam {
    ids: number[];
  }

  interface BatchRoleParam {
    userId: number;
    roleIds: number[];
  }

  interface AccountListParam {
    currentPage?: number;
    pageSize?: number;
    username?: string;
  }

  interface BatchPermissionData {
    roleId: number;
    menusId: number[];
  }

  interface GetPermissionData {
    roleId: number;
  }
}

/**
 * 列表接口的默认类型声明
 */
interface DefaultData<T> {
  list: T[];
  message: string;
}

declare type AccountItem = {
  id?: number;
  username: string;
  password: string;
};

declare type MenuItem = {
  name: string;
  code: string;
  level: number;
  updateTime: Date | string;
};

declare type StudentItem = {
  id?: number | string;
  username: string;
  age: number | string;
  address: string;
  sex: number | string;
  big: number | string;
  color: string;
  hobby: string;
  school: string;
  time: Date | string;
  avatarUrl: string;
  bigLabel?: string;
  sexLabel?: string;
};

declare type RoleItem = {
  id?: number | string;
  roleName: string;
  remark?: string;
  updateTime?: Date | string;
};

/**
 * 响应数据类型声明
 */
declare namespace Res {
  /**
   * 登录接口返回的数据格式
   */
  interface LoginData {
    token: string;
  }
  /**
   * 用户信息接口返回的数据格式
   */
  interface UserInfoData {
    id: string;
    checkUser: {
      username: string;
    };
    list: MenuItem[];
    buttons: string[];
  }
  /**
   * 退出登录接口返回的数据格式
   */
  interface LogoutData {
    status?: boolean;
    message: string;
  }
  type MenuListData = DefaultData<MenuItem>;

  /**
   * 保存学员信息接口返回的数据格式
   */
  interface SaveStudentData {
    id?: number;
  }
  /**
   * 学员列表接口返回的数据格式
   */
  interface StudentListData {
    list: StudentItem[];
    total: number;
    message: string;
  }

  interface DelStudentData {
    message: string;
  }

  interface UploadAvatarData {
    url?: string;
    message: string;
  }

  type PermissionMenuRes = ResponseData;
  interface RoleListData extends DefaultData<RoleItem> {
    total: number;
  }
  interface DelRoleData {
    message: string;
  }

  interface AccountListRes extends DefaultData<AccountItem> {
    total: number;
  }

  interface SaveAccountRes extends ResponseData {
    data: {
      message: string;
    };
  }

  interface DelAccountRes extends ResponseData {
    data: {
      message: string;
    };
  }

  interface BatchRoleRes extends ResponseData {
    data: {
      message: string;
    };
  }

  interface SaveRoleData {
    id?: number;
  }

  interface BatchPermissionData {
    message: string;
  }

  type GetPermissionData = DefaultData<MenuItem>;
}
