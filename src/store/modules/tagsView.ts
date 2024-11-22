import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

export const tagsViewStore = proxy({
  tabsMenuList: [] as TagViewItem[],
  /**
   * 添加标签页
   * @param tabItem - 要添加的标签页
   * @description 如果标签页的 key 值不存在于标签页列表中，则将其添加到列表中
   */
  addTab(tabItem: TagViewItem) {
    if (tagsViewStore.tabsMenuList.every((item) => item.key !== tabItem.key)) {
      tagsViewStore.tabsMenuList.push(tabItem);
    }
  },
  /**
   * 移除标签页
   * @param tabPath - 要移除的标签页的路径
   * @param isCurrent - 是否移除当前标签页
   * @returns 下一个标签页
   */
  removeTab(tabPath: string, isCurrent = true) {
    if (tagsViewStore.tabsMenuList.length === 1) return;
    if (isCurrent) {
      tagsViewStore.tabsMenuList.forEach((item, index: number) => {
        if (item.key !== tabPath) return;
        const nextTab =
          tagsViewStore.tabsMenuList[index + 1] || tagsViewStore.tabsMenuList[index - 1];
        if (!nextTab) return;
      });
    }
    // 重新设置标签组
    tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter(
      (item) => item.key !== tabPath
    );
    // 切换下一个标签
    return tagsViewStore.tabsMenuList[tagsViewStore.tabsMenuList.length - 1];
  },
  /**
   * 关闭侧边标签页
   * @param path - 要关闭的标签页的路径
   * @param type - 要关闭的标签页的方向，只能是 "left" 或 "right"
   */
  closeTabsOnSide(path: string, type: "left" | "right") {
    const currentIndex = tagsViewStore.tabsMenuList.findIndex(
      (item) => item.key === path
    );
    if (currentIndex !== -1) {
      const range =
        type === "left"
          ? [0, currentIndex]
          : [currentIndex + 1, tagsViewStore.tabsMenuList.length];
      tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter((item, index: number) => {
        return index < range[0] || index >= range[1] || !item.closable;
      });
    }
  },
  /**
  * 关闭多个标签页
  * @param tabsMenuValue - 要保留的标签页的 key 值，如果未提供，则不保留任何标签页
  */
  closeMultipleTab(tabsMenuValue?: string) {
    tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter((item) => {
      return item.key === tabsMenuValue || !item.closable;
    });
  },
});
devtools(tagsViewStore, { name: 'tagsViewStore', enabled: true })