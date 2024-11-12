import React from 'react';
import { Card } from 'antd';
import MoreLineChart from '@/components/chart/moreLine';


const MoreLineChartFC: React.FC = () => {
  const statusDistOption = {
    legendData: ["2021年", "2022年", "2023年", "2024年"],
    icon: "round",
    unit: "人",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    seriesData: [
      {
        name: "2021年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [120, 200, 150, 80, 70, 110, 130, 500],
      },
      {
        name: "2022年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [140, 230, 120, 180, 270, 110, 130, 200],
      },
      {
        name: "2023年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [320, 200, 250, 380, 270, 110, 130, 300],
      },
      {
        name: "2024年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [100, 20, 150, 580, 270, 110, 430, 1000],
      },
    ],
  };
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <MoreLineChart chartOption={statusDistOption} />
    </Card>
  )
};

export default MoreLineChartFC;