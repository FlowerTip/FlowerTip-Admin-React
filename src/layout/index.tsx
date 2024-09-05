import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import {
  LaptopOutlined, NotificationOutlined, UserOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, DownOutlined, ChromeOutlined, LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Space, message } from 'antd';

import defaultSetting from '../setting';
import {userStore} from '@/store'

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

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

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
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

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'logout':
        sessionStorage.removeItem('token');
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
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
        {contextHolder}
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {userStore.userInfo.username}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Layout className='layout-content'>
        <Sider width={200} style={{ background: colorBgContainer }} className='sidebar' trigger={null} collapsible collapsed={collapsed} collapsedWidth={50}>
          <Menu
            items={items2}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
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

export default App;