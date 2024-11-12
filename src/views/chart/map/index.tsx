
import React from 'react';
import { Card } from 'antd';
import MapChart from '@/components/chart/map';


const MapChartFC: React.FC = () => {
  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <MapChart />
    </Card>
  )
};

export default MapChartFC;