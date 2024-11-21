import React from 'react';
import { Watermark } from 'antd';

const App: React.FC = () => (
  <div style={{ height: '100%', backgroundColor: '#fff' }}>
    <Watermark content="FlowerTip Admin" style={{
        height: '100%',
      }}>
      <div style={{
        height: '100%'
      }}></div>
    </Watermark>
  </div>
);

export default App;