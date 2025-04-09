import screenfull from "screenfull";
import { useSnapshot } from 'valtio'
import { useNavigate } from "react-router-dom";
import type { MenuProps } from 'antd';
import { tagsViewStore } from '@/store';

const useTabOperations = (routeMeta: MetaType, setCurrPath: (path: string) => void) => {
  const tStore = useSnapshot(tagsViewStore);
  const navigate = useNavigate();
  // 提取公共函数，用于查找当前激活的菜单项
  const findCurrentTab = () => {
    return tStore.tabsMenuList.find((item) => item.key === routeMeta.path);
  };

  // 关闭所有菜单
  const closeAllTab = () => {
    tStore.closeMultipleTab();
    navigate("/");
  };

  // 关闭当前菜单
  const closeCurrent = () => {
    const current = findCurrentTab();
    if (current) {
      const returnNextTab = tStore.removeTab(current.key as string, true);
      if (returnNextTab && returnNextTab.key) {
        navigate(returnNextTab.redirect);
        setCurrPath(returnNextTab.key);
      }
    }
  };

  // 关闭左侧菜单
  const closeLeft = () => {
    const current = findCurrentTab();
    current && tStore.closeTabsOnSide(current.key as string, "left");
  };

  // 关闭右侧菜单
  const closeRight = () => {
    const current = findCurrentTab();
    current && tStore.closeTabsOnSide(current.key as string, "right");
  };

  // 关闭其他菜单
  const closeOther = () => {
    const current = findCurrentTab();
    current && tStore.closeMultipleTab(current.key);
  };
  const moreTabClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case "refresh":
        setTimeout(() => {
          window.location.reload();
        }, 0);
        break;
      case "fullScreen": {
        const dom: HTMLDivElement = document.querySelector(".view-layout")!;
        screenfull.request(dom);
        break;
      }
      case "closeAll":
        closeAllTab();
        break;
      case "closeCurrent":
        closeCurrent();
        break;
      case "closeLeft":
        closeLeft();
        break;
      case "closeRight":
        closeRight();
        break;
      case "closeOther":
        closeOther();
        break;
      default:
        console.log("默认操作");
    }
  }

  return {
    moreTabClick
  };
};

export default useTabOperations;