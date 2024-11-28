import { useLocation, matchRoutes } from 'react-router-dom';

const useRouteMeta = (routes: any) => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);

  console.log(location, matchedRoutes, '情啊啥');

  if (matchedRoutes) {

    const firstChild = matchedRoutes[0].route;
    console.log(firstChild, '###firstChild');
    let originRoute: any = {};
    // 当前路由匹配的子菜单只有1个
    if (firstChild && firstChild.children && firstChild.children.length === 1) {
      originRoute = firstChild as any; // 获取最后一个匹配的路由 
    } else {
      originRoute = matchedRoutes[matchedRoutes.length - 1].route as any; // 获取最后一个匹配的路由 
    }
    console.log(originRoute, 'originRoute');
    return {
      routeMeta: {
        ...originRoute.meta,
        redirect: location.pathname || '',
        path: originRoute.path,
        children: originRoute.children
      },
      topRoute: firstChild
    }; // 返回元数据  
  }

  return {
    routeMeta: {},
    topRoute: {}
  };
};


export default useRouteMeta;