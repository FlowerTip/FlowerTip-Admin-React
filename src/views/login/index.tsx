import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, Carousel } from 'antd';
import {
  UnlockFilled, UserOutlined,
} from '@ant-design/icons';
import defaultSetting from '../../setting'
import './index.scss';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login: React.FC = () => (
  <div className='login-wrapper'>
    <div className='login-form'>
      <div className='banner-wrapper'>
        <Carousel autoplay>
          <div className="carousel-img first"></div>
          <div className="carousel-img two"></div>
          <div className="carousel-img three"></div>
          <div className="carousel-img last"></div>
        </Carousel>
      </div>
      <Form
        className='form-wrapper'
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h3 className="login-logo">{defaultSetting.title}</h3>
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: "请输入用户名" },
          { min: 2, max: 6, message: "长度只能输入2到6位" }]}
          style={{ width: '100%' }}
        >
          <Input prefix={<UserOutlined />} placeholder="账户名不能为空" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "请输入密码" },
          { min: 6, max: 8, message: "长度只能输入6到8位" }]}
          style={{ width: '100%' }}
        >
          <Input.Password prefix={<UnlockFilled />} placeholder="密码不能为空" />
        </Form.Item>

        <Form.Item style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
        <Form.Item className="tip">
          <h4>温馨提示：</h4>
          <p>1.系统管理员登入添加系统用户账号分配角色权限使用</p>
          <p>2.权限操作涉及的页面在系统管理的权限管理模块使用</p>
          <p>3.系统服务器配置不稳定，速度慢，仅限学习技术使用</p>
        </Form.Item>
      </Form>
    </div>
  </div>
);

export default Login;