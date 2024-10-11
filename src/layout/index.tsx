import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import UserOutlined from '@ant-design/icons/UserOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import ChromeOutlined from '@ant-design/icons/ChromeOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import type { MenuProps } from 'antd';
import { Tabs, Breadcrumb, Layout, Menu, Button, Dropdown, Space, message, Modal } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import defaultSetting from '../setting';
import { userStore, tagsViewStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { reorganizeMenu } from '@/utils/tool';
const { Header, Content, Sider } = Layout;

const clickItems: any[] = [
  {
    key: 'preson',
    label: '个人中心',
    icon: <UserOutlined />,
  },
  {
    key: 'setting',
    label: '偏好设置',
    icon: <ChromeOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: <LogoutOutlined />,
  },
];

const config = {
  title: '退出提示',
  content: (
    <>
      <span>确定要退出账号吗？</span>
    </>
  ),
  width: 400
};

const items: MenuProps['items'] = [
  {
    key: 'current',
    label: '关闭当前',
    icon: <UserOutlined />,
  },
  {
    key: 'other',
    label: '关闭其他',
    icon: <ChromeOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'all',
    label: '关闭所有',
    icon: <ChromeOutlined />,
  },
]
const LayoutWrapper: React.FC = () => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [showSidebar, setShowSidebar] = useState(true)
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: 'calc(100vh - 50px)',
    position: 'fixed',
    insetInlineStart: 0,
    top: 50,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    display: showSidebar ? 'block' : 'none'
  };
  const contentStyle: React.CSSProperties = {
    marginLeft: showSidebar && collapsed ? '50px' : showSidebar && !collapsed ? '200px' : !showSidebar ? '0px' : '0px'
  };
  const breadcrumbItems = [];
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState('');
  const onClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'logout':
        const confirmed = await modal.confirm(config);
        if (confirmed) {
          await userStore.logout(true)
          navigate('/login', {
            replace: true
          });
        }
        break;
      case 'person':
        messageApi.info(`点击了 ${key}`);
        break;
      case 'setting':
        messageApi.info(`点击了 ${key}`);
        break;
      default:
        messageApi.info(`点击了 ${key}`);
    }
  };
  const tStore = useSnapshot(tagsViewStore)
  const uStore = useSnapshot(userStore);
  const topMenuList = uStore.userInfo.authMenuList as unknown as any;

  const splitMenuList = topMenuList.map((item: any) => {
    const obj = {
      key: item.key,
      label: item.label,
      icon: item.icon,
      children: null
    }
    if (item.children && item.children[0].redirect) {
      obj.children = item.children.map((child: any) => {
        return {
          key: child.key,
          label: child.label,
          icon: item.icon,
        }
      })
    }
    return obj;
  })



  let { routeMeta, topRoute } = useRouteMeta(uStore.userInfo.backMenuList);

  console.log(routeMeta, topRoute, '你是是多喝会更好湖广会馆哈哈');

  const [currPath, setCurrPath] = useState('/')
  const [sidebarPath, setSidebarPath] = useState(routeMeta.path)
  const parentItem = {
    title: (topRoute as any).meta.title,
    href: topRoute.path as string
  }
  const childItem = {
    title: routeMeta.title,
    href: routeMeta.redirect as string
  }
  if (parentItem.title === childItem.title) {
    breadcrumbItems.push(parentItem);
  } else {
    breadcrumbItems.push(parentItem, childItem);
  }
  useEffect(() => {
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

    handlerSelect({ key, keyPath, selectedKeys })
    if (routeMeta.children && routeMeta.children.length === 1) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
    const childList = topRoute.children as unknown as any;
    let menuList = [];
    if (childList.length > 1 && childList.every((item: any) => item.redirect)) {
      if (routeMeta.children) {
        menuList = reorganizeMenu(routeMeta.children);
        setActiveIndex(topRoute.path as any);
      } else {
        const findChildren = childList.find((child: any) => child.redirect.includes(routeMeta.redirect.replace('/' + routeMeta.path, '')));
        findChildren && findChildren.children && (menuList = reorganizeMenu(findChildren.children))
        findChildren && setActiveIndex(findChildren.path as any);
      }
    } else {
      menuList = reorganizeMenu(childList);
      setActiveIndex(topRoute.path as any);
    }
    uStore.updateLeftMenus(menuList as unknown as any);
  }, [currPath])

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
      // console.log(topMenuList, hasOnlyOne, 'hasOnlyOne');
      if (hasOnlyOne && hasOnlyOne.redirect) {
        redirectUrl = hasOnlyOne.redirect
        setShowSidebar(false)
      } else {
        redirectUrl = key;
        setShowSidebar(true)
      }
    }
    if (!isExternalFn(redirectUrl)) {

      const childList = topRoute.children as unknown as any;
      const isMoreLevel = childList.length > 1 && childList.every((item: any) => item.redirect);

      console.log(redirectUrl, isMoreLevel, key, currPath, sidebarPath, topRoute, routeMeta, '点击后更新菜单');

      if (isMoreLevel) {
        console.log(keyPath, redirectUrl, routeMeta, topRoute, '无法跳转的哈市');
        const findChild = childList.find((child: any) => child.redirect.includes(redirectUrl));
        console.log(findChild, '测试举手哈');
        if (findChild) {
          redirectUrl = findChild.redirect
          setCurrPath(findChild.path as unknown as any);
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
      console.log('是链接', hasOnlyOne, redirectUrl);
      setActiveIndex(hasOnlyOne.key);
      setShowSidebar(true);
    }
  }


  const sidebarSelect = ({ key, keyPath }: any) => {
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
        if(splitList.includes(key)) {
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
    const currTab = tagsViewStore.tabsMenuList.find((tab: any) => tab.key === key);
    currTab && navigate(currTab.redirect);
    if (key == '/home') {
      setSidebarPath('/home');
      setActiveIndex('/home');
      setShowSidebar(false);
    } else {
      setSidebarPath(key);
      setCurrPath(currTab.redirect);
    }
  }
  interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
  }
  
  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  
  const levelKeys = getLevelKeys(uStore.userInfo.sidebarMenuList as unknown as LevelKeysProps[]);
  const [stateOpenKeys, setStateOpenKeys] = useState(['', '']);
  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    console.log(openKeys, 'openKeys');
    
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  return (
    <Layout className='layout-wrapper'>
      <Header className='layout-header' style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="layout-header-logo">{defaultSetting.title}</div>
        <Button type="primary" onClick={toggleCollapsed} style={{ marginRight: 16 }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          theme='dark'
          mode="horizontal"
          selectedKeys={[activeIndex as unknown as any]}
          items={splitMenuList}
          style={{ minWidth: 0, flex: 1 }}
          onSelect={handlerSelect}
        />
        <Dropdown menu={{ items: clickItems, onClick }}>
          <div style={{ color: '#fff', cursor: 'pointer' }}>
            <Space>
              {uStore.userInfo.username}
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </Header>
      <Layout className='layout-content' style={contentStyle}>
        <Sider width={200} style={siderStyle} className='sidebar' trigger={null} collapsible collapsed={collapsed} collapsedWidth={50}>
          <Menu
            theme='dark'
            style={{
              height: '100%'
            }}
            items={uStore.userInfo.sidebarMenuList as any}
            onSelect={sidebarSelect}
            selectedKeys={[sidebarPath]}
            defaultSelectedKeys={[routeMeta.name]}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            mode="inline"
          />
        </Sider>
        <Layout className='wrapper'>
          <div className='navbar' style={showSidebar ? { display: 'block' } : { display: 'none' }}>
            <Breadcrumb separator=">" items={breadcrumbItems} style={{
              padding: '5px 12px'
            }}>
            </Breadcrumb>
            <Tabs
              tabBarExtraContent={<Dropdown menu={{ items, onClick }}>
                <Space>
                  <Button size='small' type="dashed">更多操作<DownOutlined /></Button>
                </Space>
              </Dropdown>}
              size='small'
              activeKey={sidebarPath}
              type="editable-card"
              hideAdd
              style={{ borderTop: '1px solid #D9D9D9', padding: '0 12px', height: '39px' }}
              items={tStore.tabsMenuList || []}
              onTabClick={onTabClick}
            />
          </div>
          <Content
            className='view-layout'
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      {modalContextHolder}
      {contextHolder}
    </Layout>
  );
};

export default LayoutWrapper;