import React, { useEffect, useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import { HeaderComponentProps, SidebarComponentProps, NavbarComponentProps } from './types/index'
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import useTabOperations from '@/hooks/useTabOperations';
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

  const contentStyle = useMemo<React.CSSProperties>(() => (
    {
      marginLeft: showSidebar && collapsed ? '50px' : showSidebar && !collapsed ? '200px' : !showSidebar ? '0px' : '0px'
    }
  ), [collapsed, showSidebar]);

  const breadcrumbItems = [];
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState('');
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
  const tStore = useSnapshot(tagsViewStore);
  const topMenuList = uStore.userInfo.authMenuList as MenuConfig.LocalRouteItem[];

  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList as unknown as RouteType[]);

  const [currPath, setCurrPath] = useState('/')
  const [sidebarPath, setSidebarPath] = useState(routeMeta.path)
  const { moreTabClick } = useTabOperations(routeMeta, setCurrPath);

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

  const handlerSelect: MenuProps['onSelect'] = ({ key, keyPath }) => {
    // 优化点1：使用更清晰的变量名
    const currentMenu = topMenuList.find((menu: MenuConfig.LocalRouteItem) => menu.key === key);
    let redirectUrl = '';

    // 优化点2：简化URL拼接逻辑
    if (keyPath.length > 1) {
      redirectUrl = keyPath.reverse().join('/');
    } else {
      redirectUrl = currentMenu?.redirect || key;
    }

    if (!isExternalFn(redirectUrl)) {
      const childList = topRoute.children;
      const isMultiLevel = childList.length > 1 && childList.every(item => item.redirect);

      // 优化点3：移除开发日志
      // console.log(redirectUrl, isMultiLevel, key, currPath, sidebarPath, topRoute, routeMeta, '点击后更新菜单');

      // 优化点4：提取路径处理逻辑
      const handleMultiLevel = () => {
        const matchedChild = childList.find(child =>
          child.redirect.startsWith(redirectUrl) // 优化点5：更精确的路径匹配
        );

        if (matchedChild) {
          redirectUrl = matchedChild.redirect;
          setCurrPath(matchedChild.path);
          setSidebarPath(matchedChild.children[0]?.path || key);
        } else {
          setCurrPath(key);
          setSidebarPath(key);
        }
      };

      const handleSingleLevel = () => {
        const basePath = redirectUrl.replace(new RegExp(`/${key}$`), '');
        setCurrPath(basePath);
        setSidebarPath(key);
      };

      isMultiLevel ? handleMultiLevel() : handleSingleLevel();

      // 优化点6：添加导航保护
      if (redirectUrl !== location.pathname) {
        navigate(redirectUrl);
      }
    } else {
      // 优化点7：添加空值保护
      currentMenu && setActiveIndex(currentMenu.key);
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
    const currTab = tStore.tabsMenuList.find((tab) => tab.key === key);
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

  const getShowFootip = () => {
    return pathName.includes('home') ? false : sStore.globalSet.showFooterBar;
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

  useEffect(() => {
    setPathName(location.pathname)
  }, [location])

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