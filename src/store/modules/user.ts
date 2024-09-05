import { proxy } from 'valtio'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";

export const userStore = proxy({
  // 状态数据
  userInfo: {
    token: getToken(), // Token令牌
    username: "", // 当前登录账号用户名
    backMenuList: [], // 后台获取的菜单
    permissionButtonList: [], // 按钮列表
    authMenuList: [], // 权限菜单
    sidebarMenuList: [], // 侧边栏菜单
  },
  /**
   * 登录存储Token
   * @param loginParam 登录信息 
   * @returns 
   */
  async login({ username, password }: Req.loginParam) {
    const result = await reqLogin({
      username,
      password,
    });
    userStore.userInfo.token = result.data.token;
    setToken(result.data.token);
    return Promise.resolve(result.data);
  },
  /**
   * 获取当前登录账号的信息
   * @returns 
   */
  async getUserInfo() {
    const { code, data } = await reqUserInfo();
    if (code === 200) {
      const userInfo = userStore.userInfo;
      userInfo.username = data.checkUser.username;
      if (data.list.length > 0) {
        console.log(data.list, 'datlist@@@');
      } else {
        userStore.logout(false);
      }
    }
    return Promise.resolve(data.list);
  },
  /**
   * 退出登录
   * @param isRefresh 
   */
  async logout(isRefresh = true) {
    removeToken();
    if (isRefresh) {
      await reqLogout(true);
      window.location.reload();
    }
  },

})
