import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
import { useRefreshTime } from '@/hooks/useRefreshTime';
import './index.scss';
const { Header, Content } = Layout;

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
    key: 'fullScreen',
    label: '最大化',
    icon: <FullscreenOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'closeCurrent',
    label: '关闭当前',
    icon: <CloseSquareOutlined />,
  },
  {
    key: 'closeLeft',
    label: '关门左侧',
    icon: <DoubleLeftOutlined />,
  },
  {
    key: 'closeRight',
    label: '关闭右侧',
    icon: <DoubleRightOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: 'closeOther',
    label: '关闭其他',
    icon: <MinusCircleOutlined />,
  },
  {
    key: 'closeAll',
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

  const breadcrumbItems = [];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
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
      (item: any) => item.key === routeMeta.path
    );
    console.log(current, "ccurrent");
    if (current) {
      const returnNextTab: any = tStore.removeTab(current.key as string, true);
      console.log(returnNextTab, 'returnNextTab');
      if (returnNextTab && returnNextTab.key) {
        navigate(returnNextTab.redirect);
      }
    }
  };

  // 关闭左侧菜单
  const closeLeft = () => {
    const current = tStore.tabsMenuList.find(
      (item: any) => item.key === routeMeta.path
    );
    current && tStore.closeTabsOnSide(current.key as string, "left");
  };

  // 关闭右侧菜单
  const closeRight = () => {
    const current = tStore.tabsMenuList.find(
      (item: any) => item.key === routeMeta.path
    );
    current && tStore.closeTabsOnSide(current.key as string, "right");
  };

  // 关闭其他菜单
  const closeOther = () => {
    const current = tStore.tabsMenuList.find(
      (item: any) => item.key === routeMeta.path
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    if (!routeMeta.redirect) {
      navigate((uStore.userInfo.backMenuList[0] as any).redirect);
      setSidebarPath((uStore.userInfo.backMenuList[0] as any).path);
    }
    screenfull.on("change", () => {
      if (screenfull.isFullscreen) setIsFullScreen(true);
      else setIsFullScreen(false);
    });

    return () => {
      clearTimer();
    }
  }, [])

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
          <Menu
            theme='dark'
            mode="horizontal"
            selectedKeys={[sidebarPath]}
            items={uStore.userInfo.authMenuList as any}
            style={{ minWidth: 0, flex: 1 }}
            onSelect={sidebarSelect}
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
        <Layout className='layout-content'>
          <Layout className='wrapper'>
            <div className='navbar'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Breadcrumb separator=">" items={breadcrumbItems} style={{
                  padding: '5px 12px',
                  cursor: 'pointer'
                }}>
                </Breadcrumb>
              </div>
              <Tabs
                tabBarExtraContent={<Dropdown menu={{ items, onClick: moreTabClick }}>
                  <Space>
                    <Button size='small' type="dashed">更多操作<DownOutlined /></Button>
                  </Space>
                </Dropdown>}
                size='small'
                activeKey={sidebarPath}
                type="editable-card"
                hideAdd
                style={{ borderTop: '1px solid #D9D9D9', padding: '0 12px', height: '39px', flex: 1 }}
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