import { useLocation, matchRoutes } from 'react-router-dom';  

const useRouteMeta = (routes: any) => {  
    const location = useLocation();  
    const matchedRoutes = matchRoutes(routes, location);  

    if (matchedRoutes) {  
      console.log(matchedRoutes, 'matchedRoutes');
      
        const route = matchedRoutes[matchedRoutes.length - 1].route as any; // 获取最后一个匹配的路由  
        return {
          ...route.meta,
          redirect: route.redirect || ''
        }; // 返回元数据  
    }  

    return null; // 如果没有匹配的路由，返回 null  
}; 


export default useRouteMeta;