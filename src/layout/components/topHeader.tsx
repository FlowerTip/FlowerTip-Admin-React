import React from 'react';
import { HeaderComponentProps } from '../types/index'
import { useSnapshot } from 'valtio'
import { Layout, Menu, Button } from 'antd';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import defaultSetting from '@/setting';
import { userStore, settingStore } from '@/store'
import Rightbar from './rightbar';
const { Header } = Layout;

const TopHeader = (props: HeaderComponentProps) => {
  const uStore = useSnapshot(userStore);
  const sStore = useSnapshot(settingStore);
  const topMenuList = uStore.userInfo.authMenuList as unknown as any;

  const splitMenuList = topMenuList.map((item: MenuConfig.ReMapMenuItem) => {
    const obj = {
      key: item.key,
      label: item.label,
      icon: item.icon,
      children: null as unknown as MenuConfig.ReMapMenuItem[]
    }
    if (item.children && item.children[0] && item.children[0].redirect) {
      obj.children = item.children.map((child) => {
        return {
          key: child.key,
          label: child.label,
          icon: child.icon,
        }
      })
    }
    return obj;
  })

  // 顶部栏的样式
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: sStore.globalSet.showHeaderBar ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  return (
    <Header className='layout-header' style={headerStyle}>
      <div className="layout-header-logo">
        {sStore.globalSet.showHeaderLogo && defaultSetting.title}
        {sStore.globalSet.topShowCollapsed && (
          <Button type="primary" onClick={props.toggleCollapsed} style={{ marginLeft: '20px' }}>
            {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        )}
      </div>
      {
        sStore.globalSet.layout === 'mixbar' && (<Menu
          theme={sStore.globalSet.modelAlgorithm == 'menu-dark' ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[props.selectedKeys as unknown as any]}
          items={splitMenuList}
          style={{ minWidth: 1000, flex: 1, borderBottom: 0 }}
          onSelect={props.onSelect}
        />)
      }
      {
        sStore.globalSet.layout === 'topbar' && (<Menu
          theme={sStore.globalSet.modelAlgorithm == 'menu-dark' ? 'dark' : 'light'}
          mode="horizontal"
          selectedKeys={[props.selectedKeys as unknown as any]}
          items={uStore.userInfo.authMenuList as unknown as any}
          style={{ minWidth: 1000, flex: 1, borderBottom: 0 }}
          onSelect={props.onSelect}
        />)
      }
      {
        sStore.globalSet.layout !== 'simplebar' && (<Rightbar />)
      }
    </Header >
  )
}

export default TopHeader;