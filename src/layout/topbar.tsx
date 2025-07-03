import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import useTabOperations from '@/hooks/useTabOperations';
import { userStore, tagsViewStore, settingStore } from '@/store'
import TopHeader from './components/topHeader';
import Navbar from './components/navbar';
import Footip from './components/footip';
import { HeaderComponentProps, NavbarComponentProps } from './types/index'
import './style/index.scss';
const { Content } = Layout;


const LayoutWrapper: React.FC = () => {


  const breadcrumbItems = [];
  const navigate = useNavigate();
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
  const tStore = useSnapshot(tagsViewStore);


  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList as unknown as RouteType[]);

  console.log(routeMeta, topRoute, '你是是多喝会更好湖广会馆哈哈');
  const currentLocation = useLocation();
  console.log(currentLocation, 'laosdjasj');


  const [sidebarPath, setSidebarPath] = useState(routeMeta.path);
  const layoutRef = useRef(null);
  const { moreTabClick } = useTabOperations(routeMeta, setSidebarPath, layoutRef);

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

  const sidebarSelect: MenuProps['onSelect'] = ({ key, keyPath }) => {
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
    const currTab = tStore.tabsMenuList.find((tab) => tab.key === key);
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
      <Layout className='layout-content'>
        <Layout className='wrapper'>
          <Navbar {...navbarProps} />
          <Content
            className='view-layout'
            ref={layoutRef}
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

export default LayoutWrapper;