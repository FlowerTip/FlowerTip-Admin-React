import { useLocation, matchRoutes } from 'react-router-dom';

interface RouteMetaResult {
  routeMeta: MetaType;
  topRoute: RouteType;
}

const getRouteMetaFromMatch = (matchedRoute: RouteType, pathname: string): MetaType => {
  return {
    ...matchedRoute.meta,
    redirect: pathname,
    path: matchedRoute.path,
    children: matchedRoute.children,
    parentName: matchedRoute.meta?.parentName || ''
  };
};

const useRouteMeta = (routes: RouteType[]): RouteMetaResult => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);

  if (!matchedRoutes?.length) {
    return {
      routeMeta: {
        title: '',
        icon: null,
        redirect: '',
        path: '',
        parentName: '',
        children: []
      },
      topRoute: {
        path: '',
        name: '',
        redirect: '',
        meta: { title: '', icon: null },
        Component: null,
        children: []
      }
    };
  }

  const firstChild = matchedRoutes[0].route as RouteType;
  const lastMatch = matchedRoutes[matchedRoutes.length - 1].route as RouteType;
  
  // 优先使用单子菜单路由，否则使用最后匹配的路由
  const targetRoute = (firstChild?.children?.length === 1) ? firstChild : lastMatch;

  return {
    routeMeta: getRouteMetaFromMatch(targetRoute, location.pathname),
    topRoute: firstChild
  };
};

export default useRouteMeta;