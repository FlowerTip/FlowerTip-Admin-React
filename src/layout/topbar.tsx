import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import screenfull from "screenfull";
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import { userStore, tagsViewStore } from '@/store'
import TopHeader from './components/topHeader';
import Navbar from './components/navbar';
import { HeaderComponentProps, NavbarComponentProps } from './types/index'
import './style/index.scss';
const { Content } = Layout;


const LayoutWrapper: React.FC = () => {


  const breadcrumbItems = [];
  const navigate = useNavigate();
  const uStore = useSnapshot(userStore);
  const tStore = useSnapshot(tagsViewStore)


  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList);

  console.log(routeMeta, topRoute, '你是是多喝会更好湖广会馆哈哈');
  const currentLocation = useLocation();
  console.log(currentLocation, 'laosdjasj');
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

  const sidebarSelect = ({ key, keyPath }: any) => {
    let url = ''
    if (keyPath.length > 1) {
      keyPath.reverse().forEach((path: string, index: number) => {
        if (index === 0) {
          url += path;
        } else {
          url += ('/' + path)
        }
      })
    } else {
      let splitList = routeMeta.redirect.split('/').filter((path: string) => path);
      splitList = splitList.slice(0, splitList.length - 1);
      if (keyPath.length === 2 && splitList.length === 3) {
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
    url.includes('home') ? navigate('/home/cockpit') : navigate(url);
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

  const HeaderProps: HeaderComponentProps = {
    selectedKeys: sidebarPath,
    onSelect: sidebarSelect,
  }

  const navbarProps: NavbarComponentProps = {
    collapsed: false,
    showSidebar: true,
    activeKey: sidebarPath,
    onTabClick,
    moreTabClick,
    toggleCollapsed: () => { },
    breadcrumbItems
  }

  return (
    <Layout className='layout-wrapper'>
      <TopHeader {...HeaderProps} />
      <Layout className='layout-content'>
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

export default LayoutWrapper;