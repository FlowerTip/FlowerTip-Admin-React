import React from 'react';
import { Button, Result } from 'antd';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useNavigate } from 'react-router-dom'


const NotNetWorkPage: React.FC = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/')
  }
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--ant-color-bg-container)' }}>
      <Result
        status="500"
        title="500"
        subTitle="很抱歉, 目前网络繁忙，请稍后再试，如有问题请联系管理员操作"
        extra={<Button type="primary" icon={<ArrowLeftOutlined />} onClick={backHome}>返回首页</Button>}
      />
    </div>
  )
};

export default NotNetWorkPage;