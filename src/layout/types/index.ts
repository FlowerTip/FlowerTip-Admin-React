export interface HeaderComponentProps {
  selectedKeys: string;
  onSelect: (params: any) => void;
}

export interface SidebarComponentProps {
  selectedKeys: string;
  onSelect: (params: any) => void;
  collapsed: boolean;
  showSidebar: boolean;
  menus: any[]
}

export interface NavbarComponentProps {
  collapsed: boolean;
  showSidebar: boolean;
  activeKey: string;
  onTabClick: (params: any) => void;
  moreTabClick: (params: any) => void;
  toggleCollapsed: (params: any) => void;
  breadcrumbItems: any[]
}