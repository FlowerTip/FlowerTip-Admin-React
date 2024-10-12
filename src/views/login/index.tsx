import React, { useRef } from 'react';
import { Button, Form, Input, Carousel, FormInstance } from 'antd';
import { useNavigate } from 'react-router-dom'
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';

import defaultSetting from '../../setting'
import './index.scss';
import { userStore } from '@/store';

const Login: React.FC = () => {
  const formRef = useRef(null); // 创建一个 ref 
  const navigate = useNavigate();
  const login = async () => {
    if (formRef.current) {
      const res = await (formRef.current as FormInstance).validateFields();
      if (res) {
        const loginParam = res;
        const result = await userStore.login(loginParam)
        if (result?.token) {
          navigate('/')
        }
      }
    }
  }
  return (
    <div className='login-wrapper'>
      <div className='login-form'>
        <div className='banner-wrapper'>
          <Carousel autoplay dots={{ className: 'dotsClass' }}>
            <div className="carousel-img first"></div>
            <div className="carousel-img two"></div>
            <div className="carousel-img three"></div>
            <div className="carousel-img last"></div>
          </Carousel>
        </div>
        <Form
          className='form-wrapper'
          name="login"
          ref={formRef}
        >
          <h3 className="login-logo">{defaultSetting.title}</h3>
          <Form.Item
            style={{ width: '100%' }}
            name="username"
            initialValue={'系统管理员'}
            rules={[{ required: true, message: "请输入用户名" },
            { min: 2, max: 6, message: "长度只能输入2到6位" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账户名不能为空" />
          </Form.Item>
          <Form.Item
            style={{ width: '100%' }}
            name="password"
            initialValue={'123456'}
            rules={[{ required: true, message: "请输入密码" },
            { min: 6, max: 8, message: "长度只能输入6到8位" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码不能为空" />
          </Form.Item>
          <Form.Item style={{ width: '100%' }}>
            <Button block type="primary" onClick={login}>
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
  )
};

export default Login;