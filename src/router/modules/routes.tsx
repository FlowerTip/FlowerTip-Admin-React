import React, { Fragment } from 'react';
import { Navigate, useRoutes } from 'react-router-dom'
import HighFnComponent from './tool';
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
import WaterMark from '@/views/tool/watermark/index.tsx';
import AiEditor from '@/views/tool/aiEditor/index.tsx';
import Calendar from '@/views/tool/calendar/index.tsx';
import QRCode from '@/views/tool/qrcode/index.tsx';
import TourComponent from '@/views/tool/tour/index.tsx';

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

// 统一使用命名导入方式
import { 
  MacCommandOutlined,
  ConsoleSqlOutlined,
  SortDescendingOutlined,
  UsergroupAddOutlined,
  BorderOuterOutlined,
  ExperimentOutlined,
  MenuOutlined,
  SettingOutlined,
  VerifiedOutlined,
  PaperClipOutlined,
  ToolOutlined,
  HistoryOutlined,
  RadiusUprightOutlined,
  FileWordOutlined,
  ProductOutlined,
  DotChartOutlined,
  StockOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  FundOutlined,
  FormOutlined,
  TableOutlined,
  EditOutlined,
  OrderedListOutlined,
  CompassOutlined,
  InsertRowAboveOutlined,
  InsertRowLeftOutlined,
  FolderAddOutlined,
  UserSwitchOutlined,
  FileImageOutlined,
  FileAddOutlined,
  CloseSquareOutlined,
  TrademarkOutlined,
  OpenAIOutlined,
  ScheduleOutlined,
  QrcodeOutlined,
  SelectOutlined
} from '@ant-design/icons';

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

// 异步路由
export const asyncRoute = [
  {
    path: "/home",
    name: "home",
    Component: HighFnComponent,
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
    Component: HighFnComponent,
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
    Component: HighFnComponent,
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
        Component: ImageUpload,
        meta: {
          title: "图片上传",
          icon: <FileImageOutlined />,
        },
      },
      {
        name: "file-upload",
        path: "file-upload",
        Component: FileUpload,
        meta: {
          title: "文件上传",
          icon: <FileAddOutlined />,
        },
      },
    ],
  },
  {
    path: "/form",
    Component: HighFnComponent,
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
    Component: HighFnComponent,
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
    Component: HighFnComponent,
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
          icon: <RadiusUprightOutlined />,
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
        name: "watermark",
        path: "watermark",
        Component: WaterMark,
        meta: {
          title: "水印功能",
          icon: <TrademarkOutlined />,
        },
      },
      {
        name: "calendar",
        path: "calendar",
        Component: Calendar,
        meta: {
          title: "日历待办",
          icon: <ScheduleOutlined />,
        },
      },
      {
        name: "qrcode",
        path: "qrcode",
        Component: QRCode,
        meta: {
          title: "二维码功能",
          icon: <QrcodeOutlined />,
        },
      },
      {
        name: "tour",
        path: "tour",
        Component: TourComponent,
        meta: {
          title: "漫游式导航",
          icon: <SelectOutlined />,
        },
      },
      {
        name: "aiEditor",
        path: "aiEditor",
        Component: AiEditor,
        meta: {
          title: "富文本编辑器",
          icon: <OpenAIOutlined />,
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
              title: "菜单1",
              icon: <ProductOutlined />,
              parentName: "test",
            },
          },
          {
            name: "detail",
            path: "detail",
            Component: Detail,
            meta: {
              title: "菜单2",
              icon: <ProductOutlined />,
              parentName: "test",
            },
          },
          {
            name: "demo",
            path: "demo",
            Component: RouterViewPage,
            meta: {
              title: "菜单3",
              icon: <ProductOutlined />,
              parentName: "test",
            },
            children: [
              {
                name: "demo1",
                path: "demo1",
                Component: Demo01Page,
                meta: {
                  title: "菜单3-1",
                  icon: <ProductOutlined />,
                  parentName: "test/demo",
                },
              },
              {
                name: "demo2",
                path: "demo2",
                Component: Demo02Page,
                meta: {
                  title: "菜单3-2",
                  icon: <ProductOutlined />,
                  parentName: "test/demo",
                },
              },
            ],
          },
        ],
      },
      {
        name: "error-page",
        path: "error-page",
        Component: RouterViewPage,
        meta: {
          title: "错误页面",
          icon: <CloseSquareOutlined />,
        },
        redirect: "/error-page/403",
        children: [
          {
            name: "403",
            path: "403",
            Component: NotPermissionPage,
            meta: {
              title: "403页面",
              icon: <CloseSquareOutlined />,
              parentName: "error-page",
            },
          },
          {
            name: "404",
            path: "404",
            Component: NotFoundPage,
            meta: {
              title: "404页面",
              icon: <CloseSquareOutlined />,
              parentName: "error-page",
            },
          },
          {
            name: "500",
            path: "500",
            Component: NotNetWorkPage,
            meta: {
              title: "500页面",
              icon: <CloseSquareOutlined />,
              parentName: "error-page",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/document",
    name: "document",
    meta: {
      title: "知识库",
      icon: '',
      hidden: false,
    },
    Component: HighFnComponent,
    redirect: "https://www.flowertip.site",
    children: [
      {
        path: "https://www.flowertip.site/",
        name: "vitepress-blog",
        meta: {
          title: (
            <a href="https://www.flowertip.site" target="_blank" rel="noopener noreferrer">
              <PaperClipOutlined /><span>知识库</span>
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
    Component: HighFnComponent,
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
    Component: HighFnComponent,
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
        meta: { title: "组织架构", icon: <SortDescendingOutlined /> },
        redirect: "/setting/department/software",
        children: [
          {
            name: "software",
            path: "software",
            Component: Maintenance,
            meta: {
              title: "部门管理",
              icon: <ConsoleSqlOutlined />,
            },
          },
          {
            name: "maintenance",
            path: "maintenance",
            Component: Software,
            meta: {
              title: "岗位管理",
              icon: <MacCommandOutlined />,
            },
          },
        ],
      },
    ],
  },
];

// 根路由      一级路由(HighFnComponent/index)
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
    element: <Navigate to={'/home/cockpit'} />
  }
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

// 全局的路由组件
const RouterComponent: React.FC = () => {
  const element = useRoutes([...staticRoute, ...asyncRoute, ...anyRoute] as any);
  return <Fragment>{element}</Fragment>
}

export default RouterComponent;