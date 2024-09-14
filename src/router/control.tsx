import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from '@/utils/auth'
import { userStore } from '@/store';
import LayoutWrapper from "@/layout";
import { useSnapshot } from "valtio";
import useRouteMeta from "@/hooks/useRouteMeta";
import { getPageTitle } from '@/utils/tool'

const Guard: React.FC = () => {
  const whiteRouteList: string[] = ["/403", "/404", "/500"];
  const { pathname } = useLocation();
  const { userInfo } = useSnapshot(userStore);
  const token = getToken();
  const { routeMeta } = useRouteMeta(userInfo.backMenuList);
  document.title = getPageTitle(routeMeta);
  // console.log('当前拦截的路由为：' + pathname, 'token的值为：' + token);

  // 若有用户信息正常展示组件，若没有跳转到登录页
  if (token) {
    if (pathname === '/login') {
      return <Navigate to={'/'} />
    } else {
      if (userInfo.username) {
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
// 一个高阶函数,将组件和props都传递给函数组件Guard
const withGuard: React.FC = () => {
  return <Guard />;
}

export default withGuard;