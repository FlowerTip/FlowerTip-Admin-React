import defaultSetting from '@/setting'

/**
 * 重构菜单数据的工具方法
 * @param menuList 
 * @returns 
 */
export const reorganizeMenu = (menuList: any[]): any[] => {
  return menuList.map(menu => {
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
}

/**
 * 获取当前显示路由的标题
 * @param {*} to
 * @returns title
 */

export function getPageTitle(meta: any): string {
  return meta && meta.title
    ? `${meta.title} - ${defaultSetting.title}`
    : defaultSetting.title;
}
