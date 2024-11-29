import { ReactElement } from "react";
import type { MenuProps } from 'antd';
import { ItemType } from "antd/es/menu/interface";

export interface HeaderComponentProps {
  selectedKeys: string;
  onSelect: (params: { key: String, item: ReactElement, domEvent: Event, selectedKeys: String[] }) => void;
  collapsed?: boolean;
  toggleCollapsed?: () => void;
}

export interface SidebarComponentProps {
  selectedKeys: string;
  onSelect: (params: { key: String, item: ReactElement, domEvent: Event, selectedKeys: String[] }) => void;
  collapsed: boolean;
  showSidebar: boolean;
  menus: ItemType[]
}

export interface NavbarComponentProps {
  collapsed: boolean;
  showSidebar: boolean;
  activeKey: string;
  onTabClick: (activeKey: string, e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => void;
  moreTabClick: MenuProps['onClick'];
  toggleCollapsed: () => void;
  breadcrumbItems: MenuConfig.BreadcrumbItem[]
}