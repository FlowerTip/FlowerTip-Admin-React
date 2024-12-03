import { useLocation, matchRoutes } from 'react-router-dom';

type RouteType = {
  path: string;
  name: string;
  redirect: string;
  meta: {
    title: string;
    icon: JSX.Element
  };
  Component: JSX.Element;
  children: RouteType[];
}

type MetaType = {
  title: string;
  icon: JSX.Element;
  redirect: string;
  path: string;
  parentName: string;
  children: RouteType[];
}

const useRouteMeta = (routes: RouteType[]) => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);

  console.log(location, matchedRoutes, '情啊啥');

  if (matchedRoutes) {

    const firstChild = matchedRoutes[0].route;
    console.log(firstChild, '###firstChild');
    let originRoute = {} as RouteType;
    // 当前路由匹配的子菜单只有1个
    if (firstChild && firstChild.children && firstChild.children.length === 1) {
      originRoute = firstChild; // 获取最后一个匹配的路由 
    } else {
      originRoute = matchedRoutes[matchedRoutes.length - 1].route; // 获取最后一个匹配的路由 
    }
    console.log(originRoute, 'originRoute测试路由');
    return {
      routeMeta: {
        ...originRoute.meta,
        redirect: location.pathname || '',
        path: originRoute.path,
        children: originRoute.children
      } as MetaType,
      topRoute: firstChild
    }; // 返回元数据  
  }

  return {
    routeMeta: {} as MetaType,
    topRoute: {} as RouteType
  };
};


export default useRouteMeta;