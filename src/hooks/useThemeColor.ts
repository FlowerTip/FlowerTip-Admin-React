import { useState, useEffect } from 'react'
import { settingStore } from "@/store";
import defaultSetting from "@/setting";
import { useSnapshot } from 'valtio';

const useThemeColor = () => {
  const sStore = useSnapshot(settingStore);
  interface ThemeColors {
    [key: string]: string[];
  }
  interface ThemeNames {
    [key: string]: string;
  }
  const formatThemeName: ThemeNames = {
    classicThemeColors: "经典主题",
    fashionThemeColors: "时尚主题",
    freshThemeColors: "清新主题",
    coolThemeColors: "热情主题",
  };

  const themeColorName: ThemeColors = {
    classicThemeColors: [
      "#409EFF",
      "#337ecc",
      "#79bbff",
      "#a0cfff",
      "#c6e2ff",
      "#d9ecff",
      "#ecf5ff",
    ], // 经典配色
    fashionThemeColors: [
      "#3170FF",
      "#296DFF",
      "#4F8DFF",
      "#75AAFF",
      "#9CC5FF",
      "#C2DDFF",
      "#E8F3FF",
    ], // 时尚配色
    freshThemeColors: [
      "#67C23A",
      "#529b2e",
      "#95d475",
      "#b3e19d",
      "#d1edc4",
      "#e1f3d8",
      "#f0f9eb",
    ], // 清新配色
    coolThemeColors: [
      "#BF145B",
      "#E5206C",
      "#EA457F",
      "#EF6B95",
      "#F593AF",
      "#FABDCC",
      "#FFE8ED",
    ], // 热情配色
  };
  const DEFAULT_THEME = defaultSetting.themeName;
  const DEFAULT_PRIMARY = defaultSetting.color;
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const [currentColor, setCurrentColor] = useState(DEFAULT_PRIMARY);
  const currentThemeName = () => {
    return formatThemeName[currentTheme];
  };

  const toggleThemeColor = (
    colorThemeName: keyof ThemeColors | undefined = "classicThemeColors"
  ) => {
    const colors = themeColorName[colorThemeName];
    const primaryColor = colors[0];
    const primaryDarkColor2 = colors[1];
    const primaryLightColor3 = colors[2];
    const primaryLightColor5 = colors[3];
    const primaryLightColor7 = colors[4];
    const primaryLightColor8 = colors[5];
    const primaryLightColor9 = colors[6];

    // 计算主题颜色变化
    document.documentElement.style.setProperty(
      "--el-color-primary",
      primaryColor
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      primaryDarkColor2
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-light-3",
      primaryLightColor3
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-light-5",
      primaryLightColor5
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-light-7",
      primaryLightColor7
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-light-8",
      primaryLightColor8
    );
    document.documentElement.style.setProperty(
      "--el-color-primary-light-9",
      primaryLightColor9
    );
    setCurrentTheme(colorThemeName as string);
    setCurrentColor(primaryColor)

    sStore.updateSetting({
      layout: sStore.globalSet.layout,
      showFooterBar: sStore.globalSet.showFooterBar,
      showHeaderBar: sStore.globalSet.showHeaderBar,
      showHeaderLogo: sStore.globalSet.showHeaderLogo,
      showTagsView: sStore.globalSet.showTagsView,
      showBreadcrumb: sStore.globalSet.showBreadcrumb,
      color: currentColor,
      themeName: currentTheme,
      topShowCollapsed:
        sStore.globalSet.layout === "mixbar"
          ? sStore.globalSet.topShowCollapsed
          : false,
    });
  };
  useEffect(() => {
    setCurrentTheme(sStore.globalSet.themeName || defaultSetting.themeName)
  }, []);
  return {
    toggleThemeColor,
    currentTheme,
    currentColor,
    currentThemeName: currentThemeName(),
    themeColorName,
  };
};

export default useThemeColor;