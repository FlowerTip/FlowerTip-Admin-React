import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";

const PieChart = (props: any) => {
  const uuid = generateUUID() + "PieChart";

  let myChart: echarts.ECharts;
  let sidebarMenuNode: HTMLDivElement;

  const name = props.chartOption.name;
  const text = props.chartOption.text;
  const subtext = props.chartOption.subtext;
  const orient = props.chartOption.orient;
  const icon = props.chartOption.icon;
  const data = props.chartOption.data;

  const option = {
    title: {
      text: text ? text : "100%",
      left: "center",
      top: "42.5%",
      subtext: subtext || "",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}：{c}人",
    },
    legend: {
      top: "5%",
      left: orient === "vertical" ? 0 : "center",
      icon: icon || "circle",
      orient: orient || "horizontal", // vertical || horizontal
      type: "scroll",
      pageIconColor: "#999", // 翻页图标的字体颜色
      // 分页数字样式设置
      pageTextStyle: {
        color: "#555",
      },
    },
    series: [
      {
        name: name || "",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: data || [],
      },
    ],
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



export default PieChart;