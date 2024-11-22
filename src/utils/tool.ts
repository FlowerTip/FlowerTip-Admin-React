import defaultSetting from '@/setting'
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

interface BackMenuItem {
  path: string;
  name: string;
  redirect?: string;
  meta: {
    title: string;
    icon: string;
  };
  children?: BackMenuItem[];
}

interface ReMapMenuItem {
  key: string;
  label: string;
  icon: AntdIconProps;
  redirect?: string;
  children?: ReMapMenuItem[];
}

/**
 * 重构菜单数据的工具方法
 * @param menuList 
 * @returns 
 */
export const reorganizeMenu = (menuList: BackMenuItem[]): ReMapMenuItem[] => {
  const data = menuList.map(menu => {
    // 子集只有一个菜单的
    if (menu.children && menu.children.length === 1) {
      return {
        key: menu.path,
        label: menu.children[0].meta.title,
        icon: menu.meta.icon,
        redirect: menu.redirect,
      }
    }
    // 子集无菜单的
    if (!menu.children || menu.children.length === 0) {
      return {
        key: menu.path,
        label: menu.meta.title,
        icon: menu.meta.icon
      }
    }
    // 子集有多个菜单的
    if (menu.children && menu.children.length > 1) {
      return {
        key: menu.path,
        label: menu.meta.title,
        icon: menu.meta.icon,
        redirect: menu.redirect,
        children: reorganizeMenu(menu.children)
      }
    }
  })
  return data as unknown as ReMapMenuItem[];
}

/**
 * 获取当前显示路由的标题
 * @param {*} to
 * @returns title
 */

export function getPageTitle(meta: {
  title: string;
}): string {
  return meta && meta.title
    ? `${meta.title} - ${defaultSetting.title}`
    : defaultSetting.title;
}

/**
 * 过滤掉属性children为空的
 * @param data 
 * @returns 
 */ 

export function delChildren(data: AppTypeConfig.MenuOption[]) {
  let tempList: AppTypeConfig.MenuOption[] = []
  data.forEach((item) => {
    let obj;
    if (item.children && item.children.length === 0) {
      obj = { ...item }
      delete obj.children
      tempList.push(obj);
    }
    if (item.children && item.children.length > 0) {
      obj = {
        ...item,
        children: delChildren(item.children)
      }
      tempList.push(obj);
    }
  });
  return tempList;
}

/**
 *
 * @param dynamicRoutes
 * @param authRouterList
 * @returns
 */
export function filterAsyncRoutes(
  dynamicRoutes: BackMenuItem[],
  authRouterList: string[]
) {
  return dynamicRoutes.filter((route) => {
    // 1.如果route的name在routeNames中没有, 直接过滤掉
    if (!authRouterList.includes(route.name)) return false;

    // 2.如果当前route还有子路由(也就是有children), 需要对子路由也进行权限过滤
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRoutes(route.children, authRouterList);
    }
    return true;
  });
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID(): string {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    const random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}
