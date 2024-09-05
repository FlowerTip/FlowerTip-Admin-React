
import React, { Fragment } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Layout from '../layout';
import Login from '../views/login';
import Cockpit from '../views/cockpit';
import NotFoundPage from '@/views/error-page/404';

const routes = [
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/404',
    Component: NotFoundPage
  },
  {
    path: '/',
    element: <Navigate to={'/home/cockpit'} />
  },
  {
    path: '/home',
    Component: Layout,
    children: [
      {
        path: 'cockpit',
        Component: Cockpit,
      }
    ]
  },

]

//以函数形式，并在内部导出
export const AppRoutes: React.FC = () => {
  return useRoutes(routes)
}

export const RouterModel: React.FC = () => {
  return (
    <Fragment>
      <AppRoutes />
    </Fragment>
  )
}