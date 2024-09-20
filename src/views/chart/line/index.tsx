import React from "react";
import { Line } from '@ant-design/charts';

const LineChartPage: React.FC = () => {
  const data = [
    { year: '1991年', value: 3 },
    { year: '1992年', value: 4 },
    { year: '1993年', value: 3.5 },
    { year: '1994年', value: 5 },
    { year: '1995年', value: 4.9 },
    { year: '1996年', value: 6 },
    { year: '1997年', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999年', value: 13 },
  ];

  const config = {
    data,
    autoFit: true,
    xField: 'year',
    yField: 'value',
  };


  return (
    <div style={{ backgroundColor: '#fff', height: '100%'}}>
      <Line {...config} />
    </div>
  )
}

export default LineChartPage;