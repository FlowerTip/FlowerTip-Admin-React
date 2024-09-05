import Layout from '../layout';
import Login from '../views/login';
import Cockpit from '../views/cockpit';

const routes = [
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/home',
    Component: Layout,
    redirect: '/home/cockpit',
    children: [
      {
        path: 'cockpit',
        Component: Cockpit
      }
    ]
  },
  {
    path: '/',
    Component: Login
  }
]

export default routes;