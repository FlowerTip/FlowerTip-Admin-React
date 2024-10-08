import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";
import BJGeoJson from "@/mock/geo/beijing";

const MapChart = (props: any) => {
  console.log(props);
  
  const uuid = generateUUID() + "PieChart";
  let myChart: echarts.ECharts;

  let sidebarMenuNode: HTMLDivElement;

  const option = {
    tooltip: {
      trigger: "item",
      // formatter: "{b}<br/>监管单位总数：{c} (家)",
    },
    // visualMap: {
    //   show: false,
    //   min: 0,
    //   max: 1000,
    //   text: [">100", "无"],
    //   textStyle: {
    //     color: "#fff",
    //   },
    //   realtime: false,
    //   calculable: true,
    //   inRange: {
    //     color: ["#c45656", "#f89898", "#fab6b6", "#fcd3d3", "#fde2e2", "#fef0f0"],
    //   },
    // },
    geo: [
      {
        name: "北京市",
        type: "map",
        map: "BeiJing",
        aspectScale: -1.25, //长宽比
        layoutCenter: ["50%", "45%"],
        layoutSize: "60%",
        itemStyle: {
          areaColor: "#3170FF",
          shadowColor: "#000000",
          shadowOffsetY: 12,
          shadowOffsetX: 0,
        },
        emphasis: {
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          borderColor: "#0CDEFF",
          borderWidth: 1,
          areaColor: "#c45656",
          label: {
            color: "#fff",
          },
        },
        label: {
          show: false,
          color: "#fff",
        },
        select: {
          label: {
            color: "#fff",
          },
          itemStyle: {
            color: "#fff",
            // 选中区域红色
            areaColor: "#c45656",
            // 选中区域边框
            borderColor: "#0CDEFF",
            borderWidth: 1,
          },
        },
        data: [],
      },
    ],
    series: [
      {
        name: "北京市",
        type: "map",
        map: "BeiJing",
        aspectScale: -1.25, //长宽比
        layoutCenter: ["50%", "45%"],
        layoutSize: "60%",
        itemStyle: {
          areaColor: "#3170FF",
          shadowColor: "#000000",
        },
        emphasis: {
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          borderColor: "#0CDEFF",
          borderWidth: 1,
          areaColor: "#c45656",
          label: {
            color: "#fff",
          },
        },
        label: {
          show: true,
          color: "#fff",
        },
        select: {
          label: {
            color: "#fff",
          },
          itemStyle: {
            color: "#fff",
            // 选中区域红色
            areaColor: "#c45656",
            // 选中区域边框
            borderColor: "#0CDEFF",
            borderWidth: 1,
          },
        },
        data: [],
      },
    ],
  };

  echarts.registerMap("BeiJing", BJGeoJson as unknown as string);
  
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

export default MapChart;