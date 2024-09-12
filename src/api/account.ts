import instance from "@/utils/service";

// 账号相关请求地址的枚举类型
enum API {
  USER_LIST = "/user/userList",
  SAVE_USER = "/user/saveUser",
  DEL_USER = "/user/delUser",
  BATCH_ROLE = "/user/batchRole",
}

// 获取账号数据接口
export const reqAccountList = (data: Req.AccountListParam) =>
  instance.post<Res.AccountListRes>(API.USER_LIST, data);

// 保存账号信息接口
export const reqSaveAccount = (data: Req.SaveAccountParam) =>
  instance.post<Res.SaveAccountRes>(API.SAVE_USER, data);

// 删除账号信息接口
export const reqDelAccount = (data: Req.DelAccountParam) =>
  instance.post<Res.DelAccountRes>(API.DEL_USER, data);

// 账号绑定角色信息接口
export const reqBatchRole = (data: Req.BatchRoleParam) =>
  instance.post<Res.BatchRoleRes>(API.BATCH_ROLE, data);