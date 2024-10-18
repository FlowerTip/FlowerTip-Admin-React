import { createRoot } from 'react-dom/client'
import App from '@/App';
import './styles/reset.scss';
import './styles/index.scss';

createRoot(document.getElementById('root')!).render( 
  <App />
)
