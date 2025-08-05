import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Table, 
  Tag, 
  Progress,
  Space,
  Button
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  StarOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  inactiveDrivers: number;
  trainingRequired: number;
  licenseExpiring: number;
  topPerformers: number;
  violations: number;
  avgSafetyScore: number;
}

interface RecentActivity {
  id: string;
  driverName: string;
  activity: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'warning';
}

const DriverDashboard: React.FC = () => {
  // Mock data
  const driverStats: DriverStats = {
    totalDrivers: 48,
    activeDrivers: 42,
    inactiveDrivers: 6,
    trainingRequired: 8,
    licenseExpiring: 3,
    topPerformers: 12,
    violations: 5,
    avgSafetyScore: 87.5
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      driverName: 'John Doe',
      activity: 'Completed Safety Training',
      timestamp: '2023-11-20 14:30',
      status: 'completed'
    },
    {
      id: '2',
      driverName: 'Jane Smith',
      activity: 'License Renewal Required',
      timestamp: '2023-11-20 10:15',
      status: 'warning'
    },
    {
      id: '3',
      driverName: 'Mike Johnson',
      activity: 'Performance Review Scheduled',
      timestamp: '2023-11-19 16:45',
      status: 'pending'
    },
    {
      id: '4',
      driverName: 'Sarah Williams',
      activity: 'Defensive Driving Course Completed',
      timestamp: '2023-11-19 13:20',
      status: 'completed'
    }
  ];

  const topPerformers = [
    { name: 'Sarah Williams', score: 98.5, trips: 45 },
    { name: 'John Doe', score: 96.2, trips: 52 },
    { name: 'Mike Johnson', score: 94.8, trips: 38 },
    { name: 'David Brown', score: 93.1, trips: 41 },
    { name: 'Lisa Davis', score: 91.7, trips: 33 }
  ];

  const getActivityStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
      case 'pending':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Pending</Tag>;
      case 'warning':
        return <Tag icon={<AlertOutlined />} color="warning">Action Required</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const activityColumns = [
    {
      title: 'Driver',
      dataIndex: 'driverName',
      key: 'driverName',
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getActivityStatus(status),
    },
  ];

  const performerColumns = [
    {
      title: 'Driver',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Safety Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Progress 
          percent={score} 
          size="small" 
          status={score >= 95 ? 'success' : score >= 85 ? 'normal' : 'exception'}
          format={() => `${score}%`}
        />
      ),
    },
    {
      title: 'Trips Completed',
      dataIndex: 'trips',
      key: 'trips',
    },
  ];

  return (
    <div className="driver-dashboard">
      <Title level={3}>
        <UserOutlined style={{ marginRight: '8px' }} />
        Driver Dashboard
      </Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        Overview of your driver management metrics and performance
      </Text>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Drivers"
              value={driverStats.totalDrivers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                {driverStats.activeDrivers} active, {driverStats.inactiveDrivers} inactive
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Safety Score"
              value={driverStats.avgSafetyScore}
              suffix="%"
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                Fleet-wide performance metric
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Training Required"
              value={driverStats.trainingRequired}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                Pending training sessions
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="License Alerts"
              value={driverStats.licenseExpiring}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                Expiring within 30 days
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card title="Driver Status" extra={<Button type="link">View All</Button>}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                  {Math.round((driverStats.activeDrivers / driverStats.totalDrivers) * 100)}%
                </div>
                <Text type="secondary">Active Drivers</Text>
              </div>
              <Progress 
                type="circle" 
                percent={Math.round((driverStats.activeDrivers / driverStats.totalDrivers) * 100)}
                size={120}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="Safety Performance" extra={<Button type="link">Details</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Excellent (95%+)</Text>
                <Text strong style={{ color: '#52c41a' }}>15 drivers</Text>
              </div>
              <Progress percent={31} strokeColor="#52c41a" size="small" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Good (85-94%)</Text>
                <Text strong style={{ color: '#1890ff' }}>22 drivers</Text>
              </div>
              <Progress percent={46} strokeColor="#1890ff" size="small" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Needs Improvement</Text>
                <Text strong style={{ color: '#faad14' }}>11 drivers</Text>
              </div>
              <Progress percent={23} strokeColor="#faad14" size="small" />
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" icon={<UserOutlined />} block>
                Add New Driver
              </Button>
              <Button icon={<LineChartOutlined />} block>
                Performance Reports
              </Button>
              <Button icon={<ClockCircleOutlined />} block>
                Training Schedule
              </Button>
              <Button icon={<AlertOutlined />} block>
                License Renewals
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Recent Activities" extra={<Button type="link">View All</Button>}>
            <Table 
              dataSource={recentActivities} 
              columns={activityColumns} 
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={10}>
          <Card title="Top Performers" extra={<Button type="link">View All</Button>}>
            <Table 
              dataSource={topPerformers} 
              columns={performerColumns} 
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DriverDashboard;
