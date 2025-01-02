import React, { useState } from 'react';
import { useSnapshot } from 'valtio'
import defaultSetting from '@/setting';
import { settingStore } from '@/store'
import { SidebarComponentProps } from '../types/index'
import { Layout, Menu } from 'antd';

const Sidebar = (props: SidebarComponentProps) => {
  const { Sider } = Layout;
  const sStore = useSnapshot(settingStore);
  const isMenuDark = sStore.globalSet.modelAlgorithm == 'menu-dark';
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: sStore.globalSet.layout === 'mixbar' || sStore.globalSet.layout === 'sidebar' ? 'calc(100vh - 50px)' : '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: sStore.globalSet.layout === 'mixbar' || sStore.globalSet.layout === 'sidebar' ? 50 : 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    display: props.showSidebar ? 'block' : 'none',
  };

  const headLogoStyle: React.CSSProperties = {
    display: props.collapsed || sStore.globalSet.layout === 'mixbar' || sStore.globalSet.layout === 'sidebar' ? 'none' : 'block',
    fontSize: '20px',
    fontWeight: 'bold', 
    textAlign: 'center',
    height: '50px',
    lineHeight: '50px',
    backgroundColor: isMenuDark ? '#282E38' : 'var(--ant-color-bg-container)',
    color: isMenuDark ? '#fff' : 'var(--ant-color-text-base)',
  }
  // 侧边栏只保持一个展开
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  let parentKey: string[] = []
  const findParent = (arr: MenuConfig.ReMapMenuItem[], path: string, parent: string[] = []): string[] => {
    let a = parent
    for (const k in arr) {
      if (parentKey.length == 0) {
        if (arr[k].key === path) {
          // 找到当前点击的key则停止寻找
          parentKey = parent
        } else {
          // parent备份，不为当前点击将a置空，避免影响同级循环使用parent
          a = []
        }
        if (arr[k].children && arr[k].children!.length > 0) {
          if (findParent(arr[k].children!, path, [arr[k].key, ...parent]).length > 0) {
            parent = parent.concat(findParent(arr[k].children!, path, [arr[k].key, ...parent]))
          }
        }
      }
    }
    return a
  }
  const onOpenChange = (keys: string[]) => {
    // 找出keys中新增的值，有新增则当前点击为打开栏目，否则为关闭栏目
    const openKey = keys.find((key) => openKeys.indexOf(key) === -1);
    // const closeKey = openKeys.find((key) => keys.indexOf(key) === -1);
    if (openKey) {
      findParent(props.menus as MenuConfig.ReMapMenuItem[], openKey, []) || []
      setOpenKeys([openKey, ...parentKey])
      parentKey = []
    } else {
      // 关闭栏目为删除，直接赋值即可
      setOpenKeys(keys)
    }
  };

  return (
    <Sider width={200} collapsedWidth={50} style={siderStyle} className='sidebar' trigger={null} collapsible collapsed={props.collapsed}>
      <div className="layout-header-logo" style={headLogoStyle}>{defaultSetting.title}</div>
      <Menu
        theme={sStore.globalSet.modelAlgorithm == 'menu-dark' ? 'dark' : 'light'}
        style={{
          height: sStore.globalSet.layout === 'mixbar' || sStore.globalSet.layout === 'sidebar' ? '100%' : 'calc(100% - 50px)'
        }}
        items={props.menus}
        onSelect={props.onSelect}
        selectedKeys={[props.selectedKeys]}
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      />
    </Sider>
  )
}

export default Sidebar;