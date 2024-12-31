import React from 'react';
import { Watermark } from 'antd';

const App: React.FC = () => (
  <div style={{ height: '100%', backgroundColor: 'var(--ant-color-bg-container)' }}>
    <Watermark content="FlowerTip Admin" style={{
        height: '100%',
      }}>
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: '40px',
        fontSize: '18px',
        paddingTop: '10%',
      }}>
        <h1 style={{fontSize: '28px', fontWeight: 'bold'}}>莫听穿林打叶声</h1>
        <h2 >宋.苏轼</h2>
        <p>莫听穿林打叶声，何妨吟啸且徐行。</p>
        <p>竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。</p>
        <p>料峭春风吹酒醒，微冷，山头斜照正相迎。</p>
        <p>回首向来萧瑟处，归去，也无风雨也无晴。</p>
      </div>
    </Watermark>
  </div>
);

export default App;