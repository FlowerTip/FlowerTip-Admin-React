import { Column } from '@ant-design/plots';
import React from 'react';

const DemoColumn: React.FC = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json',
    },
    xField: '月份',
    yField: '月均降雨量',
    colorField: 'name',
    group: true,
    style: {
      // 矩形四个方向的内边距
      inset: 5,
      // 矩形单个方向的内边距
      // insetLeft:5,
      // insetRight:20,
      // insetBottom:10
      // insetTop:10
    },
  };
  return (
    <div style={{backgroundColor: '#fff', height: '100%'}}>
      <Column {...config} />
    </div>
  );
};


export default DemoColumn;
