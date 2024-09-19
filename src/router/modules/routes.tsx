
import React, { Fragment } from 'react';
import { Navigate, useRoutes } from 'react-router-dom'
import withGuard from '@/router/control';
import NotFoundPage from '@/views/error-page/404.tsx';
import NotNetWorkPage from '@/views/error-page/500.tsx';
import NotPermissionPage from '@/views/error-page/403.tsx';
import Login from '@/views/login/index.tsx';
import Cockpit from '@/views/cockpit/index';
import AdvancedTable from '@/views/table/advanced-table/index.tsx';
import DialogTable from '@/views/table/dialog-table/index.tsx';
import AvatarUpload from '@/views/upload/avatar-upload/index';
import FileUpload from '@/views/upload/file-upload/index';
import ImageUpload from '@/views/upload/image-upload/index';

import BasicForm from '@/views/form/basic-form/index.tsx';
import StepForm from '@/views/form/step-form/index.tsx';

import PieChartPage from '@/views/chart/pie/index.tsx';
import BarChartPage from '@/views/chart/bar/index.tsx';
import LineChartPage from '@/views/chart/line/index.tsx';
import MapChartPage from '@/views/chart/map/index.tsx';
import MixChartPage from '@/views/chart/mix/index.tsx';
import MoreLineChartPage from '@/views/chart/moreLine/index.tsx';
import MoreBarChartPage from '@/views/chart/moreBar/index.tsx';

import DayjsTool from '@/views/tool/dayjs/index.tsx';
import ThrottleTool from '@/views/tool/throttle/index.tsx';
import PreviewFile from '@/views/tool/preview/index.tsx';

import ListPage from '@/views/tool/test/list/index.tsx';
import Detail from '@/views/tool/test/detail/index.tsx';
import Demo01Page from '@/views/tool/test/demo/demo01/index.tsx';
import Demo02Page from '@/views/tool/test/demo/demo02/index.tsx';


import PerMenu from '@/views/setting/permission/menu/index.tsx';
import PerUser from '@/views/setting/permission/user/index.tsx';
import PerRole from '@/views/setting/permission/role/index.tsx';


import Maintenance from '@/views/setting/department/maintenance/index.tsx';
import Software from '@/views/setting/department/software/index.tsx';

import RouterViewPage from '@/views/tool/test/index.tsx';
import { userStore } from '@/store';

import { MacCommandOutlined, ConsoleSqlOutlined, SortDescendingOutlined, UsergroupAddOutlined, BorderOuterOutlined, ExperimentOutlined, MenuOutlined, SettingOutlined, VerifiedOutlined, PaperClipOutlined, ToolOutlined, HistoryOutlined, FieldTimeOutlined, FileWordOutlined, ProductOutlined, DotChartOutlined, StockOutlined, AreaChartOutlined, RadarChartOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined, FundOutlined, FormOutlined, EditOutlined, OrderedListOutlined, CompassOutlined, InsertRowAboveOutlined, TableOutlined, InsertRowLeftOutlined, FolderAddOutlined, UserSwitchOutlined, FileImageOutlined, FileAddOutlined } from '@ant-design/icons';


/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单与面包屑的标题
 *      hidden：        是否隐藏菜单此路由
 *      icon：          菜单标题左侧的图标
 *      parentName:     父级菜单的路由路径
 * }
 */
// 目前模版项目中的全部的路由
// login登录   一级路由
// 404页面     一级路由
// 任意路由    一级路由重定向404

// 根路由      一级路由(withGuard/index)
export const staticRoute = [
  {
    path: "/login",
    name: "Login",
    Component: Login,
    meta: {
      hidden: true,
      title: "登录",
    },
  },
  {
    path: "/403",
    name: "403",
    Component: NotPermissionPage,
    meta: {
      hidden: true,
      title: "403",
    },
  },
  {
    path: "/404",
    name: "404",
    Component: NotFoundPage,
    meta: {
      hidden: true,
      title: "404",
    },
  },
  {
    path: "/500",
    name: "500",
    Component: NotNetWorkPage,
    meta: {
      hidden: true,
      title: "500",
    },
  },
  {
    path: '/',
    element: <Navigate to={'/home/cockpit'} />,
  },
];

// 异步路由
export const asyncRoute = [
  {
    path: "/home",
    name: "home",
    Component: withGuard,
    redirect: "/home/cockpit",
    meta: {
      title: "驾驶舱",
      icon: <CompassOutlined />,
    },
    children: [
      {
        path: "cockpit",
        name: "cockpit",
        Component: Cockpit,
        meta: {
          title: "驾驶舱",
          icon: <CompassOutlined />,
        },
      },
    ],
  },
  {
    path: "/table",
    Component: withGuard,
    name: "table",
    meta: {
      title: "表格组件",
      icon: <TableOutlined />,
    },
    redirect: "/table/advanced-table",
    children: [
      {
        name: "advanced-table",
        path: "advanced-table",
        Component: AdvancedTable,
        meta: {
          title: "高级表格",
          icon: <InsertRowAboveOutlined />,
        },
      },
      {
        name: "dialog-table",
        path: "dialog-table",
        Component: DialogTable,
        meta: {
          title: "表格筛选",
          icon: <InsertRowLeftOutlined />,
        },
      },
    ],
  },
  {
    path: "/upload",
    Component: withGuard,
    name: "upload",
    meta: {
      title: "上传组件",
      icon: <FolderAddOutlined />,
    },
    redirect: "/upload/avatar-upload",
    children: [
      {
        name: "avatar-upload",
        path: "avatar-upload",
        Component: AvatarUpload,
        meta: {
          title: "头像上传",
          icon: <UserSwitchOutlined />,
        },
      },
      {
        name: "image-upload",
        path: "image-upload",
        Component: FileUpload,
        meta: {
          title: "图片上传",
          icon: <FileImageOutlined />,
        },
      },
      {
        name: "file-upload",
        path: "file-upload",
        Component: ImageUpload,
        meta: {
          title: "文件上传",
          icon: <FileAddOutlined />,
        },
      },
    ],
  },
  {
    path: "/form",
    Component: withGuard,
    name: "form",
    meta: {
      title: "表单组件",
      icon: <FormOutlined />,
    },
    redirect: "/form/basic-form",
    children: [
      {
        name: "basic-form",
        path: "basic-form",
        Component: BasicForm,
        meta: {
          title: "基础表单",
          icon: <EditOutlined />,
        },
      },
      {
        name: "step-form",
        path: "step-form",
        Component: StepForm,
        meta: {
          title: "分步表单",
          icon: <OrderedListOutlined />,
        },
      },
    ],
  },
  {
    path: "/chart",
    Component: withGuard,
    name: "chart",
    meta: {
      title: "图表组件",
      icon: <FundOutlined />,
    },
    redirect: "/chart/pie-chart",
    children: [
      {
        name: "pie-chart",
        path: "pie-chart",
        Component: PieChartPage,
        meta: {
          title: "饼图图表",
          icon: <PieChartOutlined />,
        },
      },
      {
        name: "bar-chart",
        path: "bar-chart",
        Component: BarChartPage,
        meta: {
          title: "柱状图表",
          icon: <BarChartOutlined />,
        },
      },
      {
        name: "line-chart",
        path: "line-chart",
        Component: LineChartPage,
        meta: {
          title: "折线图表",
          icon: <LineChartOutlined />,
        },
      },
      {
        name: "map-chart",
        path: "map-chart",
        Component: MapChartPage,
        meta: {
          title: "地图图表",
          icon: <RadarChartOutlined />,
        },
      },
      {
        name: "mix-chart",
        path: "mix-chart",
        Component: MixChartPage,
        meta: {
          title: "混合图表",
          icon: <AreaChartOutlined />,
        },
      },
      {
        name: "moreLine-chart",
        path: "moreLine-chart",
        Component: MoreLineChartPage,
        meta: {
          title: "多折线图表",
          icon: <StockOutlined />,
        },
      },
      {
        name: "moreBar-chart",
        path: "moreBar-chart",
        Component: MoreBarChartPage,
        meta: {
          title: "多柱状图表",
          icon: <DotChartOutlined />,
        },
      },
    ],
  },
  {
    path: "/tool",
    Component: withGuard,
    name: "tool",
    meta: {
      title: "常用功能",
      icon: <ToolOutlined />,
    },
    redirect: "/tool/dayjs-tool",
    children: [
      {
        name: "dayjs-tool",
        path: "dayjs-tool",
        Component: DayjsTool,
        meta: {
          title: "时间操作",
          icon: <HistoryOutlined />,
        },
      },
      {
        name: "throttle-tool",
        path: "throttle-tool",
        Component: ThrottleTool,
        meta: {
          title: "防抖节流",
          icon: <FieldTimeOutlined />,
        },
      },
      {
        name: "preview-file",
        path: "preview-file",
        Component: PreviewFile,
        meta: {
          title: "文档预览",
          icon: <FileWordOutlined />,
        },
      },
      {
        name: "test",
        path: "test",
        Component: RouterViewPage,
        meta: {
          title: "多级菜单",
          icon: <ProductOutlined />,
        },
        redirect: "/tool/test/list",
        children: [
          {
            name: "list",
            path: "list",
            Component: ListPage,
            meta: {
              title: "列表页面",
              icon: <ProductOutlined />,
              parentName: "test",
            },
          },
          {
            name: "detail",
            path: "detail",
            Component: Detail,
            meta: {
              title: "添加页面",
              icon: <ProductOutlined />,
              parentName: "test",
            },
          },
          {
            name: "demo",
            path: "demo",
            Component: RouterViewPage,
            meta: {
              title: "详情页面",
              icon: <ProductOutlined />,
              parentName: "test",
            },
            children: [
              {
                name: "demo1",
                path: "demo1",
                Component: Demo01Page,
                meta: {
                  title: "人员详情",
                  icon: <ProductOutlined />,
                  parentName: "test/demo",
                },
              },
              {
                name: "demo2",
                path: "demo2",
                Component: Demo02Page,
                meta: {
                  title: "公司详情",
                  icon: <ProductOutlined />,
                  parentName: "test/demo",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/document",
    name: "document",
    meta: {
      title: "在线文档",
      icon: '',
      hidden: false,
    },
    Component: withGuard,
    redirect: "https://juejin.cn/column/7388686221892976703",
    children: [
      {
        path: "https://juejin.cn/column/7388686221892976703",
        name: "vitepress-blog",
        meta: {
          title: (
            <a href="https://juejin.cn/column/7388686221892976703" target="_blank" rel="noopener noreferrer">
              <PaperClipOutlined /><span>在线文档</span>
            </a>
          ), icon: '', hidden: false
        },
      },
    ],
  },
  {
    path: "/project",
    name: "project",
    meta: {
      title: "开源项目",
      icon: '',
      hidden: false,
    },
    Component: withGuard,
    redirect: "https://gitee.com/CodeTV",
    children: [
      {
        path: "https://gitee.com/CodeTV",
        name: "CodeTV",
        meta: {
          title: (
            <a href="https://gitee.com/CodeTV" target="_blank" rel="noopener noreferrer">
              <VerifiedOutlined /> <span>开源项目</span>
            </a>
          ), icon: '', hidden: false
        },
      },
    ],
  },
  {
    name: "setting",
    path: "/setting",
    Component: withGuard,
    redirect: "/setting/permission",
    meta: { title: "系统管理", icon: <SettingOutlined /> },
    children: [
      {
        name: "permission",
        path: "permission",
        Component: RouterViewPage,
        meta: { title: "权限管理", icon: <ExperimentOutlined /> },
        redirect: "/setting/permission/menu",
        children: [
          {
            name: "menu",
            path: "menu",
            Component: PerMenu,
            meta: {
              title: "菜单管理",
              icon: <MenuOutlined />,
            },
          },
          {
            name: "role",
            path: "role",
            Component: PerRole,
            meta: {
              title: "角色管理",
              icon: <BorderOuterOutlined />,
            },
          },
          {
            name: "user",
            path: "user",
            Component: PerUser,
            meta: {
              title: "用户管理",
              icon: <UsergroupAddOutlined />,
            },
          },
        ],
      },
      {
        name: "department",
        path: "department",
        Component: RouterViewPage,
        meta: { title: "部门管理", icon: <SortDescendingOutlined /> },
        redirect: "/setting/department/software",
        children: [
          {
            name: "software",
            path: "software",
            Component: Maintenance,
            meta: {
              title: "软件人员",
              icon: <ConsoleSqlOutlined />,
            },
          },
          {
            name: "maintenance",
            path: "maintenance",
            Component: Software,
            meta: {
              title: "运维人员",
              icon: <MacCommandOutlined />,
            },
          },
        ],
      },
    ],
  },
];

// 任意路由
export const anyRoute = [{
  path: "*",
  name: "Any",
  Component: NotFoundPage,
  meta: {
    hidden: true,
    title: "404页面",
  },
}];


//以函数形式，并在内部导出
const AppRoutes: React.FC = () => {
  const element = useRoutes([...staticRoute, ...asyncRoute, ...anyRoute] as any);
  return <Fragment>{element}</Fragment>
}

export default AppRoutes;