import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import RouterComponent from '@/router/modules/routes';
import { settingStore } from '@/store';
import { useSnapshot } from 'valtio'

const App: React.FC = () => {
  const sStore = useSnapshot(settingStore);
  const isLightTheme = sStore.globalSet.modelAlgorithm == 'light';
  const isMenuDark = sStore.globalSet.modelAlgorithm == 'menu-dark';

  return (
    <ConfigProvider locale={zhCN} theme={{
      components: {
        Layout: {
          headerHeight: 50,
          headerPadding: 16,
          headerColor: isMenuDark ? '#fff' : isLightTheme ? '#555' : '#fff',
          bodyBg: isMenuDark || isLightTheme ? '#f0f0f0' : '#141414',
          headerBg: isMenuDark ? '#282E38' : isLightTheme ? '#fff' : '#141414',
        },
        Table: {
          headerBg: sStore.globalSet.color,
          headerColor: '#fff',
          headerSplitColor: sStore.globalSet.color,
          headerSortActiveBg: sStore.globalSet.color,
          headerSortHoverBg: sStore.globalSet.color,
        },
        Menu: {
          darkItemBg: '#282E38',
          darkPopupBg: '#282E38',
          darkItemSelectedBg: sStore.globalSet.color,
          fontSize: 15,
        },
        Tree: {
          nodeSelectedBg: sStore.globalSet.color,
          nodeHoverBg: sStore.globalSet.color,
          nodeHoverColor: '#fff',
          nodeSelectedColor: '#fff',
        }
      },
      token: {
        colorPrimary: sStore.globalSet.color,
      },
      cssVar: true,
      algorithm: isMenuDark || isLightTheme ? theme.defaultAlgorithm : theme.darkAlgorithm
    }}>
      <HashRouter>
        <RouterComponent />
      </HashRouter>
    </ConfigProvider>
  )
};

export default App;