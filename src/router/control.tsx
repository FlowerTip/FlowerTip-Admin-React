import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from '@/utils/auth'
import { userStore } from '@/store';

const Guard: React.FC = ({ Cmp, ...props }: any) => {
  console.log('Cmp', Cmp, props);
  const { pathname } = useLocation();
  console.log(pathname, 'pathname@@@@');
  
  const token = getToken();
  const username = userStore.userInfo.username
  // useEffect(() => {
  //   // 若没有用户信息，重新拉取
  //   if (!username) {
  //     userStore.getUserInfo();
  //   }
  // }, [username])

  // 若有用户信息正常展示组件，若没有跳转到登录页
  //根据需求处理获取到的当前的路由信息
  // let pathnameArr = pathname.split('/').filter(path => path !== '' && path !== '*')
  // console.log(pathnameArr);
  // let path = pathnameArr[pathnameArr.length - 1]
  // console.log(path);

  //函数用于验证当前路由是否合法，否则返回false,并跳转到404页面
  // function validPath() {
  //   let flag = false
  //   let menuData = []
  //   //此处获取home页面存入本地的缓存数据（菜单数组）
  //   menuData = userStore.userInfo.backMenuList;
  //   console.log(menuData);
  //   let regex = new RegExp(path);
  //   for (var i = 0; i < menuData.length; i++) {
  //     if (regex.test(menuData[i].path)) {
  //       flag = true
  //       break;
  //     } else if (menuData[i].children) {
  //       menuData[i].children.some(v => {
  //         if (regex.test(v.path)) {
  //           flag = true
  //           return true
  //         }
  //       })
  //     }
  //   }
  //   console.log(flag);
  //   return flag
  // }
  // 获取路由与menu 的path 匹配
  if (token) {
    if (username) {
      return (<Cmp {...props} />)
    } else {
      userStore.getUserInfo()
    }
  } else {
    return <Navigate to="/login" />
  }
}

// 一个高阶函数,将组件和props都传递给函数组件Guard
const withGuard = (Cmp: any) => {
  console.log(Cmp, 'Cmp@@@');

  return (props: any) => (<Guard Cmp={Cmp} {...props} />)
}

export default withGuard;