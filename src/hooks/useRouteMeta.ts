import { useLocation, matchRoutes } from 'react-router-dom';

type OriginRouteType = {
  path: string;
  meta: {
    title: string;
  },
  redirect: string;
  children: OriginRouteType[];
}

type RouteMetaType = {
  title: string;
  redirect: string;
  path: string;
  parentName: string;
  children: OriginRouteType[];
}

const useRouteMeta = (routes: any) => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);

  console.log(location, matchedRoutes, '情啊啥');

  if (matchedRoutes) {

    const firstChild = matchedRoutes[0].route as OriginRouteType;
    console.log(firstChild, '###firstChild');
    let originRoute: OriginRouteType = {
      path: '',
      meta: {
        title: ''
      },
      redirect: '',
      children: []
    };
    // 当前路由匹配的子菜单只有1个
    if (firstChild && firstChild.children && firstChild.children.length === 1) {
      originRoute = firstChild; // 获取最后一个匹配的路由 
    } else {
      originRoute = matchedRoutes[matchedRoutes.length - 1].route as OriginRouteType; // 获取最后一个匹配的路由 
    }
    console.log(originRoute, 'originRoute');
    return {
      routeMeta: {
        ...originRoute.meta,
        redirect: location.pathname || '',
        path: originRoute.path,
        children: originRoute.children
      } as RouteMetaType,
      topRoute: firstChild as OriginRouteType
    }; // 返回元数据  
  }

  return {
    routeMeta: {} as RouteMetaType,
    topRoute: {} as OriginRouteType
  };
};


export default useRouteMeta;