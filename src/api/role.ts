import instance from "@/utils/service";
import { PagainationType } from "@/types";

// 角色相关接口的枚举类型
enum API {
  MENU_LIST = "/role/roleList",
  ADD_MENU__INFO = "/role/saveRole",
  DEL_MENU__INFO = "/role/delRole",
  BATCH_PERMISSION = "/role/batchPermission",
  GET_PERMISSION = "/role/getPermission",
}

// 获取角色列表数据接口
export const reqRoleList = (data: PagainationType) =>
  instance.post<Res.RoleListData>(API.MENU_LIST, data);

// 保存角色信息数据接口
export const reqSaveRole = (data: RoleItem) =>
  instance.post<Res.SaveRoleData>(API.ADD_MENU__INFO, data);

// 删除角色信息数据接口
export const reqDelRole = (data: DelDefaultData) =>
  instance.delete<Res.DelRoleData>(API.DEL_MENU__INFO, {
    params: data,
  });

// 角色绑定权限菜单接口
export const reqBatchPermission = (data: Req.BatchPermissionData) =>
  instance.post<Res.BatchPermissionData>(API.BATCH_PERMISSION, data);

// 获取操作的角色绑定的权限菜单数据接口
export const reqGetPermission = (data: Req.GetPermissionData) =>
  instance.get<Res.GetPermissionData>(API.GET_PERMISSION, {
    params: data,
  });