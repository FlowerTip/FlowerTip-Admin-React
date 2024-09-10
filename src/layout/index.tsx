import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import {
  UserOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, DownOutlined, ChromeOutlined, LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Space, message } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import defaultSetting from '../setting';
import { userStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { reorganizeMenu } from '@/utils/tool';
const { Header, Content, Sider } = Layout;

const items: MenuProps['items'] = [
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
const LayoutWrapper: React.FC = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
    background: colorBgContainer,
    display: showSidebar ? 'block' : 'none'
  };
  const contentStyle: React.CSSProperties = {
    marginLeft: showSidebar && collapsed ? '50px' : showSidebar && !collapsed ? '200px' : !showSidebar ? '0px' : '0px'
  };
  const breadcrumbItems = [
    {
      title: '驾驶舱',
      href: '/home/cockpit',
    },
    {
      title: '表格组件',
      href: '/category',
    },
    {
      title: '高级表格',
      href: '/category/subcategory',
    },
  ];
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'logout':
        await userStore.logout(true)
        navigate('/login', {
          replace: true
        });
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



  let {routeMeta, topRoute} = useRouteMeta(uStore.userInfo.backMenuList);
  const [currPath, setCurrPath] = useState(routeMeta.path)
  useEffect(() => {
    console.log(routeMeta, 'ashdahshd');

    // navigate(routeMeta.redirect);
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

    console.log(key, keyPath, selectedKeys, '####routeMeta');
    handlerSelect({ key, keyPath, selectedKeys })
    if (routeMeta.children && routeMeta.children.length === 1) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
    const childList = topRoute.children as unknown as any;
    const menuList = reorganizeMenu(childList)
    uStore.updateLeftMenus(menuList as unknown as any)
  }, [currPath])

  const handlerSelect = ({ key, keyPath, selectedKeys }: any) => {
    // console.log(key, keyPath, selectedKeys, 'params1@@@@');
    console.log(topRoute, routeMeta, '点击后更新菜单');
    

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
    setCurrPath(key);
    if (!isExternalFn(redirectUrl)) {
      navigate(redirectUrl);
    }
    // console.log(redirectUrl, routeMeta, key, keyPath, selectedKeys, 'params2@@@@');
  }


  const sidebarSelect = ({ key, keyPath, selectedKeys }: any) => {
    console.log(key, keyPath, selectedKeys, '侧边栏目');
    navigate(key);
  }

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
          theme="dark"
          mode="horizontal"
          selectedKeys={[currPath]}
          items={splitMenuList}
          style={{ minWidth: 0, flex: 1 }}
          onSelect={handlerSelect}
        />
        {contextHolder}
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {uStore.userInfo.username}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Layout className='layout-content' style={contentStyle}>
        <Sider width={200} style={siderStyle} className='sidebar' trigger={null} collapsible collapsed={collapsed} collapsedWidth={50}>
          <Menu
            items={uStore.userInfo.sidebarMenuList as any}
            onSelect={sidebarSelect}
            mode="inline"
          />
        </Sider>
        <Layout className='wrapper'>
          <Breadcrumb className='navbar' separator=">" items={breadcrumbItems}>
          </Breadcrumb>
          <Content
            className='view-layout'
            style={{
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;