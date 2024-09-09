import { useLocation, matchRoutes } from 'react-router-dom';

const useRouteMeta = (routes: any) => {

  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location);
  if (matchedRoutes) {
    const originRoute = matchedRoutes[0].route as any; // 获取最后一个匹配的路由  
    return {
      ...originRoute.meta,
      redirect: originRoute.redirect || '',
      path: originRoute.path
    }; // 返回元数据  
  }

  return null; // 如果没有匹配的路由，返回 null  
};


export default useRouteMeta;