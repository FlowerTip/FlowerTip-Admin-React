import React from 'react';
import { useSnapshot } from 'valtio'
import defaultSetting from '@/setting';
import { settingStore } from '@/store'
import { SidebarComponentProps } from '../types/index'
import { Layout, Menu } from 'antd';

const Sidebar = (props: SidebarComponentProps) => {
  const { Sider } = Layout;
  const sStore = useSnapshot(settingStore);
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: sStore.globalSet.layout === 'mixbar' ? 'calc(100vh - 50px)' : '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: sStore.globalSet.layout === 'mixbar' ? 50 : 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    display: props.showSidebar ? 'block' : 'none'
  };

  const headLogoStyle: React.CSSProperties = {
    display: props.collapsed || sStore.globalSet.layout === 'mixbar' || sStore.globalSet.layout === 'sidebar' ? 'none' : 'block', color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', height: '50px', lineHeight: '50px'
  }
  return (
    <Sider width={200} collapsedWidth={50} style={siderStyle} className='sidebar' trigger={null} collapsible collapsed={props.collapsed}>
      <div className="layout-header-logo" style={headLogoStyle}>{defaultSetting.title}</div>
      <Menu
        theme='dark'
        style={{
          height: sStore.globalSet.layout === 'mixbar' ? '100%' : 'calc(100% - 50px)'
        }}
        items={props.menus as any[]}
        onSelect={props.onSelect}
        selectedKeys={[props.selectedKeys]}
        mode="inline"
      />
    </Sider>
  )
}

export default Sidebar;