import React from 'react';
import { Button, Result } from 'antd';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useNavigate } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/')
  }
  return (
    <div style={{ height: '100%', backgroundColor: '#fff' }}>
      <Result
        status="404"
        title="404"
        subTitle="很抱歉, 您访问的这个页面没有找到，请联系管理员操作"
        extra={<Button type="primary" icon={<ArrowLeftOutlined />} onClick={backHome}>返回首页</Button>}
      />
    </div>
  )
};

export default NotFoundPage;