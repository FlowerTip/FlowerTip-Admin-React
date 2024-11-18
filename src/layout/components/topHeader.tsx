import React from 'react';
import { HeaderComponentProps } from '../types/index'
import { useSnapshot } from 'valtio'
import { Layout, Menu } from 'antd';
import defaultSetting from '@/setting';
import { userStore, settingStore } from '@/store'
import Rightbar from './rightbar';
const { Header } = Layout;

const TopHeader = (props: HeaderComponentProps) => {
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

  // 顶部栏的样式
  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  return (
    <Header className='layout-header' style={headerStyle}>
      <div className="layout-header-logo">{defaultSetting.title}</div>
      {
        sStore.globalSet.layout === 'mixbar' && (<Menu
          theme='dark'
          mode="horizontal"
          selectedKeys={[props.selectedKeys as unknown as any]}
          items={splitMenuList}
          style={{ minWidth: 1000, flex: 1 }}
          onSelect={props.onSelect}
        />)
      }
      {
        sStore.globalSet.layout === 'topbar' && (<Menu
          theme='dark'
          mode="horizontal"
          selectedKeys={[props.selectedKeys as unknown as any]}
          items={uStore.userInfo.authMenuList as unknown as any}
          style={{ minWidth: 1000, flex: 1 }}
          onSelect={props.onSelect}
        />)
      }
      {
        sStore.globalSet.layout !=='simplebar' && (<Rightbar />)
      }
    </Header >
  )
}

export default TopHeader;