import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import { HeaderComponentProps, SidebarComponentProps, NavbarComponentProps } from './types/index'
import screenfull from "screenfull";
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import { userStore, tagsViewStore, settingStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { reorganizeMenu } from '@/utils/tool';
import TopHeader from './components/topHeader';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Footip from './components/footip';
import './style/index.scss';
const { Content } = Layout;

const MibBarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [showSidebar, setShowSidebar] = useState(true)
  const contentStyle: React.CSSProperties = {
    marginLeft: showSidebar && collapsed ? '50px' : showSidebar && !collapsed ? '200px' : !showSidebar ? '0px' : '0px'
  };
  const breadcrumbItems = [];
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState('');
  const tStore = useSnapshot(tagsViewStore)
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
  const topMenuList = uStore.userInfo.authMenuList as unknown as any;

  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList as unknown as RouteType[]);
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
        setCurrPath(returnNextTab.key);
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

  const [currPath, setCurrPath] = useState('/')
  const [sidebarPath, setSidebarPath] = useState(routeMeta.path)
  const parentItem = {
    title: topRoute.meta?.title,
    onClick: () => {
      navigate(topRoute.redirect);
      setCurrPath(routeMeta.redirect)
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
      const backMenuList = uStore.userInfo.backMenuList;
      navigate((backMenuList[0] as any).redirect);
      setCurrPath((backMenuList[0] as any).path);
    }
  }, [])

  useEffect(() => {
    if (!routeMeta.redirect) return;
    const pathList = routeMeta.redirect.split('/').filter((path: string) => path);
    const key = pathList[pathList.length - 1];
    const keys: string[] = [];
    pathList.forEach((path: string, index: number) => {
      if (index === 0) {
        keys.push('/' + path);
      } else {
        keys.push(path);
      }
    });
    const keyPath = keys.reverse();
    const selectedKeys = [key];
    const defaultSelectParam = {
      key, keyPath, selectedKeys, item: null as unknown as React.ReactInstance, domEvent: null as unknown as React.MouseEvent<HTMLElement>
    }
    handlerSelect && handlerSelect(defaultSelectParam)
    if (routeMeta.children && routeMeta.children.length === 1) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
    const childList = topRoute.children;
    let menuList = [] as MenuConfig.LocalRouteItem[];
    if (childList.length > 1 && childList.every((item) => item.redirect)) {
      if (routeMeta.children) {
        menuList = reorganizeMenu(routeMeta.children as any);
        setActiveIndex(topRoute.path);
      } else {
        const findChildren = childList.find((child) => child.redirect.includes(routeMeta.redirect.replace('/' + routeMeta.path, '')));
        findChildren && findChildren.children && (menuList = reorganizeMenu(findChildren.children as unknown as MenuConfig.LocalRouteItem[]))
        findChildren && setActiveIndex(findChildren.path);
      }
    } else {
      menuList = reorganizeMenu(childList as unknown as MenuConfig.LocalRouteItem[]);
      setActiveIndex(topRoute.path);
    }
    uStore.updateLeftMenus(menuList as unknown as MenuConfig.LocalRouteItem[]);
  }, [currPath])

  const handlerSelect: MenuProps['onSelect'] = ({ key, keyPath }) => {
    const hasOnlyOne = topMenuList.find((menu: MenuConfig.LocalRouteItem) => menu.key == key);
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
        // setShowSidebar(false)
      } else {
        redirectUrl = key;
        // setShowSidebar(true)
      }
    }
    if (!isExternalFn(redirectUrl)) {

      const childList = topRoute.children;
      const isMoreLevel = childList.length > 1 && childList.every((item) => item.redirect);

      console.log(redirectUrl, isMoreLevel, key, currPath, sidebarPath, topRoute, routeMeta, '点击后更新菜单');

      if (isMoreLevel) {
        console.log(keyPath, redirectUrl, routeMeta, topRoute, '无法跳转的哈市');
        const findChild = childList.find((child) => child.redirect.includes(redirectUrl));
        console.log(findChild, '测试举手哈');
        if (findChild) {
          redirectUrl = findChild.redirect
          setCurrPath(findChild.path);
          setSidebarPath(findChild.children[0].path);
        } else {
          setCurrPath(key)
          setSidebarPath(key);
        }
      } else {
        const tempPath = redirectUrl.replace('/' + key, '');
        console.log(tempPath, 'tempPath');
        setCurrPath(tempPath)
        setSidebarPath(key);
      }

      console.log(redirectUrl, 'redirectUrl');

      navigate(redirectUrl);
    } else {
      setActiveIndex(hasOnlyOne.key);
      // setShowSidebar(showSidebar);
    }
  }

  const sidebarSelect: MenuProps['onSelect'] = ({ key, keyPath }) => {
    let url = ''
    if (keyPath.length > 1) {
      keyPath.reverse().forEach((path: string) => {
        url += ('/' + path)
      })
      url = topRoute.path + url;
    } else {
      let splitList = routeMeta.redirect.split('/').filter((path: string) => path);
      splitList = splitList.slice(0, splitList.length - 1);
      if (keyPath.length === 1 && splitList.length === 2) {
        let temp = '';
        if (splitList.includes(key)) {
          splitList.forEach((path: string) => {
            temp += ('/' + path)
          })
          url = temp + '/' + url + key;
        } else {
          if (!routeMeta.parentName) {
            splitList.forEach((path: string) => {
              temp += ('/' + path)
            })
            url = temp + '/' + url + key;
          } else {
            url = '/' + splitList[0] + '/' + key;
          }
        }
      } else {
        url = key
      }
      console.log(routeMeta, key, keyPath, url, splitList, '###2222splitList');
    }
    setSidebarPath(key);
    navigate(url);
  }

  const onTabClick = (key: string) => {
    const currTab = tagsViewStore.tabsMenuList.find((tab) => tab.key === key);
    currTab && navigate(currTab.redirect);
    if (key == '/home') {
      setSidebarPath('/home');
      setActiveIndex('/home');
      setShowSidebar(false);
    } else {
      setSidebarPath(key);
      currTab && setCurrPath(currTab.redirect);
    }
  }

  const HeaderProps: HeaderComponentProps = {
    selectedKeys: activeIndex,
    onSelect: handlerSelect,
    collapsed,
    toggleCollapsed
  }

  const sidebarProps: SidebarComponentProps = {
    collapsed,
    showSidebar,
    onSelect: sidebarSelect,
    selectedKeys: sidebarPath,
    menus: uStore.userInfo.sidebarMenuList as unknown as any,
  }

  const navbarProps: NavbarComponentProps = {
    collapsed,
    showSidebar,
    activeKey: sidebarPath,
    onTabClick,
    moreTabClick,
    toggleCollapsed,
    breadcrumbItems
  }
  const location = useLocation();
  const [pathName, setPathName] = useState(location.pathname);
  useEffect(() => {
    setPathName(location.pathname)
  }, [location])
  const getShowFootip = () => {
    return pathName.includes('home') ? false : sStore.globalSet.showFooterBar;
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
          {
            getShowFootip() && (
              <Footip />
            )
          }
        </Layout>
      </Layout>
    </Layout >
  );
};

export default MibBarLayout;