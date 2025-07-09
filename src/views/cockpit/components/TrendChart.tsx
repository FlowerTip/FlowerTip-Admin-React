import React, { useMemo } from 'react';
import { Line } from '@ant-design/plots';
import { Spin } from 'antd';

interface TrendChartProps {
  loading: boolean;
  timeRange: 'year' | 'month' | 'week' | undefined;
}

const TrendChart: React.FC<TrendChartProps> = ({ loading, timeRange }) => {
  const chartData = useMemo(() => {
    // 模拟不同时间范围的数据
    const generateData = (count: number) => {
      return Array.from({ length: count }, (_, index) => ({
        date: timeRange === 'year'
          ? `${2024}年${index + 1}月`
          : timeRange === 'month'
          ? `${index + 1}日`
          : `周${index + 1}`,
        value: Math.floor(Math.random() * 1000000 + 500000),
        type: '销售额',
      }));
    };

    const dataCount = timeRange === 'year' ? 12 : timeRange === 'month' ? 30 : 7;
    return generateData(dataCount);
  }, [timeRange]);

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: true,
      },
    },
    yAxis: {
      label: {
        formatter: (value: string) => `¥${Number(value).toLocaleString()}`,
      },
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#409EFF',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `¥${datum.value.toLocaleString()}`,
        };
      },
    },
    legend: false,
  };

  return (
    <Spin spinning={loading}>
      <div style={{ height: '380px' }}>
        <Line {...config} />
      </div>
    </Spin>
  );
};

export default TrendChart;