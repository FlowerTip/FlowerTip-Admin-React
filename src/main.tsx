import { createRoot } from 'react-dom/client'
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import App from '@/App';
import './styles/reset.scss';
import './styles/index.scss';

const px2rem = px2remTransformer({
  rootValue: 16,
});

createRoot(document.getElementById('root')!).render(
  <StyleProvider transformers={[px2rem]}>
    <App />
  </StyleProvider>
)
