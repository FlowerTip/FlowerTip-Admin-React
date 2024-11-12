import React from 'react';
import { Card } from 'antd';
import PieChart from '@/components/chart/pie';

const DemoPie: React.FC = () => {
  const userDistOption = {
    subtext: "总人数",
    name: "用户分布",
    text: "4000人",
    data: [
      {
        value: 1770,
        name: "北京",
      },
      {
        value: 670,
        name: "上海",
      },
      {
        value: 500,
        name: "广州",
      },
      {
        value: 600,
        name: "深圳",
      },
      {
        value: 400,
        name: "天津",
      },
      {
        value: 500,
        name: "西安",
      },
      {
        value: 300,
        name: "杭州",
      },
      {
        value: 200,
        name: "苏州",
      },
      {
        value: 100,
        name: "郑州",
      },
    ],
  };
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <PieChart chartOption={userDistOption} />
    </Card>
  )
};

export default DemoPie;