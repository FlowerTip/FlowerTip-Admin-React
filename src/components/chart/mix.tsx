import * as echarts from 'echarts';
import { useEffect } from 'react';
import { generateUUID } from "@/utils/tool";
import { settingStore } from '@/store/index';
import { useSnapshot } from 'valtio'

const MixChart = (props: echarts.EChartsOption) => {
  console.log(props);

  const uuid = generateUUID() + "PieChart";
  let myChart: echarts.ECharts;

  let sidebarMenuNode: HTMLDivElement;

  const option = {
    backgroundColor: 'transparent',
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

export default MixChart;