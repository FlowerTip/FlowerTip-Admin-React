import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";

const MoreLineChart = (props: any) => {
  const uuid = generateUUID() + "PieChart";

  const icon = props.chartOption.icon;
  const orient = props.chartOption.orient;
  const xAxisData = props.chartOption.xAxisData;
  const legendData = props.chartOption.legendData;
  const unit = props.chartOption.unit;
  const seriesData = props.chartOption.seriesData;
  
  let myChart: echarts.ECharts;

  let sidebarMenuNode: HTMLDivElement;

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} {b}：{c}人",
    },
    legend: {
      top: "5%",
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
    series: seriesData || [],
  };

  useEffect(() => {
    myChart = echarts.init(document.getElementById(uuid));
    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize()
    });
    sidebarMenuNode = document.getElementsByClassName(
      "content-aside"
    )[0] as HTMLDivElement;
    sidebarMenuNode &&
      sidebarMenuNode.addEventListener("transitionend", () => {
        myChart.resize()
      });
  }, [])

  return (
    <div id={uuid} style={{ width: '100%', height: '100%' }}></div>
  )
}

export default MoreLineChart;