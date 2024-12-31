import React from 'react';
import { Input, QRCode } from 'antd'
import { useSnapshot } from 'valtio';
import {settingStore} from '@/store'

const QRCodeComponent: React.FC = () => {
  const sStore = useSnapshot(settingStore);
  const [text, setText] = React.useState('https://www.flowertip.site');
  return (
    <div style={{height: '100%', backgroundColor: 'var(--ant-color-bg-container)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <QRCode value={text} color={sStore.globalSet.color} size={250} icon="/favicon.svg" errorLevel="H" />
      <Input
        style={{width: '250px', marginTop: '10px'}}
        placeholder="-"
        maxLength={60}
        value={text}
        onChange={(e) => setText(e.target.value || text)}
      />
    </div>
  );
};

export default QRCodeComponent;