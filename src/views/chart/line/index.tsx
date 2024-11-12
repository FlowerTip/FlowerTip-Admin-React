
import React from 'react';
import { Card } from 'antd';
import LineChart from '@/components/chart/line';

const LineChartFC: React.FC = () => {
  const hotTrendOption = {
    unit: "人",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    data: [120, 200, 150, 80, 70, 110, 130, 500],
  };
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <LineChart chartOption={hotTrendOption} />
    </Card>
  )
};

export default LineChartFC;