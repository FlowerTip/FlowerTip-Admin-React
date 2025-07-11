import React, { useState, useEffect } from 'react';
import { Row, Col, Tag, Button, Radio, Table, Timeline, Rate, Avatar, Image, Progress, Card } from 'antd';
import CountUp from 'react-countup';
import 'animate.css';
import './index.scss';
import MiniArea from './components/MiniArea';
import MiniLine from './components/MiniLine';
import MiniBar from './components/MiniBar';
import TrendChart from './components/TrendChart';

interface TagsItem {
  name: string;
  type: 'success' | 'warning' | 'error';
  count: number;
}

const Cockpit: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'year' | 'month' | 'week'>('month');
  const [salesRankType, setSalesRankType] = useState('daily');
  
  // 图表数据
  const userData = [30, 40, 20, 50, 40, 80, 90];
  const activeData = [40, 80, 50, 90, 60, 70, 50];
  const orderData = [60, 70, 80, 40, 50, 90, 70];

  // 销售排行榜数据
  const dailyRankList = [
    { name: '智能手表 Pro Max', amount: 289999, percentage: 95, color: '#f56c6c' },
    { name: '无线降噪耳机', amount: 199999, percentage: 85, color: '#e6a23c' },
    { name: '智能手环 5', amount: 159999, percentage: 75, color: '#409eff' },
    { name: '智能音箱 2代', amount: 129999, percentage: 65, color: '#67c23a' },
    { name: '智能摄像头 Pro', amount: 99999, percentage: 55, color: '#909399' },
    { name: '智能体脂秤', amount: 89999, percentage: 45, color: '#909399' },
    { name: '智能门锁', amount: 79999, percentage: 35, color: '#909399' },
    { name: '智能台灯', amount: 69999, percentage: 25, color: '#909399' },
  ];

  const weeklyRankList = [
    { name: '无线降噪耳机', amount: 1299999, percentage: 98, color: '#f56c6c' },
    { name: '智能手表 Pro Max', amount: 999999, percentage: 88, color: '#e6a23c' },
    { name: '智能音箱 2代', amount: 859999, percentage: 78, color: '#409eff' },
    { name: '智能手环 5', amount: 759999, percentage: 68, color: '#67c23a' },
    { name: '智能摄像头 Pro', amount: 659999, percentage: 58, color: '#909399' },
    { name: '智能门锁', amount: 559999, percentage: 48, color: '#909399' },
    { name: '智能体脂秤', amount: 459999, percentage: 38, color: '#909399' },
    { name: '智能台灯', amount: 359999, percentage: 28, color: '#909399' },
  ];

  const monthlyRankList = [
    { name: '智能音箱 2代', amount: 5299999, percentage: 96, color: '#f56c6c' },
    { name: '智能手表 Pro Max', amount: 4599999, percentage: 86, color: '#e6a23c' },
    { name: '无线降噪耳机', amount: 3899999, percentage: 76, color: '#409eff' },
    { name: '智能摄像头 Pro', amount: 3299999, percentage: 66, color: '#67c23a' },
    { name: '智能手环 5', amount: 2699999, percentage: 56, color: '#909399' },
    { name: '智能门锁', amount: 2099999, percentage: 46, color: '#909399' },
    { name: '智能体脂秤', amount: 1599999, percentage: 36, color: '#909399' },
    { name: '智能台灯', amount: 999999, percentage: 26, color: '#909399' },
  ];

  const [salesRankList, setSalesRankList] = useState(dailyRankList);

  // 用户反馈数据
  const feedbackTags: TagsItem[] = [
    { name: '好评', count: 1234, type: 'success' },
    { name: '一般', count: 234, type: 'warning' },
    { name: '差评', count: 34, type: 'error' },
  ];

  const userFeedbacks = [
    {
      username: '张小明',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      rating: 5,
      time: '2024-01-15 14:30',
      content: '智能手表非常好用，续航能力强，运动功能齐全，非常满意！',
      images: [
        'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
      ],
    },
    {
      username: '李小红',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      rating: 4,
      time: '2024-01-15 13:25',
      content: '音质不错，降噪效果很好，就是价格稍微有点小贵。',
    },
    // ... 其他用户反馈数据
  ];

  // 热门产品数据
  const hotProducts = [
    { rank: 1, name: '智能手表 Pro', sales: 1234, growth: 12.3 },
    { rank: 2, name: '无线耳机 MAX', sales: 1156, growth: 8.7 },
    { rank: 3, name: '智能音箱 Mini', sales: 986, growth: -5.2 },
    { rank: 4, name: '运动手环 4', sales: 876, growth: 15.8 },
    { rank: 5, name: '智能摄像头', sales: 765, growth: 7.4 },
    { rank: 6, name: '智能门锁', sales: 654, growth: 22.1 },
    { rank: 7, name: '智能台灯', sales: 543, growth: 18.9 },
    { rank: 8, name: '智能体脂秤', sales: 432, growth: -3.5 },
    { rank: 9, name: '智能窗帘', sales: 321, growth: 25.6 },
    { rank: 10, name: '智能插座', sales: 210, growth: 11.2 },
  ];

  // 实时动态数据
  const activities = [
    {
      content: '张三购买了智能手表 Pro',
      time: '刚刚',
      type: 'success',
      color: '#67C23A',
      hollow: true,
    },
    { content: '系统更新完成', time: '5分钟前', type: 'info', color: '#909399' },
    {
      content: '李四完成了实名认证',
      time: '10分钟前',
      type: 'primary',
      color: '#409EFF',
    },
    {
      content: '新增订单 10086',
      time: '20分钟前',
      type: 'warning',
      color: '#E6A23C',
    },
    {
      content: '系统预警：CPU使用率过高',
      time: '1小时前',
      type: 'error',
      color: '#F56C6C',
    },
  ];

  // 处理排行榜类型变化
  useEffect(() => {
    switch (salesRankType) {
      case 'daily':
        setSalesRankList(dailyRankList);
        break;
      case 'weekly':
        setSalesRankList(weeklyRankList);
        break;
      case 'monthly':
        setSalesRankList(monthlyRankList);
        break;
    }
  }, [salesRankType]);

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderDataCard = (title: string, value: number, trend: { text: string; value: number }, data: number[], type: string) => (
    <Col xs={24} sm={12} md={6}>
      <Card
        className={`data-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
      >
        <div className="card-header">
          <div className="title">{title}</div>
          <Tag color={type}>{type === 'success' ? '日' : type === 'warning' ? '月' : type === 'error' ? '日' : '总'}</Tag>
        </div>
        <div className="card-content">
          <CountUp
            end={value}
            duration={2.5}
            separator=","
            className="card-number"
          />
          <div className="trend">
            <span>{trend.text}</span>
            <span className={trend.value >= 0 ? 'up' : 'down'}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          </div>
        </div>
        <div className="card-chart">
          {type === 'success' && <MiniArea data={data} height={50} />}
          {type === 'warning' && <MiniLine data={data} height={50} />}
          {type === 'error' && <MiniBar data={data} height={50} />}
          {type === 'info' && (
            <div style={{ height: 50, display: 'flex', alignItems: 'center' }}>
              <Progress percent={75} strokeColor="#409eff" showInfo={false} size="small" style={{ width: '100%' }} />
            </div>
          )}
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="dashboard-container">
      <Row gutter={[5, 5]} className="mb-20">
        {renderDataCard('总用户数', 98500, { text: '较昨日', value: 24 }, userData, 'success')}
        {renderDataCard('活跃用户', 693700, { text: '月环比', value: -12 }, activeData, 'warning')}
        {renderDataCard('订单数量', 72000, { text: '较昨日', value: 16 }, orderData, 'error')}
        {renderDataCard('销售额', 1234567, { text: '年同比', value: 35 }, [], 'info')}
      </Row>

      <Row gutter={[5, 5]} className="mb-20">
        <Col xs={24} sm={24} md={18}>
          <Card
            className={`chart-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <div className="card-header">
              <div className="title">销售趋势</div>
              <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)} size="small">
                <Radio.Button value="week">本周</Radio.Button>
                <Radio.Button value="month">本月</Radio.Button>
                <Radio.Button value="year">全年</Radio.Button>
              </Radio.Group>
            </div>
            <div className="card-content">
              <TrendChart loading={loading} timeRange={timeRange} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card
            className={`chart-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <div className="card-header">
              <div className="title">热门产品</div>
              <Button type="primary" size="small">查看更多</Button>
            </div>
            <div className="card-content" style={{ height: '350px', overflowY: 'auto' }}>
              <Table
                dataSource={hotProducts}
                columns={[
                  { title: '排名', dataIndex: 'rank', width: 80 },
                  { title: '产品名称', dataIndex: 'name' },
                  { title: '销量', dataIndex: 'sales', width: 120 },
                  {
                    title: '增长率',
                    dataIndex: 'growth',
                    width: 120,
                    render: (growth) => (
                      <span className={growth >= 0 ? 'up' : 'down'}>
                        {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
                      </span>
                    ),
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[5, 5]}>
        <Col xs={24} sm={24} md={8}>
          <Card
            className={`chart-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <div className="card-header">
              <div className="title">实时动态</div>
              <Button type="primary" size="small">查看更多</Button>
            </div>
            <div className="card-content" style={{ height: '260px', overflowY: 'auto' }}>
              <Timeline style={{ padding: '10px' }}>
                {activities.map((activity, index) => (
                  <Timeline.Item
                    key={index}
                    color={activity.color}
                    dot={activity.hollow ? <div className="hollow-dot" /> : undefined}
                  >
                    <p>{activity.content}</p>
                    <p className="time">{activity.time}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card
            className={`chart-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <div className="card-header">
              <div className="title">销售排行榜</div>
              <Radio.Group value={salesRankType} onChange={(e) => setSalesRankType(e.target.value)} size="small">
                <Radio.Button value="daily">日榜</Radio.Button>
                <Radio.Button value="weekly">周榜</Radio.Button>
                <Radio.Button value="monthly">月榜</Radio.Button>
              </Radio.Group>
            </div>
            <div className="card-content" style={{ height: '260px', overflowY: 'auto' }}>
              <div className={`rank-list ${!loading ? 'animate__animated animate__fadeIn' : ''}`}>
                {salesRankList.map((item, index) => (
                  <div key={index} className="rank-item">
                    <div className={`rank-number ${index < 3 ? 'top-three' : ''}`}>{index + 1}</div>
                    <div className="rank-info">
                      <div className="rank-name">{item.name}</div>
                      <div className="rank-detail">
                        <span className="sales">¥{item.amount.toLocaleString()}</span>
                        <Progress
                          percent={item.percentage}
                          strokeColor={item.color}
                          showInfo={false}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Card
            className={`chart-card ${!loading ? 'animate__animated animate__fadeInUp' : ''}`}
          >
            <div className="card-header">
              <div className="title">用户反馈</div>
              <div className="extra">
                {feedbackTags.map((tag) => (
                  <Tag key={tag.name} color={tag.type} style={{ margin: '0 5px' }}>
                    {tag.name} ({tag.count})
                  </Tag>
                ))}
              </div>
            </div>
            <div className="card-content" style={{ height: '260px', overflowY: 'auto' }}>
              {userFeedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <Avatar size={40} src={feedback.avatar} />
                  <div className="feedback-content">
                    <div className="feedback-header">
                      <span className="username">{feedback.username}</span>
                      <Rate value={feedback.rating} disabled />
                      <span className="time">{feedback.time}</span>
                    </div>
                    <div className="feedback-text">{feedback.content}</div>
                    {feedback.images && feedback.images.length > 0 && (
                      <div className="feedback-images">
                        {feedback.images.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={image}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', marginRight: '8px' }}
                            preview={{ src: image }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cockpit;