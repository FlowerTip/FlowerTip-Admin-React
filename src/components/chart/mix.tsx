import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";

const MixChart = (props: any) => {
  console.log(props);
  
  const uuid = generateUUID() + "PieChart";
  let myChart: echarts.ECharts;

  let sidebarMenuNode: HTMLDivElement;

  const option = {
    title: {
      text: "混合图标实例",
      subtext: "图表数据",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["人数", "实力"],
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {
          show: true,
          readOnly: false,
          title: "数据视图",
          lang: ["数据视图", "关闭", "刷新"],
        },
        magicType: {
          show: true,
          type: ["line", "bar"],
          title: {
            line: "切换为折线图",
            bar: "切换为柱状图",
          },
        },
        restore: { show: true, title: "刷新图表" },
        saveAsImage: { show: true, title: "下载图片" },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        // prettier-ignore
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "人数",
        type: "bar",
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
        ],
        markPoint: {
          data: [
            { type: "max", name: "Max" },
            { type: "min", name: "Min" },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
      },
      {
        name: "实力",
        type: "bar",
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
        ],
        markPoint: {
          data: [
            { name: "Max", value: 182.2, xAxis: 7, yAxis: 183 },
            { name: "Min", value: 2.3, xAxis: 11, yAxis: 3 },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "Avg" }],
        },
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

export default MixChart;