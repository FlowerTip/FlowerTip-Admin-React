import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import RouterComponent from '@/router/modules/routes';
import { settingStore } from '@/store';
import { useSnapshot } from 'valtio'

const App: React.FC = () => {
  const sStore = useSnapshot(settingStore);
  return (
    <ConfigProvider locale={zhCN} theme={{
      components: {
        Layout: {
          headerHeight: 50,
          headerPadding: 16,
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
          darkItemSelectedBg: sStore.globalSet.color
        }
      },
      token: {
        colorPrimary: sStore.globalSet.color,
      },
      cssVar: true
    }}>
      <HashRouter>
        <RouterComponent />
      </HashRouter>
    </ConfigProvider>
  )
};

export default App;