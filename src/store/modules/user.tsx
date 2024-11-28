import { proxy } from 'valtio'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import { asyncRoute } from '@/router/modules/routes';
import { reorganizeMenu, filterAsyncRoutes } from '@/utils/tool';
import { devtools } from 'valtio/utils';

export const userStore = proxy({
  // 状态数据
  userInfo: {
    token: getToken(), // Token令牌
    username: "", // 当前登录账号用户名
    backMenuList: [] as MenuConfig.LocalRouteItem[], // 后台获取的菜单
    permissionButtonList: [] as string[], // 按钮列表
    authMenuList: [] as MenuConfig.ReMapMenuItem[], // 权限菜单
    sidebarMenuList: [] as MenuConfig.ReMapMenuItem[], // 侧边栏菜单
    roleNames: '', // 角色名称
    workPostName: '', // 岗位名称
    departmentName: '', // 部门名称
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
      userStore.userInfo = {...userStore.userInfo, ...data.checkUser};
      if (data.list.length > 0) {
        let menuList: MenuConfig.LocalRouteItem[] = [];
        if (process.env.NODE_ENV === "production") {
          menuList = filterAsyncRoutes(
            asyncRoute as MenuConfig.LocalRouteItem[],
            data.list.map((item) => item.code)
          );
        } else {
          menuList = [...asyncRoute] as MenuConfig.LocalRouteItem[];
        }
        userStore.userInfo.backMenuList = menuList;
        userStore.userInfo.permissionButtonList = data.buttons;
        // 左侧菜单需要数组
        userStore.userInfo.authMenuList = reorganizeMenu(menuList);
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
  /**
   * 更新侧边栏菜单
   * @param menuList 
   */
  updateLeftMenus(menuList: MenuConfig.ReMapMenuItem[]) {
    userStore.userInfo.sidebarMenuList = menuList;
  },

})


devtools(userStore, { name: 'userStore', enabled: true })