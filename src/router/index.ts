import { createHashRouter } from 'react-router-dom';

import Layout from '../layout';
import Login from '../views/login';
import Cockpit from '../views/cockpit';

const router = createHashRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/home',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Cockpit
      },
      {
        path: 'cockpit',
        Component: Cockpit,
      }
    ]
  }
])

export default router;