import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  RedoOutlined,
  CloseCircleOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  MinusCircleOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';
import { tagsViewStore } from '@/store'
import { Breadcrumb, Tabs, Button, Dropdown, Space, type MenuProps } from 'antd';
import { useSnapshot } from 'valtio'
import { NavbarComponentProps } from '../types/index'
import { settingStore } from '@/store'
import Rightbar from './rightbar';

const NavBar = (props: NavbarComponentProps) => {
  const items: MenuProps['items'] = [
    {
      key: 'refresh',
      label: '刷新页面',
      icon: <RedoOutlined />,
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
  const tStore = useSnapshot(tagsViewStore);
  const sStore = useSnapshot(settingStore);

  const isLightTheme = sStore.globalSet.modelAlgorithm == 'light';
  const isMenuDark = sStore.globalSet.modelAlgorithm == 'menu-dark';

  const toggleBtnStyle = useMemo<React.CSSProperties>(() => (
    {
      display: sStore.globalSet.layout === 'topbar' ? 'none' : 'block',
      marginLeft: '12px',
      cursor: 'pointer',
      fontSize: '16px',
      color: isMenuDark ? '#555555' : isLightTheme ? '#555555' : '#ffffff'
    }
  ), [
    sStore.globalSet.layout,
    isMenuDark,
    isLightTheme
  ])

  const tagsViewStyle = useMemo<React.CSSProperties>(() => (
    {
      borderTop: isMenuDark ? '1px solid #D9D9D9' : isLightTheme ? '1px solid #D9D9D9' : '1px solid #555555',
      padding: '0 12px',
      height: '39px',
      flex: 1
    }
  ), [
    isMenuDark,
    isLightTheme
  ])

  const location = useLocation();
  const [pathName, setPathName] = useState(location.pathname);
  useEffect(() => {
    setPathName(location.pathname)
  }, [location])
  const navbarstyle = {
    display: !pathName.includes('home') ? 'block' : sStore.globalSet.layout === 'topbar' && pathName.includes('home') ? 'none' : props.showSidebar ? 'block' : 'none',
    backgroundColor: isMenuDark ? '#ffffff' : isLightTheme ? '#fff' : '#141414',
  }
  return (
    <div className='navbar' style={navbarstyle}>
      {
        sStore.globalSet.showBreadcrumb && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={toggleBtnStyle} onClick={props.toggleCollapsed}>{props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
              <Breadcrumb separator=">" items={props.breadcrumbItems} style={{
                padding: '5px 12px',
                cursor: 'pointer'
              }}>
              </Breadcrumb>
            </div>
            {
              sStore.globalSet.layout === 'simplebar' && (<Rightbar />)
            }
          </div>
        )
      }
      {
        sStore.globalSet.showTagsView && (
          <Tabs
            tabBarExtraContent={<Dropdown menu={{ items, onClick: props.moreTabClick }}>
              <Space>
                <Button size='small' type="dashed">更多操作<DownOutlined /></Button>
              </Space>
            </Dropdown>}
            size='small'
            activeKey={props.activeKey}
            type="line"
            hideAdd
            style={tagsViewStyle}
            items={(tStore.tabsMenuList || []) as TagViewItem[]}
            onTabClick={props.onTabClick}
          />
        )
      }
    </div>
  )
}

export default NavBar;