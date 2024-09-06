import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSnapshot } from 'valtio'
import {
  LaptopOutlined, NotificationOutlined, UserOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, DownOutlined, ChromeOutlined, LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Space, message } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import defaultSetting from '../setting';
import { userStore } from '@/store'
const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = [
  {
    key: '/home',
    label: '驾驶舱',
  },
  {
    key: '/table',
    label: '表格组件',
  },
  {
    key: '/upload',
    label: '上传组件',
  },
  {
    key: '/form',
    label: '表单组件',
  },
  {
    key: '/chart',
    label: '图表组件',
  },
  {
    key: '/tool',
    label: '常用功能',
  },
  {
    key: '/document',
    label: (
      <a href="https://juejin.cn/column/7388686221892976703" target="_blank" rel="noopener noreferrer">
        在线文档
      </a>
    ),
  },
  {
    key: '/project',
    label: (
      <a href="https://gitee.com/CodeTV" target="_blank" rel="noopener noreferrer">
        开源项目
      </a>
    ),
  },
  {
    key: '/setting',
    label: '系统管理',
    children: [
      {
        key: 'permission',
        label: '权限管理'
      },
      {
        key: 'department',
        label: '部门管理'
      }
    ]
  },
];



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

const LayoutWrapper: React.FC = () => {

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
  const { userInfo } = useSnapshot(userStore);

  const [currPath, setCurrPath] = useState('/')
  let routeMeta = useRouteMeta(userInfo.backMenuList);
  useEffect(() => {
    console.log(routeMeta, '@@@routeMeta');
    navigate(routeMeta.redirect);
  }, [currPath])

  const handlerSelect = ({ key, keyPath, selectedKeys }: any) => {
    console.log(key, keyPath, selectedKeys, 'params1@@@@');
    let redirectUrl = '';
    if (keyPath.length > 1) {
      redirectUrl = keyPath[keyPath.length - 1] + '/' + key
    } else {
      redirectUrl = key;
    }
    setCurrPath(redirectUrl);
    navigate(redirectUrl);
    console.log(key, keyPath, selectedKeys, 'params2@@@@');
  }


  const topMenuList = userInfo.authMenuList as unknown as any;

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
          defaultSelectedKeys={[currPath]}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
          onSelect={handlerSelect}
        />
        {contextHolder}
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {userInfo.username}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      <Layout className='layout-content'>
        <Sider width={200} style={{ background: colorBgContainer }} className='sidebar' trigger={null} collapsible collapsed={collapsed} collapsedWidth={50}>
          <Menu
            items={topMenuList}
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

export default LayoutWrapper;