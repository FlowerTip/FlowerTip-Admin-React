import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';
import defaultSetting from "@/setting";

export const settingStore = proxy({
  globalSet: {
    showFooterBar: defaultSetting.showFooterBar,
    showHeaderBar: defaultSetting.showHeaderBar,
    showHeaderLogo: defaultSetting.showHeaderLogo,
    showTagsView: defaultSetting.showTagsView,
    showBreadcrumb: defaultSetting.showBreadcrumb,
    layout: defaultSetting.layout,
    color: defaultSetting.color,
    themeName: defaultSetting.themeName,
    topShowCollapsed: defaultSetting.topShowCollapsed,
    showSetting: defaultSetting.showSetting
  } as AppTypeConfig.SettingConfig,
  // 更新全局配置
  updateSetting(settingConfig: AppTypeConfig.SettingConfig) {
    settingStore.globalSet = {
      ...settingConfig
    }
  },
});
devtools(settingStore, { name: 'settingStore', enabled: true })