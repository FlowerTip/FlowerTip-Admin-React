import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import FullscreenOutlined from '@ant-design/icons/FullscreenOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import DoubleLeftOutlined from '@ant-design/icons/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons/DoubleRightOutlined';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import CloseSquareOutlined from '@ant-design/icons/CloseSquareOutlined';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { tagsViewStore } from '@/store'
import { Breadcrumb, Tabs, Button, Dropdown, Space } from 'antd';
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
  const tStore = useSnapshot(tagsViewStore);
  const sStore = useSnapshot(settingStore);

  const toggleBtnStyle = {
    display: sStore.globalSet.layout === 'topbar' ? 'none' : 'block',
    marginLeft: '12px',
    cursor: 'pointer',
    fontSize: '16px'
  }
  const location = useLocation();
  const [pathName, setPathName] = useState(location.pathname);
  useEffect(() => {
    setPathName(location.pathname)
  }, [location])
  const navbarstyle = {
    display: !pathName.includes('home') ? 'block' : sStore.globalSet.layout === 'topbar' && pathName.includes('home') ? 'none' : props.showSidebar ? 'block' : 'none'
  }
  return (
    <div className='navbar' style={navbarstyle}>
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
      <Tabs
        tabBarExtraContent={<Dropdown menu={{ items, onClick: props.moreTabClick }}>
          <Space>
            <Button size='small' type="dashed">更多操作<DownOutlined /></Button>
          </Space>
        </Dropdown>}
        size='small'
        activeKey={props.activeKey}
        type="editable-card"
        hideAdd
        style={{ borderTop: '1px solid #D9D9D9', padding: '0 12px', height: '39px', flex: 1 }}
        items={tStore.tabsMenuList || []}
        onTabClick={props.onTabClick}
      />
    </div>
  )
}

export default NavBar;