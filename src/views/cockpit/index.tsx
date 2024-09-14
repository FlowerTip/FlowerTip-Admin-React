import React from 'react';
import { Card, Col, Row } from 'antd';

const Cockpit: React.FC = () => (
  <div style={{ padding: '10px'}}>
    <Row gutter={10} style={{marginBottom: '10px'}}>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
    </Row>
    <Row gutter={10} style={{marginBottom: '10px'}}>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
    </Row>
    <Row gutter={10} style={{marginBottom: '10px'}}>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false} style={{height: '300px'}}>
          Card content
        </Card>
      </Col>
    </Row>
  </div>
);

export default Cockpit;