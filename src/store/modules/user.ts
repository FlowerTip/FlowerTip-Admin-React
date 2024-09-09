import { proxy } from 'valtio'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import { asyncRoute } from '@/router/modules/routes';
import { reorganizeMenu } from '@/utils/tool';
import { devtools } from 'valtio/utils';

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
    const { code, data } = await reqLogin({
      username,
      password,
    });
    if (code === 200) {
      userStore.userInfo.token = data.token;
      setToken(data.token);
      return Promise.resolve(data);
    }
  },
  /**
   * 获取当前登录账号的信息
   * @returns 
   */
  async getUserInfo() {
    const { code, data } = await reqUserInfo();
    if (code === 200) {
      userStore.userInfo.username = data.checkUser.username;
      // if (data.list.length > 0) {
      //   console.log(data.list, 'datlist@@@');
      //   userStore.userInfo.backMenuList = data.list as unknown as any;
      // } else {
      //   userStore.logout(false);
      // }
      userStore.userInfo.backMenuList = asyncRoute as unknown as any;
      userStore.userInfo.authMenuList = reorganizeMenu(asyncRoute) as unknown as any;

      // console.log(userStore.userInfo.authMenuList, 'userStore.userInfo.authMenuList@@@@@');

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
  /**
   * 更新侧边栏菜单
   * @param menuList 
   */
  updateLeftMenus(menuList: any) {
    userStore.userInfo.sidebarMenuList = menuList;
  },

})


devtools(userStore, { name: 'userStore', enabled: true })