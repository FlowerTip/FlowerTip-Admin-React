import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

export const tagsViewStore = proxy({
  tabsMenuList: [] as any,
  // 添加标签
  async addTab(tabItem: any) {
    if (tagsViewStore.tabsMenuList.every((item: any) => item.key !== tabItem.key)) {
      tagsViewStore.tabsMenuList.push(tabItem);
    }
  },
  // 删除标签
  async removeTab(tabPath: string, isCurrent = true) {
    if (tagsViewStore.tabsMenuList.length === 1) return;
    if (isCurrent) {
      tagsViewStore.tabsMenuList.forEach((item: any, index: number) => {
        if (item.path !== tabPath) return;
        const nextTab: any =
          tagsViewStore.tabsMenuList[index + 1] || tagsViewStore.tabsMenuList[index - 1];
        if (!nextTab) return;
        // navigate(nextTab.path)
      });
    }
    // 重新设置标签组
    tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter(
      (item: any) => item.path !== tabPath
    );
  },
  // 关闭标签（以自身为轴心，向左或向右关闭标签）
  async closeTabsOnSide(path: string, type: "left" | "right") {
    const currentIndex = tagsViewStore.tabsMenuList.findIndex(
      (item: any) => item.path === path
    );
    if (currentIndex !== -1) {
      const range =
        type === "left"
          ? [0, currentIndex]
          : [currentIndex + 1, tagsViewStore.tabsMenuList.length];
      tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter((item: any, index: number) => {
        return index < range[0] || index >= range[1] || !item.close;
      });
    }
  },
  // 关闭其他标签
  async closeMultipleTab(tabsMenuValue?: string) {
    tagsViewStore.tabsMenuList = tagsViewStore.tabsMenuList.filter((item: any) => {
      return item.path === tabsMenuValue || !item.close;
    });
  },
});
devtools(tagsViewStore, { name: 'tagsViewStore', enabled: true })