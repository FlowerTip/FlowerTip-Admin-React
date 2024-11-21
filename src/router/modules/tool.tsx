import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSnapshot } from "valtio";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Mixbar from "@/layout/mixbar";
import Simplebar from "@/layout/simplebar";
import Sidebar from "@/layout/sidebar";
import Topbar from "@/layout/topbar";
import useRouteMeta from "@/hooks/useRouteMeta";
import { getToken } from '@/utils/auth'
import { getPageTitle } from '@/utils/tool'
import { userStore, tagsViewStore, settingStore } from '@/store'

// 进度条配置对象
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});
// 全局路由守卫
const RouterGuard: React.FC = () => {
  const whiteRouteList: string[] = ["/403", "/404", "/500"];
  const { pathname } = useLocation();
  const { userInfo } = useSnapshot(userStore);
  const token = getToken();
  const { routeMeta } = useRouteMeta(userInfo.backMenuList);
  NProgress.start();
  document.title = getPageTitle(routeMeta);
  const sStore = useSnapshot(settingStore);

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
        NProgress.done(); // 结束进度条
        if (sStore.globalSet.layout === 'simplebar') {
          return <Simplebar />;
        } else if (sStore.globalSet.layout === 'sidebar') {
          return <Sidebar />;
        } else if (sStore.globalSet.layout === 'topbar') {
          return <Topbar />;
        } else {
          return <Mixbar />;
        }
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