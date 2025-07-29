import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";
import { settingStore } from '@/store/index';
import { useSnapshot } from 'valtio'
const BarChart = (props: {
  chartOption: {
    xAxisData: string[];
    unit?: string;
    data: number[];
  }
}) => {
  const uuid = generateUUID() + "PieChart";

  const xAxisData = props.chartOption.xAxisData;
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
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
        barWidth: 30,
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
  const sStore = useSnapshot(settingStore);
  const theme = sStore.globalSet.modelAlgorithm == 'dark' ? 'dark' : 'default';
  useEffect(() => {
    console.log(theme, 'cehishhsh');
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
    let targetNode = sidebarMenuNode || null; //content监听的元素
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
    targetNode && mutationObserver.observe(targetNode, options);
    return () => {
      window.removeEventListener("resize", () => {
        myChart.resize()
      });
      sidebarMenuNode && sidebarMenuNode.removeEventListener("transitionend", () => {
        myChart.resize()
      });
    }
  }, [theme])

  return (
    <div id={uuid} style={{ width: '100%', height: '70vh' }}></div>
  )
}

export default BarChart;