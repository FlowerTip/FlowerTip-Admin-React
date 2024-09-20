import { WordCloud } from '@ant-design/plots';
import React from 'react';

const DemoWordCloud: React.FC = () => {
  const config = {
    paddingTop: 40,
    data: {
      type: 'fetch',
      value: 'https://assets.antv.antgroup.com/g2/philosophy-word.json',
    },
    layout: { spiral: 'rectangular' },
    colorField: 'text',
  };
  return (
    <div style={{backgroundColor: '#fff', height: '100%'}}>
      <WordCloud {...config} />
    </div>
  );
};


export default DemoWordCloud;

