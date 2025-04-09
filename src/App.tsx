import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enGB from 'antd/locale/en_GB';
import RouterComponent from '@/router/modules/routes';
import { settingStore } from '@/store';
import { useSnapshot } from 'valtio'

const App: React.FC = () => {
  const sStore = useSnapshot(settingStore);
  const { modelAlgorithm, color } = sStore.globalSet;
  const isLightTheme = modelAlgorithm === 'light';
  const isMenuDark = modelAlgorithm === 'menu-dark';
  const isDarkTheme = !(isLightTheme || isMenuDark);

  // 全局主题配置
  const themeConfig = {
    components: {
      Layout: {
        headerHeight: 50,
        headerPadding: 16,
        headerColor: isMenuDark ? '#fff' : isLightTheme ? '#141414' : '#fff',
        bodyBg: isDarkTheme ? '#000000' : '#f0f0f0',
        headerBg: isMenuDark ? '#282E38' : isLightTheme ? '#fff' : '#141414',
      },
      Table: {
        headerBg: color,
        headerColor: '#fff',
        headerSplitColor: color,
        headerSortActiveBg: color,
        headerSortHoverBg: color,
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
      },
      Card: {
        headerHeight: 36,
      }
    },
    token: {
      colorPrimary: color,
    },
    cssVar: true,
    algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
  };
  const lang = localStorage.getItem('lang');
  let locale = zhCN;
  if (!lang) {
    locale = zhCN;
  } else {
    lang === 'en' && (locale = enGB);
    lang === 'zh' && (locale = zhCN);
  }
  return (
    <ConfigProvider locale={locale} theme={themeConfig}>
      <HashRouter>
        <RouterComponent />
      </HashRouter>
    </ConfigProvider>
  )
};

export default App;