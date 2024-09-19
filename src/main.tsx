import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/App';
import './styles/reset.scss';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render( 
  <ConfigProvider locale={zhCN} theme={{
    components: {
      Layout: {
        headerHeight: 50,
        headerPadding: 16,
      },
      Table: {
        headerBg: '#3170FF',
        headerColor: '#fff',
        headerSplitColor: '#3170FF',
        headerSortActiveBg: '#3170FF',
        headerSortHoverBg: '#3170FF',
      },
    },
    token: {
    }
  }}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
)
