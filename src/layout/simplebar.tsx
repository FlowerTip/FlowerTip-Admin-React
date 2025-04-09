import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import useTabOperations from '@/hooks/useTabOperations';
import { userStore, tagsViewStore, settingStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { SidebarComponentProps, NavbarComponentProps } from './types/index'
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import Footip from './components/footip';
import './style/index.scss';
const { Content } = Layout;

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const contentStyle = useMemo<React.CSSProperties>(() => (
    {
      marginLeft: collapsed ? '50px' : '200px'
    }
  ), [
    collapsed
  ]);
  const breadcrumbItems = [];
  const navigate = useNavigate();
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
  const tStore = useSnapshot(tagsViewStore);
  const topMenuList = uStore.userInfo.authMenuList as MenuConfig.LocalRouteItem[];

  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList as unknown as RouteType[]);

  const [sidebarPath, setSidebarPath] = useState(routeMeta.path)

  const { moreTabClick } = useTabOperations(routeMeta, setSidebarPath);
  const parentItem = {
    title: topRoute.meta?.title,
    onClick: () => {
      navigate(topRoute.redirect);
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
      } else {
        redirectUrl = key;
      }
    }
    if (!isExternalFn(redirectUrl)) {

      const childList = topRoute.children;
      const isMoreLevel = childList.length > 1 && childList.every((item) => item.redirect);


      if (isMoreLevel) {
        console.log(keyPath, redirectUrl, routeMeta, topRoute, '无法跳转的哈市');
        const findChild = childList.find((child) => child.redirect.includes(redirectUrl));
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
    const currTab = tStore.tabsMenuList.find((tab) => tab.key === key);
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

export default SidebarLayout;