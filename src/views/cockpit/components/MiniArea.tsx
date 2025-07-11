import React from 'react';
import { Tiny } from '@ant-design/plots';

interface MiniAreaProps {
  data: number[];
  height: number;
}

const MiniArea: React.FC<MiniAreaProps> = ({ data, height }) => {
  const chartData = data.map((value, index) => ({
    x: index,
    y: value,
  }));

  const config = {
    data: chartData,
    xField: 'x',
    yField: 'y',
    smooth: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#67c23a 1:#67c23a',
    },
    line: {
      color: '#67c23a',
    },
    xAxis: false,
    yAxis: false,
    padding: [0, 0, 0, 0],
    height,
  };

  return <Tiny.Area {...config} />
};

export default MiniArea;