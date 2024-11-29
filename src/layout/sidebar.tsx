import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import screenfull from "screenfull";
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import { userStore, tagsViewStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { SidebarComponentProps, NavbarComponentProps, HeaderComponentProps } from './types/index'
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import TopHeader from './components/topHeader';
import './style/index.scss';
const { Content } = Layout;

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const contentStyle: React.CSSProperties = {
    marginLeft: collapsed ? '50px' : '200px'
  };
  const breadcrumbItems = [];
  const navigate = useNavigate();
  const tStore = useSnapshot(tagsViewStore)
  const uStore = useSnapshot(userStore);
  const topMenuList = uStore.userInfo.authMenuList as unknown as any;

  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList);

  // 关闭所有菜单
  const closeAllTab = () => {
    tagsViewStore.closeMultipleTab();
    navigate("/")
  };

  // 关闭当前菜单
  const closeCurrent = () => {
    const current = tStore.tabsMenuList.find(
      (item) => item.key === routeMeta.path
    );
    console.log(current, "ccurrent");
    if (current) {
      const returnNextTab = tStore.removeTab(current.key as string, true);
      console.log(returnNextTab, 'returnNextTab');
      if (returnNextTab && returnNextTab.key) {
        navigate(returnNextTab.redirect);
        setSidebarPath(returnNextTab.key);
      }
    }
  };

  // 关闭左侧菜单
  const closeLeft = () => {
    const current = tStore.tabsMenuList.find(
      (item) => item.key === routeMeta.path
    );
    current && tStore.closeTabsOnSide(current.key as string, "left");
  };

  // 关闭右侧菜单
  const closeRight = () => {
    const current = tStore.tabsMenuList.find(
      (item) => item.key === routeMeta.path
    );
    current && tStore.closeTabsOnSide(current.key as string, "right");
  };

  // 关闭其他菜单
  const closeOther = () => {
    const current = tStore.tabsMenuList.find(
      (item) => item.key === routeMeta.path
    );
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

  const [sidebarPath, setSidebarPath] = useState(routeMeta.path)
  const parentItem = {
    title: (topRoute as any).meta?.title,
    onClick: () => {
      navigate((topRoute as any).redirect);
    }
  }
  const childItem = {
    title: routeMeta.title,
    onClick: () => {
      navigate(routeMeta.redirect)
    }
  }
  if (parentItem.title === childItem.title) {
    breadcrumbItems.push(parentItem);
  } else {
    breadcrumbItems.push(parentItem, childItem);
  }
  useEffect(() => {
    if (!routeMeta.redirect) {
      navigate((uStore.userInfo.backMenuList[0] as any).redirect);
    }
  }, [])


  const handlerSelect = ({ key, keyPath }: any) => {
    const hasOnlyOne = topMenuList.find((menu: any) => menu.key == key);
    let redirectUrl = '';
    if (keyPath.length > 1) {
      keyPath.reverse().forEach((path: string, index: number) => {
        if (index == 0) {
          redirectUrl = path;
        } else {
          redirectUrl = redirectUrl + '/' + path;
        }
      })
    } else {
      if (hasOnlyOne && hasOnlyOne.redirect) {
        redirectUrl = hasOnlyOne.redirect
      } else {
        redirectUrl = key;
      }
    }
    if (!isExternalFn(redirectUrl)) {

      const childList = topRoute.children as unknown as any;
      const isMoreLevel = childList.length > 1 && childList.every((item: any) => item.redirect);


      if (isMoreLevel) {
        console.log(keyPath, redirectUrl, routeMeta, topRoute, '无法跳转的哈市');
        const findChild = childList.find((child: any) => child.redirect.includes(redirectUrl));
        console.log(findChild, '测试举手哈');
        if (findChild) {
          redirectUrl = findChild.redirect
          setSidebarPath(findChild.children[0].path);
        } else {
          setSidebarPath(key);
        }
      } else {
        const tempPath = redirectUrl.replace('/' + key, '');
        console.log(tempPath, 'tempPath');
        setSidebarPath(key);
      }

      console.log(redirectUrl, 'redirectUrl');

      navigate(redirectUrl);
    } else {
      setSidebarPath(key);
    }
  }

  const onTabClick = (key: string) => {
    const currTab = tagsViewStore.tabsMenuList.find((tab: any) => tab.key === key);
    currTab && navigate(currTab.redirect);
    if (key == '/home') {
      setSidebarPath('/home');
    } else {
      setSidebarPath(key);
    }
  }

  const sidebarProps: SidebarComponentProps = {
    collapsed,
    showSidebar: true,
    onSelect: handlerSelect,
    selectedKeys: sidebarPath,
    menus: uStore.userInfo.authMenuList as any,
  }

  const navbarProps: NavbarComponentProps = {
    collapsed,
    showSidebar: true,
    activeKey: sidebarPath,
    onTabClick,
    moreTabClick,
    toggleCollapsed,
    breadcrumbItems
  }
  const HeaderProps: HeaderComponentProps = {
    selectedKeys: '',
    onSelect: handlerSelect,
    collapsed,
    toggleCollapsed
  }
  return (
    <Layout className='layout-wrapper'>
      <TopHeader {...HeaderProps} />
      <Layout className='layout-content' style={contentStyle}>
        <Sidebar {...sidebarProps} />
        <Layout className='wrapper'>
          <Navbar {...navbarProps} />
          <Content
            className='view-layout'
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout >
  );
};

export default SidebarLayout;