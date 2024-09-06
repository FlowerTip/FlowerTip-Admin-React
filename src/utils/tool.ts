
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
      }
    }
    // 子集无菜单的
    if (!menu.children || menu.children.length === 0) {
      return {
        key: menu.path,
        label: menu.meta.title
      }
    }
    // 子集有多个菜单的
    if (menu.children && menu.children.length > 1) {
      return {
        key: menu.path,
        label: menu.meta.title,
        children: reorganizeMenu(menu.children)
      }
    }
  })
}