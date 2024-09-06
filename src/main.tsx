import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from '@/App';
import './styles/reset.scss';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={{
      components: {
        Layout: {
          headerHeight: 50,
          headerPadding: 16,
        }
      }
    }}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </StrictMode>,
)
