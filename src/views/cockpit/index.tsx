import React from 'react';
import { Card, Col, Row } from 'antd';
import PieChart from '@/components/chart/pie';
import BarChart from '@/components/chart/bar';
import LineChart from '@/components/chart/line';
import MoreLineChart from '@/components/chart/moreLine';
import MoreBarChart from '@/components/chart/moreBar';
import MixChart from '@/components/chart/mix';
import MapChart from '@/components/chart/map';

import './index.scss';

const Cockpit: React.FC = () => {
  const userDistOption = {
    subtext: "总人数",
    name: "用户分布",
    text: "4000人",
    data: [
      {
        value: 1770,
        name: "北京",
      },
      {
        value: 670,
        name: "上海",
      },
      {
        value: 500,
        name: "广州",
      },
      {
        value: 600,
        name: "深圳",
      },
      {
        value: 400,
        name: "天津",
      },
      {
        value: 500,
        name: "西安",
      },
      {
        value: 300,
        name: "杭州",
      },
      {
        value: 200,
        name: "苏州",
      },
      {
        value: 100,
        name: "郑州",
      },
    ],
  };
  const cityPersonOption = {
    unit: "人",
    text: "用户人数",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    data: [120, 200, 150, 80, 70, 110, 130, 500],
  };
  const hotTrendOption = {
    unit: "人",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    data: [120, 200, 150, 80, 70, 110, 130, 500],
  };
  const statusDistOption = {
    legendData: ["2021年", "2022年", "2023年", "2024年"],
    icon: "round",
    unit: "人",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    seriesData: [
      {
        name: "2021年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [120, 200, 150, 80, 70, 110, 130, 500],
      },
      {
        name: "2022年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [140, 230, 120, 180, 270, 110, 130, 200],
      },
      {
        name: "2023年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [320, 200, 250, 380, 270, 110, 130, 300],
      },
      {
        name: "2024年",
        type: "line",
        stack: "Total",
        smooth: true,
        data: [100, 20, 150, 580, 270, 110, 430, 1000],
      },
    ],
  };

  const yearPopulationOption = {
    legendData: ["2021年", "2022年", "2023年", "2024年"],
    icon: "round",
    unit: "人",
    xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
    seriesData: [
      {
        name: "2021年",
        type: "bar",
        data: [120, 200, 150, 80, 70, 110, 130, 500],
      },
      {
        name: "2022年",
        type: "bar",
        data: [140, 230, 120, 180, 270, 110, 130, 200],
      },
      {
        name: "2023年",
        type: "bar",
        data: [320, 200, 250, 380, 270, 110, 130, 300],
      },
      {
        name: "2024年",
        type: "bar",
        data: [100, 20, 150, 580, 270, 110, 430, 1000],
      },
    ],
  };
  const dimenAnalysisOption1 = {
    subtext: "总量",
    name: "用户分布",
    text: "200人",
    data: [
      {
        value: 1770,
        name: "北京",
      },
      {
        value: 670,
        name: "上海",
      },
      {
        value: 500,
        name: "广州",
      },
      {
        value: 600,
        name: "深圳",
      },
      {
        value: 400,
        name: "天津",
      },
      {
        value: 500,
        name: "西安",
      },
      {
        value: 300,
        name: "杭州",
      },
      {
        value: 200,
        name: "苏州",
      },
      {
        value: 100,
        name: "郑州",
      },
    ],
  };
  
  const dimenAnalysisOption2 = {
    subtext: "总数",
    name: "用户分布",
    text: "100人",
    data: [
      {
        value: 1770,
        name: "北京",
      },
      {
        value: 670,
        name: "上海",
      },
      {
        value: 500,
        name: "广州",
      },
      {
        value: 600,
        name: "深圳",
      },
      {
        value: 400,
        name: "天津",
      },
      {
        value: 500,
        name: "西安",
      },
      {
        value: 300,
        name: "杭州",
      },
      {
        value: 200,
        name: "苏州",
      },
      {
        value: 100,
        name: "郑州",
      },
    ],
  };
  return (
    <div>
      <Row gutter={10} style={{ marginBottom: '10px' }}>
        <Col span={7}>
          <Card title="用户分布" bordered={false} style={{ height: '330px', marginBottom: '10px' }}>
            <PieChart chartOption={userDistOption} />
          </Card>
          <Card title="城市人数" bordered={false} style={{ height: '330px' }}>
            <BarChart chartOption={cityPersonOption} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="城市概况" bordered={false} style={{ height: '670px', }}>
            <MapChart />
          </Card>
        </Col>
        <Col span={7}>
          <Card title="维度分析 " bordered={false} style={{ height: '330px', marginBottom: '10px' }}>
          <div className="chart-children-wrapper">
            <div className="child-item">
              <PieChart chartOption={dimenAnalysisOption1} />
            </div>
            <div className="child-item">
              <PieChart chartOption={dimenAnalysisOption2} />
            </div>
          </div>
          </Card>
          <Card title="年度人口" bordered={false} style={{ height: '330px' }}>
            <MoreBarChart chartOption={yearPopulationOption} />
          </Card>
        </Col>
      </Row>
      <Row gutter={10} style={{ marginBottom: '10px' }}>
        <Col span={7}>
          <Card title="热度趋势" bordered={false} style={{ height: '330px' }}>
            <LineChart chartOption={hotTrendOption} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="混合布局" bordered={false} style={{ height: '330px' }}>
            <MixChart chartOption={userDistOption}/>
          </Card>
        </Col>
        <Col span={7}>
          <Card title="状态分布" bordered={false} style={{ height: '330px' }}>
            <MoreLineChart chartOption={statusDistOption} />
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default Cockpit;