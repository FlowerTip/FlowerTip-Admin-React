import defaultSetting from '@/setting'

/**
 * 重构菜单数据的工具方法
 * @param menuList 
 * @returns 
 */
export const reorganizeMenu = (menuList: MenuConfig.LocalRouteItem[]): MenuConfig.LocalRouteItem[] => {
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
  return data as unknown as MenuConfig.LocalRouteItem[];
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
  dynamicRoutes: MenuConfig.LocalRouteItem[],
  authRouterList: string[]
): MenuConfig.LocalRouteItem[] {
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

/**
 * 判断一个字符串是否为有效的 JSON 字符串
 * @param {string} str - 待判断的字符串
 * @returns {boolean} - 如果是有效的 JSON 字符串返回 true，否则返回 false
 */
export function isIndexOfFiles(str: string): boolean {
  return typeof str === 'string' && str.includes('files')
}

/**
 * 判断是否为md元素
 * @param element 元素
 * @returns 是否为md元素
 */
export function isMdelement(element: JSX.Element): boolean {
  const markdownRegex = /(#+ .+)|(\* .+)|(- .+)|(\d+\. .+)|(\[.+\]\(.+\))|(\*\*.*?\*\*)|(`.*?`)/;
  return !element.type && markdownRegex.test(element as unknown as string);
}