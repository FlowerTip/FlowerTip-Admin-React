import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";
import { settingStore } from '@/store/index';
import { useSnapshot } from 'valtio'

const LineChart = (props: {
  chartOption: {
    icon?: string;
    orient?: string;
    xAxisData?: string[];
    legendData?: string[];
    unit?: string;
    data?: number[];
  };
}) => {
  const uuid = generateUUID() + "PieChart";

  const icon = props.chartOption.icon;
  const orient = props.chartOption.orient;
  const xAxisData = props.chartOption.xAxisData;
  const legendData = props.chartOption.legendData;
  const unit = props.chartOption.unit;
  const data = props.chartOption.data;


  let myChart: echarts.ECharts;

  let sidebarMenuNode: HTMLDivElement;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: "item",
      formatter: "{b}：{c}人",
    },
    legend: {
      left: orient === "vertical" ? 0 : "center",
      icon: icon || "circle",
      orient: orient || "horizontal", // vertical || horizontal
      type: "scroll",
      pageIconColor: "#555", // 翻页图标的字体颜色
      // 分页数字样式设置
      pageTextStyle: {
        color: "#555",
      },
      data: legendData || [],
    },
    xAxis: {
      type: "category",
      data: xAxisData || [],
    },
    yAxis: {
      name: unit ? `单位(${unit})` : "",
      type: "value",
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: data || [],
      },
    ],
  };
  const sStore = useSnapshot(settingStore);
  const theme = sStore.globalSet.modelAlgorithm == 'dark' ? 'dark' : 'default';
  useEffect(() => {
    // 销毁当前图表实例
    if (myChart != null && myChart.dispose) {
      myChart.dispose();
    }
    myChart = echarts.init(document.getElementById(uuid), theme);
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize()
    });
    sidebarMenuNode = document.getElementsByClassName(
      "sidebar"
    )[0] as HTMLDivElement;
    sidebarMenuNode &&
      sidebarMenuNode.addEventListener("transitionend", () => {
        myChart.resize()
      });
    // 监听侧边栏显示隐藏
    let flag = true;
    let targetNode = sidebarMenuNode; //content监听的元素
    // options：监听的属性
    const options = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      attributeFilter: ['style']
    };
    // 回调事件
    function callback(mutationsList: MutationRecord[]) {
      const display = (mutationsList[0].target as HTMLElement).style.display;
      display === 'none' ? myChart.resize() : null
      if (flag) {
        flag = false
      }
    }
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(targetNode, options);
    return () => {
      window.removeEventListener("resize", () => {
        myChart.resize()
      });
      sidebarMenuNode.removeEventListener("transitionend", () => {
        myChart.resize()
      });
    }
  }, [theme])

  return (
    <div id={uuid} style={{ width: '100%', height: '100%' }}></div>
  )
}

export default LineChart;