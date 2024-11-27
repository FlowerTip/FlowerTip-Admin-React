import React, { useRef, useState } from 'react';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import { Button, Divider, Space, Tour } from 'antd';
import type { TourProps } from 'antd';

const TourComponent: React.FC = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const [open, setOpen] = useState<boolean>(false);

  const steps: TourProps['steps'] = [
    {
      title: '上传图片',
      description: '请选择你的图片',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => ref1.current,
    },
    {
      title: '保存图片',
      description: '保存你的图片到服务器',
      target: () => ref2.current,
    },
    {
      title: '更多操作',
      description: '点击查看更多操作功能',
      target: () => ref3.current,
    },
  ];
  return (
    <div style={{ height: '100%', backgroundColor: '#fff', padding: "20px" }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        开启漫游时导航
      </Button>
      <Divider />
      <Space>
        <Button ref={ref1}> 上传图片</Button>
        <Button ref={ref2} type="primary">
          保存图片
        </Button>
        <Button ref={ref3} icon={<EllipsisOutlined />} />
      </Space>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default TourComponent;