import React from 'react';
import { Line } from '@ant-design/plots';

interface MiniLineProps {
  data: number[];
  height: number;
}

const MiniLine: React.FC<MiniLineProps> = ({ data, height }) => {
  const chartData = data.map((value, index) => ({
    x: index,
    y: value,
  }));

  const config = {
    data: chartData,
    xField: 'x',
    yField: 'y',
    smooth: true,
    lineStyle: {
      stroke: '#e6a23c',
    },
    xAxis: false,
    yAxis: false,
    padding: [0, 0, 0, 0],
    height,
  };

  return <Line {...config} />;
};

export default MiniLine;