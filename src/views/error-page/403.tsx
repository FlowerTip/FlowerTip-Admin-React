import React from 'react';
import { Button, Result } from 'antd';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import { useNavigate } from 'react-router-dom'

const NotPermissionPage: React.FC = () => {
  const navigate = useNavigate();
  const backHome = () => {
    navigate('/')
  }

  return (
    <div style={{ height: '100%', backgroundColor: '#fff' }}>
      <Result
        status="403"
        title="403"
        subTitle="很抱歉, 您没有权限访问这个页面，请联系管理员操作"
        extra={<Button type="primary" icon={<ArrowLeftOutlined />} onClick={backHome}>返回首页</Button>}
      />
    </div>
  );
}

export default NotPermissionPage;