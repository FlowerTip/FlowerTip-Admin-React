import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import Icon from '@ant-design/icons';
import screenfull from "screenfull";
import UserOutlined from '@ant-design/icons/UserOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import ChromeOutlined from '@ant-design/icons/ChromeOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import DoubleLeftOutlined from '@ant-design/icons/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons/DoubleRightOutlined';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import CloseSquareOutlined from '@ant-design/icons/CloseSquareOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import AlertOutlined from '@ant-design/icons/AlertOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import type { MenuProps, TabsProps } from 'antd';
import { Switch, Divider, Popover, Badge, Drawer, Tabs, Breadcrumb, Layout, Menu, Button, Dropdown, Space, message, Modal } from 'antd';
import useRouteMeta from '@/hooks/useRouteMeta';
import useThemeColor from '@/hooks/useThemeColor';
import defaultSetting from '../setting';
import { userStore, tagsViewStore, settingStore } from '@/store'
import { isExternalFn } from '@/utils/validate';
import { reorganizeMenu } from '@/utils/tool';
import { useRefreshTime } from '@/hooks/useRefreshTime';
import './index.scss';
const { Header, Content, Sider } = Layout;

const clickItems: any[] = [
  {
    key: 'person',
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
    key: 'refresh',
    label: '刷新页面',
    icon: <RedoOutlined />,
  },
  {
    key: 'max',
    label: '最大化',
    icon: <FullscreenOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'current',
    label: '关闭当前',
    icon: <CloseSquareOutlined />,
  },
  {
    key: 'left',
    label: '关门左侧',
    icon: <DoubleLeftOutlined />,
  },
  {
    key: 'right',
    label: '关闭右侧',
    icon: <DoubleRightOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'other',
    label: '关闭其他',
    icon: <MinusCircleOutlined />,
  },
  {
    key: 'all',
    label: '关闭所有',
    icon: <CloseCircleOutlined />,
  },
]
const LayoutWrapper: React.FC = () => {
  const { currentTheme, currentColor, currentThemeName, themeColorName } = useThemeColor();
  const { currentTime, clearTimer } = useRefreshTime();
  const ymd = () => {
    const splitTime = currentTime.split(" ");
    return Array.isArray(splitTime) && splitTime[0];
  };

  const hms = () => {
    const splitTime = currentTime.split(" ");
    return Array.isArray(splitTime) && splitTime[1];
  };
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
  const [open, setOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
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
        setOpen(true)
        break;
      case 'setting':
        setSettingOpen(true)
        break;
      default:
        messageApi.info(`点击了 ${key}`);
    }
  };
  const tStore = useSnapshot(tagsViewStore)
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
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
    title: (topRoute as any).meta?.title,
    onClick: () => {
      navigate((topRoute as any).redirect);
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    if (!routeMeta.redirect) {
      navigate((uStore.userInfo.backMenuList[0] as any).redirect);
      setCurrPath((uStore.userInfo.backMenuList[0] as any).path);
    }
    screenfull.on("change", () => {
      if (screenfull.isFullscreen) setIsFullScreen(true);
      else setIsFullScreen(false);
    });

    return () => {
      // clearTimer();
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
      setShowSidebar(false);
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
  const onClose = () => {
    setOpen(false);
    setSettingOpen(false);
  };

  const onChange = (key: string) => {
    console.log(key);
  };
  const noticeList: any = [
    {
      id: 1,
      message: '撒基督教啊时间'
    },
    {
      id: 2,
      message: '撒基督教啊时间'
    },
    {
      id: 3,
      message: '撒基督教啊时间'
    },
    {
      id: 4,
      message: '撒基督教啊时间'
    },
    {
      id: 5,
      message: '撒基督教啊时间'
    },
    {
      id: 6,
      message: '撒基督教啊时间'
    }
  ];

  const tabItems: TabsProps['items'] = [
    {
      key: 'first',
      label: '通知消息',
      children: noticeList.map(() => {
        return (
          <div className="message-item">
            <div className="left-icon">
              <Icon className="icon-style" component={CommentOutlined as React.ForwardRefExoticComponent<any>}>
              </Icon>
            </div><div className="right-box">
              <span className="content">一键三连GuiGu-Admin-Template</span>
              <span className="time">2024-06-04 09:38</span>
            </div>
          </div>
        )
      }),
    },
    {
      key: 'second',
      label: '报警消息',
      children: noticeList.map(() => {
        return (
          <div className="message-item">
            <div className="left-icon">
              <Icon className="icon-style" component={AlertOutlined as React.ForwardRefExoticComponent<any>}>
              </Icon>
            </div><div className="right-box">
              <span className="content">一键三连GuiGu-Admin-Template</span>
              <span className="time">2024-06-04 09:38</span>
            </div>
          </div>
        )
      }),
    },
    {
      key: 'third',
      label: '待办消息',
      children: noticeList.map(() => {
        return (
          <div className="message-item">
            <div className="left-icon">
              <Icon className="icon-style" component={MessageOutlined as React.ForwardRefExoticComponent<any>}>
              </Icon>
            </div><div className="right-box">
              <span className="content">一键三连GuiGu-Admin-Template</span>
              <span className="time">2024-06-04 09:38</span>
            </div>
          </div>
        )
      }),
    },
  ];
  const content = (
    <div className="message-box-wrapper">
      <Tabs defaultActiveKey="first" items={tabItems} onChange={onChange} />
    </div>
  );
  const toggleFullScreen = () => {
    if (!screenfull.isEnabled) messageApi.warning("当前您的浏览器不支持全屏 ❌");
    screenfull.toggle();
  };

  const openRightSetting = () => {
    setSettingOpen(true);
  }

  return (
    <>
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
          <div className="right-bar">
            {/* 当前时间 */}
            <div className="current-time">
              <span className="ymd">{ymd()}</span>
              <span className="hms">{hms()}</span>
            </div>
            {/* 消息通知 */}
            <Popover placement="bottom" content={content}>
              <Badge size="small" count={5}>
                <BellOutlined style={{ fontSize: '22px', color: '#fff', cursor: 'pointer' }} />
              </Badge>
            </Popover>
            {/* 全屏功能 */}
            <div className="screen-box">
              {
                isFullScreen && (
                  <svg
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="9805"
                    width="30"
                    height="30"
                    onClick={toggleFullScreen}
                  >
                    <path
                      d="M354.133333 682.666667H256v-42.666667h170.666667v170.666667H384v-98.133334L243.2 853.333333l-29.866667-29.866666L354.133333 682.666667z m358.4 0l140.8 140.8-29.866666 29.866666-140.8-140.8V810.666667h-42.666667v-170.666667h170.666667v42.666667h-98.133334zM354.133333 384L213.333333 243.2l29.866667-29.866667L384 354.133333V256h42.666667v170.666667H256V384h98.133333z m358.4 0H810.666667v42.666667h-170.666667V256h42.666667v98.133333L823.466667 213.333333l29.866666 29.866667L712.533333 384z"
                      fill="#ffffff"
                      p-id="9806"
                    ></path>
                  </svg>
                )
              }
              {
                !isFullScreen && (<svg
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="9338"
                  id="mx_n_1717408008762"
                  width="30"
                  height="30"
                  onClick={toggleFullScreen}
                >
                  <path
                    d="M285.866667 810.666667H384v42.666666H213.333333v-170.666666h42.666667v98.133333l128-128 29.866667 29.866667-128 128z m494.933333 0l-128-128 29.866667-29.866667 128 128V682.666667h42.666666v170.666666h-170.666666v-42.666666h98.133333zM285.866667 256l128 128-29.866667 29.866667-128-128V384H213.333333V213.333333h170.666667v42.666667H285.866667z m494.933333 0H682.666667V213.333333h170.666666v170.666667h-42.666666V285.866667l-128 128-29.866667-29.866667 128-128z"
                    fill="#ffffff"
                    p-id="9339"
                  ></path>
                </svg>)
              }
            </div>
            {/* 个人信息 */}
            <Dropdown menu={{ items: clickItems, onClick }}>
              <div style={{ color: '#fff', cursor: 'pointer' }}>
                <Space>
                  {uStore.userInfo.username}
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
          </div >
        </Header >
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
      </Layout >
      <Drawer title="个人中心" open={open} onClose={onClose} width={300}>
        <div className="drawer-box">
          <div className="divider-item">
            <div className="wrapper">
              <div className="author-layout">
                <h1>高级前端进阶</h1>
                <h2>深夜改BUG，专注于前端开发</h2>
                <h3>
                  一个前端进阶路上的学习者，有输入就要有输出，愿你前端技术学习的热忱永远不会被辜负
                </h3>
              </div>
              <div className="project-layout">
                掘金地址：<Button
                  href="https://juejin.cn/user/2295436009546920/posts"
                  type="link"
                  target="_blank"
                >狗尾巴花的尖</Button>
              </div>
              <div className="project-layout">
                博客地址：<Button
                  href="https://www.flowertip.site/vitepress-blog"
                  target="_blank"
                  type="link"
                >狗尾巴花的知识库</Button>
              </div>
              <div className="project-layout">
                源码地址：<Button
                  href="https://gitee.com/CodeTV/flower-tip-admin-react"
                  type="link"
                >后台管理系统模版</Button>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <Drawer title="偏好设置" open={settingOpen} onClose={onClose} width={300}>
        <div className="drawer-box">
          <div className="divider-item">
            <Divider plain>
              <div className="title">
                <Icon className="icon-style" component={AppstoreOutlined as React.ForwardRefExoticComponent<any>} />
                <span className="title-txt">布局设置</span>
              </div>
            </Divider>
            <div className="wrapper">
              <div className="nav-group">
                <div className="nav-layout">
                  {/* 经典导航 */}
                  <div
                    className={sStore.globalSet.layout === 'simplebar' ? 'nav-style-item is-active' : 'nav-style-item'}
                  >
                    <div className="left-box"></div>
                    <div className="right-box">
                      <div className="bot-box-wrap"></div>
                    </div>
                  </div>
                  <div className="layout-title">经典导航</div>
                </div>
                <div className="nav-layout">
                  {/* 左侧导航 */}
                  <div
                    className={sStore.globalSet.layout === 'sidebar' ? 'nav-style-item is-active' : 'nav-style-item'}
                  >
                    <div className="left-box"></div>
                    <div className="right-box">
                      <div className="top-box-wrap"></div>
                      <div className="bot-box-wrap"></div>
                    </div>
                  </div>
                  <div className="layout-title">简约导航</div>
                </div>
              </div>
              <div className="nav-group">
                <div className="nav-layout">
                  {/* 顶部导航 */}
                  <div
                    className={sStore.globalSet.layout === 'topbar' ? 'nav-style-item is-active' : 'nav-style-item'}
                  >
                    <div className="top-box"></div>
                    <div className="bot-box"></div>
                  </div>
                  <div className="layout-title">大屏导航</div>
                </div>
                <div className="nav-layout">
                  {/* 混合导航 */}
                  <div
                    className={sStore.globalSet.layout === 'mixbar' ? 'nav-style-item style3 is-active' : 'nav-style-item style3'}
                  >
                    <div className="top-box"></div>
                    <div className="bot-box">
                      <div className="right-box-wrap"></div>
                      <div className="left-box-wrap"></div>
                    </div>
                  </div>
                  <div className="layout-title">混合导航</div>
                </div>
              </div>
            </div>
          </div>
          <div className="divider-item">
            <Divider plain>
              <div className="title">
                <Icon className="icon-style" component={ChromeOutlined as React.ForwardRefExoticComponent<any>} />
                <span className="title-txt">搭配设置</span>
              </div>
            </Divider>
            <div className="wrapper">
              <div className="color-layout-wrapper">
                <h4
                  className={currentTheme == 'classicThemeColors' ? 'active-bg' : ''}
                >
                  经典主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['classicThemeColors'].map((color: string) => (
                      <div
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div>
              </div>
              <div className="color-layout-wrapper">
                <h4
                  className={currentTheme == 'fashionThemeColors' ? 'active-bg' : ''}
                >
                  时尚主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['fashionThemeColors'].map((color: string) => (
                      <div
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div>
              </div>
              <div className="color-layout-wrapper">
                <h4
                  className={currentTheme == 'freshThemeColors' ? 'active-bg' : ''}
                >
                  清新主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['freshThemeColors'].map((color: string) => (
                      <div
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div >
              </div >
              <div className="color-layout-wrapper">
                <h4
                  className={currentTheme == 'coolThemeColors' ? 'active-bg' : ''}
                >
                  热情主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['coolThemeColors'].map((color: string) => (
                      <div
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div >
              </div >
              <div className="current-layout">
                <div className="color-value">
                  当前风格:&nbsp;<span style={{ color: currentColor }}>{currentThemeName}</span>
                  &nbsp;主题颜色:&nbsp;
                </div>
                <div
                  className="color-item"
                  style={{ backgroundColor: currentColor }}
                ></div >
              </div >
            </div >
          </div >
          <div className="divider-item">
            <Divider plain>
              <div className="title">
                <Icon className="icon-style" component={SettingOutlined as React.ForwardRefExoticComponent<any>} />
                <span className="title-txt">界面设置</span>
              </div>
            </Divider>
            <div className="wrapper">
              <div className="item">
                <span className="right-txt">顶部区域</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
              <div className="item">
                <span className="right-txt">系统名称</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
              <div className="item">
                <span className="right-txt">顶部收缩菜单</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
              <div className="item">
                <span className="right-txt">面包屑</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
              <div className="item">
                <span className="right-txt">标签栏</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
              <div className="item">
                <span className="right-txt">页脚</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
              </div>
            </div>
          </div>
        </div >
      </Drawer >
      <div
        className="setting-btn"
        onClick={openRightSetting}
      >
        <Icon className="setting-icon" component={SettingOutlined as React.ForwardRefExoticComponent<any>} />
      </div >
    </>
  );
};

export default LayoutWrapper;