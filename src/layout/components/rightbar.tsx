// import {
//   Bubble,
//   Sender,
// } from '@ant-design/x';
import UserOutlined from '@ant-design/icons/UserOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import ChromeOutlined from '@ant-design/icons/ChromeOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import AlertOutlined from '@ant-design/icons/AlertOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import OpenAIFilled from '@ant-design/icons/OpenAIFilled';
// import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import Icon from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSnapshot } from 'valtio'
import screenfull from "screenfull";
import type { MenuProps, TabsProps, TourProps } from 'antd';
import { Tour, Select, Switch, Divider, Popover, Badge, Drawer, Tabs, Dropdown, Space, message, Modal, FloatButton } from 'antd';
import { userStore, settingStore } from '@/store'
import { useRefreshTime } from '@/hooks/useRefreshTime';
import { ItemType } from 'antd/es/menu/interface';
import ChatAi from './chat';
import aiPng from '@/assets/images/ai.png'

const Rightbar = () => {
  // 当前时间
  const { currentTime, clearTimer } = useRefreshTime();
  const ymd = () => {
    const splitTime = currentTime.split(" ");
    return Array.isArray(splitTime) && splitTime[0];
  };

  const hms = () => {
    const splitTime = currentTime.split(" ");
    return Array.isArray(splitTime) && splitTime[1];
  };

  useEffect(() => {
    screenfull.on("change", () => {
      if (screenfull.isFullscreen) setIsFullScreen(true);
      else setIsFullScreen(false);
    });
    setTourOpen(true);
    return () => {
      clearTimer();
    };
  }, [])

  interface ThemeColors {
    [key: string]: string[];
  }
  interface ThemeNames {
    [key: string]: string;
  }
  const formatThemeName: ThemeNames = {
    classicThemeColors: "经典主题",
    fashionThemeColors: "时尚主题",
    freshThemeColors: "清新主题",
    coolThemeColors: "热情主题",
  };
  const themeColorName: ThemeColors = {
    classicThemeColors: [
      "#409EFF",
      "#337ecc",
      "#79bbff",
      "#a0cfff",
      "#c6e2ff",
      "#d9ecff",
      "#ecf5ff",
    ], // 经典配色
    fashionThemeColors: [
      "#3170FF",
      "#296DFF",
      "#4F8DFF",
      "#75AAFF",
      "#9CC5FF",
      "#C2DDFF",
      "#E8F3FF",
    ], // 时尚配色
    freshThemeColors: [
      "#67C23A",
      "#529b2e",
      "#95d475",
      "#b3e19d",
      "#d1edc4",
      "#e1f3d8",
      "#f0f9eb",
    ], // 清新配色
    coolThemeColors: [
      "#BF145B",
      "#E5206C",
      "#EA457F",
      "#EF6B95",
      "#F593AF",
      "#FABDCC",
      "#FFE8ED",
    ], // 热情配色
  };

  type MessageItem = {
    id: number;
    message: string;
  }
  // 用户名dropDown的菜单
  const personalItems: ItemType[] = [
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

  // 抽屉组件
  const [open, setOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  // 确认框组件
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  // 用户名dropDown的菜单点击事件
  const personalItemClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case 'logout':
        const logoutConfirm = {
          title: '退出提示',
          content: (
            <>
              <span>确定要退出账号吗？</span>
            </>
          ),
          width: 400
        };
        const confirmed = await modal.confirm(logoutConfirm);
        if (confirmed) {
          settingStore.updateSetting({
            ...settingStore.globalSet,
            modelAlgorithm: 'light'
          });
          await userStore.logout(true);
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
    }
  };
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);

  const isLightTheme = sStore.globalSet.modelAlgorithm == 'light';
  const isMenuDark = sStore.globalSet.modelAlgorithm == 'menu-dark';

  const onClose = () => {
    setOpen(false);
    setSettingOpen(false);
    setAiOpen(false);
  };

  const noticeList: MessageItem[] = [
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
      <Tabs defaultActiveKey="first" items={tabItems} />
    </div>
  );
  const [isFullScreen, setIsFullScreen] = useState(false);
  // 切换全屏
  const toggleFullScreen = () => {
    if (!screenfull.isEnabled) messageApi.warning("当前您的浏览器不支持全屏 ❌");
    screenfull.toggle();
  };

  // 偏好设置的弹窗
  // const openRightSetting = () => {
  //   setSettingOpen(true);
  // }
  const aiBtnRef = useRef(null);
  const steps: TourProps['steps'] = [
    {
      title: '如何使用您的AI专属助手',
      description: '我们可以使用AI助手进行对话',
      cover: (
        <img
          alt="tour.png"
          src={aiPng}
        />
      ),
      target: null,
    },
    {
      title: '使用AI助手',
      description: '点击右侧AI按钮，即可开启AI助手',
      placement: 'right',
      target: () => {
        return aiBtnRef.current;
      },
    },
  ];

  const [tourOpen, setTourOpen] = useState(false);

  const handleTourFinish = () => {
    setAiOpen(true);
  }

  const toggleLayout = (layoutName: string) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      layout: layoutName
    })
    setSettingOpen(false)
  }
  const setCurrentColor = (themeName: string) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      themeName,
      color: themeColorName[themeName][0]
    })
    setSettingOpen(false)
  }
  const isSimplebar = sStore.globalSet.layout === 'simplebar';
  const rightbarStyle = {
    paddingRight: sStore.globalSet.layout === 'simplebar' ? '10px' : '0',
    color: isSimplebar && isMenuDark ? '#555555' : isLightTheme ? '#555555' : '#ffffff',
  }


  const systemTitleChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      showHeaderLogo: isShow
    })
  }

  const modelChange = (model: string) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      modelAlgorithm: model
    })
    navigate('/')
  }

  const topHeaderChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      showHeaderBar: isShow
    })
  }
  const toggleMenuChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      topShowCollapsed: isShow
    })
  }

  const breamnChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      showBreadcrumb: isShow
    })
  }

  const tabviewsChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      showTagsView: isShow
    })
  }

  const footipChange = (isShow: boolean) => {
    sStore.updateSetting({
      ...sStore.globalSet,
      showFooterBar: isShow
    })
  }

  // const messages = [
  //   {
  //     content: 'Hello, Ant Design X!',
  //     role: 'user',
  //   },
  // ];

  return (
    <>
      <div className="right-bar" style={rightbarStyle}>
        {/* 当前时间 */}
        <div className="current-time">
          <span className="ymd">{ymd()}</span>
          <span className="hms">{hms()}</span>
        </div>
        {/* 消息通知 */}
        <Popover placement="bottom" content={content}>
          <Badge size="small" count={5}>
            <BellOutlined style={{ fontSize: '22px', cursor: 'pointer', color: isSimplebar && isMenuDark ? '#555555' : isLightTheme ? '#555555' : '#ffffff' }} />
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
                  p-id="9806"
                  fill={isSimplebar && isMenuDark ? '#555555' : isLightTheme ? '#555555' : '#ffffff'}
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
                p-id="9339"
                fill={isSimplebar && isMenuDark ? '#555555' : isLightTheme ? '#555555' : '#ffffff'}
              ></path>
            </svg>)
          }
        </div>
        {/* 个人信息 */}
        <Dropdown menu={{ items: personalItems, onClick: personalItemClick }}>
          <div style={{ cursor: 'pointer', fontSize: '14px' }}>
            <Space>
              {uStore.userInfo.username}
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </div>
      <Drawer title="个人中心" open={open} onClose={onClose} width={300}>
        <div className="drawer-box">
          <div className="divider-item">
            <div className="wrapper">
              <p className='user-item'>
                <span className='label'>用户昵称：</span>
                <span className='value'>{uStore.userInfo.username}</span>
              </p>
              <p className='user-item'>
                <span className='label'>权限角色：</span>
                <span className='value'>{uStore.userInfo.roleNames}</span>
              </p>
              <p className='user-item'>
                <span className='label'>所在岗位：</span>
                <span className='value'>{uStore.userInfo.workPostName}</span>
              </p>
              <p className='user-item'>
                <span className='label'>所属部门：</span>
                <span className='value'>{uStore.userInfo.departmentName}</span>
              </p>
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
                <div className="nav-layout" onClick={() => toggleLayout('simplebar')}>
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
                <div className="nav-layout" onClick={() => toggleLayout('sidebar')}>
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
                <div className="nav-layout" onClick={() => toggleLayout('topbar')}>
                  {/* 顶部导航 */}
                  <div
                    className={sStore.globalSet.layout === 'topbar' ? 'nav-style-item is-active' : 'nav-style-item'}
                  >
                    <div className="top-box"></div>
                    <div className="bot-box"></div>
                  </div>
                  <div className="layout-title">大屏导航</div>
                </div>
                <div className="nav-layout" onClick={() => toggleLayout('mixbar')}>
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
                  className={sStore.globalSet.themeName == 'classicThemeColors' ? 'active-bg' : ''}
                  onClick={() => setCurrentColor('classicThemeColors')}
                >
                  经典主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['classicThemeColors'].map((color: string) => (
                      <div
                        key={color}
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div>
              </div>
              <div className="color-layout-wrapper">
                <h4
                  className={sStore.globalSet.themeName == 'fashionThemeColors' ? 'active-bg' : ''}
                  onClick={() => setCurrentColor('fashionThemeColors')}
                >
                  时尚主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['fashionThemeColors'].map((color: string) => (
                      <div
                        key={color}
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div>
              </div>
              <div className="color-layout-wrapper">
                <h4
                  className={sStore.globalSet.themeName == 'freshThemeColors' ? 'active-bg' : ''}
                  onClick={() => setCurrentColor('freshThemeColors')}
                >
                  清新主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['freshThemeColors'].map((color: string) => (
                      <div
                        key={color}
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div >
              </div >
              <div className="color-layout-wrapper">
                <h4
                  className={sStore.globalSet.themeName == 'coolThemeColors' ? 'active-bg' : ''}
                  onClick={() => setCurrentColor('coolThemeColors')}
                >
                  热情主题
                </h4>
                <div className="color-layout">
                  {
                    themeColorName['coolThemeColors'].map((color: string) => (
                      <div
                        key={color}
                        className="color-item"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))
                  }
                </div >
              </div >
              <div className="current-layout">
                <div className="color-value">
                  当前风格:&nbsp;<span style={{ color: sStore.globalSet.color }}>{formatThemeName[sStore.globalSet.themeName as string]}</span>
                  &nbsp;主题颜色:&nbsp;
                </div>
                <div
                  className="color-item"
                  style={{ backgroundColor: sStore.globalSet.color }}
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
                <span className="right-txt">导航主题</span>
                <Select
                  defaultValue={sStore.globalSet.modelAlgorithm}
                  size="small"
                  onChange={modelChange}
                  options={[
                    { value: 'menu-dark', label: '反色菜单' },
                    { value: 'light', label: '浅色主题' },
                    { value: 'dark', label: '深色主题' },
                  ]}
                />
              </div>
              <div className="item">
                <span className="right-txt">顶部区域</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked onChange={topHeaderChange} />
              </div>
              <div className="item">
                <span className="right-txt">系统名称</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked onChange={systemTitleChange} />
              </div>
              <div className="item">
                <span className="right-txt">顶部收缩菜单</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" onChange={toggleMenuChange} />
              </div>
              <div className="item">
                <span className="right-txt">面包屑</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked onChange={breamnChange} />
              </div>
              <div className="item">
                <span className="right-txt">标签栏</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked onChange={tabviewsChange} />
              </div>
              <div className="item">
                <span className="right-txt">页脚</span>
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked onChange={footipChange} />
              </div>
            </div>
          </div>
        </div >
      </Drawer >
      <Drawer title="FlowerTip Admin AI 智能对话交互助手" closeIcon={false} onClose={onClose} open={aiOpen} width={600}>
        <div>
          <ChatAi />
        </div>
      </Drawer>
      <FloatButton
        ref={aiBtnRef}
        shape="square"
        type="primary"
        style={{ insetInlineEnd: 0, marginBottom: 350 }}
        icon={<OpenAIFilled />}
        onClick={() => setAiOpen(true)}
      />
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={steps} onFinish={handleTourFinish}/>
      {modalContextHolder}
      {contextHolder}
    </>
  )
}

export default Rightbar;