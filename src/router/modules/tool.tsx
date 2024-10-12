import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSnapshot } from "valtio";
import { userStore } from '@/store';
import LayoutWrapper from "@/layout";
import useRouteMeta from "@/hooks/useRouteMeta";
import { getToken } from '@/utils/auth'
import { getPageTitle } from '@/utils/tool'
import { tagsViewStore } from '@/store'

// 全局路由守卫
const RouterGuard: React.FC = () => {
  const whiteRouteList: string[] = ["/403", "/404", "/500"];
  const { pathname } = useLocation();
  const { userInfo } = useSnapshot(userStore);
  const token = getToken();
  const { routeMeta } = useRouteMeta(userInfo.backMenuList);
  document.title = getPageTitle(routeMeta);

  console.log('当前拦截的路由为：' + pathname, 'token的值为：' + token, '路由元数据为：' + JSON.stringify(routeMeta));
  // 若有用户信息正常展示组件，若没有跳转到登录页
  if (token) {
    if (pathname === '/login') {
      return <Navigate to={'/'} />
    } else {
      if (userInfo.username) {
        !routeMeta.children && routeMeta.redirect && tagsViewStore.addTab({
          key: routeMeta.path,
          label: routeMeta.title,
          closable: true,
          redirect: routeMeta.redirect
        })
        return <LayoutWrapper />;
      } else {
        userStore.getUserInfo()
      }
    }
  } else {
    if (pathname === '/login') {
      return <Navigate to={'/login'} />
    } else {
      if (whiteRouteList.includes(pathname)) {
        <Navigate to={pathname} />
      }
      return <Navigate to={'/login'} />
    }
  }
}

// 一个高阶函数组件,将组件和props都传递给函数组件RouterGuard
const HighFnComponent: React.FC = (props) => {
  return <RouterGuard {...props} />;
}

export default HighFnComponent;