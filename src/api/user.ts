import instance from "@/utils/service";

// 用户接口相关的的枚举类型
enum API {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info",
  LOGOUT_URL = "/user/logout",
  GET_ROLE = "/user/getRole",
}

// 用户登录接口
export const reqLogin = (data: Req.loginParam) =>
  instance.post<Res.LoginData>(API.LOGIN_URL, data);

// 获取用户信息接口
export const reqUserInfo = () =>
  instance.get<Res.UserInfoData>(API.USERINFO_URL);

// 退出登录接口
export const reqLogout = (status: boolean) =>
  instance.post<Res.LogoutData>(API.LOGOUT_URL, { status });

// 获取当前登入账号拥有的角色列表接口
export const reqGetRole = (data: Req.GetRoleParam) =>
  instance.get<Res.RoleListData>(API.GET_ROLE, {
    params: data,
  });
