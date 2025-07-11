import React from 'react';
import { Tiny } from '@ant-design/plots';

interface MiniBarProps {
  data: number[];
  height: number;
}

const MiniBar: React.FC<MiniBarProps> = ({ data, height }) => {
  const chartData = data.map((value, index) => ({
    x: index,
    y: value,
  }));

  const config = {
    data: chartData,
    xField: 'x',
    yField: 'y',
    columnStyle: {
      fill: '#f56c6c',
    },
    xAxis: false,
    yAxis: false,
    padding: [0, 0, 0, 0],
    height,
  };

  return <Tiny.Column {...config} />;
};

export default MiniBar;