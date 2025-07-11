import React, { useMemo } from 'react';
import { DualAxes } from '@ant-design/plots';
import { Spin } from 'antd';

interface TrendChartProps {
  loading: boolean;
  timeRange: 'year' | 'month' | 'week';
}

const TrendChart: React.FC<TrendChartProps> = ({ loading, timeRange }) => {
  // 生成数据
  const { salesData, visitData } = useMemo(() => {
    const dataCount = timeRange === 'year' ? 12 : timeRange === 'month' ? 30 : 7;
    const salesData: { date: string; value: number }[] = [];
    const visitData: { date: string; count: number }[] = [];
    for (let i = 0; i < dataCount; i++) {
      const date =
        timeRange === 'year'
          ? `${i + 1}月`
          : timeRange === 'month'
            ? `6/${i + 11}` // 6/11 ~ 7/10
            : `周${i + 1}`;
      salesData.push({
        date,
        value: Math.floor(Math.random() * 800 + 600), // 600~1400元
      });
      visitData.push({
        date,
        count: Math.floor(Math.random() * 2000 + 1000), // 1000~3000次
      });
    }
    return { salesData, visitData };
  }, [timeRange]);
  const result = salesData.map((item, index) => {
    return {
      time: item.date,
      call: item.value + visitData[index].count,
      '销售额': item.value,
      '访问量': visitData[index].count
    }
  });
  console.log(salesData, visitData, result, 'cehsi ')

  const config = {
    xField: 'time',
    data: result,
    legend: {
      color: {
        itemMarker: (v: string) => {
          if (v === '销售额') return 'rect';
          return 'smooth';
        },
      },
    },
    scale: {},
    children: [
      {
        type: 'interval',
        yField: '销售额',
      },
      {
        type: 'line',
        yField: '访问量',
        shapeField: 'smooth',
        scale: { color: { relations: [['访问量', '#fdae6b']] } },
        axis: { y: { position: 'right' } },
        style: { lineWidth: 2 },
      },
    ],
  };

  return (
    <Spin spinning={loading}>
      <div style={{ height: '350px' }}>
        <DualAxes {...config} />
      </div>
    </Spin>
  );
};

export default TrendChart;