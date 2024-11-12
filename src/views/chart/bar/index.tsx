
import React from 'react';
import { Card } from 'antd';
import BarChart from '@/components/chart/bar';

const DemoColumn: React.FC = () => {
  const cityPersonOption = {
    unit: "人",
    text: "用户人数",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    data: [120, 200, 150, 80, 70, 110, 130, 500],
  };

  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <BarChart chartOption={cityPersonOption} />
    </Card>
  )
};

export default DemoColumn;