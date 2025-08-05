import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Table, 
  Button, 
  Space,
  Input,
  Tag,
  Rate,
  Modal,
  Form,
  InputNumber,
  Switch,
  message,
  Select,
  Divider
} from 'antd';
import {
  EnvironmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface FuelStation {
  id: string;
  name: string;
  brand: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  pricePerLiter: number;
  rating: number;
  isPreferred: boolean;
  hasCardAccess: boolean;
  operatingHours: string;
  services: string[];
  lastUpdated: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const FuelStations: React.FC = () => {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([
    {
      id: '1',
      name: 'Shell Travel Center',
      brand: 'Shell',
      address: '1234 Highway 95 North',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '89115',
      phone: '(555) 123-4567',
      pricePerLiter: 1.25,
      rating: 4.5,
      isPreferred: true,
      hasCardAccess: true,
      operatingHours: '24/7',
      services: ['Diesel', 'DEF', 'Truck Wash', 'Restaurant'],
      lastUpdated: '2023-11-20',
      status: 'active'
    },
    {
      id: '2',
      name: 'Chevron Truck Stop',
      brand: 'Chevron',
      address: '5678 Main Street',
      city: 'Reno',
      state: 'NV',
      zipCode: '89501',
      phone: '(555) 234-5678',
      pricePerLiter: 1.28,
      rating: 4.2,
      isPreferred: false,
      hasCardAccess: true,
      operatingHours: '5:00 AM - 11:00 PM',
      services: ['Diesel', 'DEF', 'Convenience Store'],
      lastUpdated: '2023-11-19',
      status: 'active'
    },
    {
      id: '3',
      name: 'BP Energy Station',
      brand: 'BP',
      address: '9012 Route 66',
      city: 'Flagstaff',
      state: 'AZ',
      zipCode: '86001',
      phone: '(555) 345-6789',
      pricePerLiter: 1.23,
      rating: 4.7,
      isPreferred: true,
      hasCardAccess: false,
      operatingHours: '6:00 AM - 10:00 PM',
      services: ['Diesel', 'DEF', 'Truck Parking', 'ATM'],
      lastUpdated: '2023-11-18',
      status: 'active'
    },
    {
      id: '4',
      name: 'Exxon Service Center',
      brand: 'Exxon',
      address: '3456 Interstate 80',
      city: 'Salt Lake City',
      state: 'UT',
      zipCode: '84101',
      phone: '(555) 456-7890',
      pricePerLiter: 1.30,
      rating: 3.8,
      isPreferred: false,
      hasCardAccess: true,
      operatingHours: '24/7',
      services: ['Diesel', 'Truck Repair'],
      lastUpdated: '2023-11-17',
      status: 'maintenance'
    }
  ]);

  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState<FuelStation | null>(null);
  const [form] = Form.useForm();

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>;
      case 'inactive':
        return <Tag icon={<CloseCircleOutlined />} color="default">Inactive</Tag>;
      case 'maintenance':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Maintenance</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'shell':
        return '#FFD700';
      case 'chevron':
        return '#0066CC';
      case 'bp':
        return '#00A651';
      case 'exxon':
        return '#FF0000';
      default:
        return '#1890ff';
    }
  };

  const handleAddEdit = (values: any) => {
    const newStation: FuelStation = {
      id: editingStation ? editingStation.id : Date.now().toString(),
      ...values,
      lastUpdated: new Date().toISOString().split('T')[0],
      services: values.services || []
    };

    if (editingStation) {
      setFuelStations(prev => prev.map(station => 
        station.id === editingStation.id ? newStation : station
      ));
      message.success('Fuel station updated successfully');
    } else {
      setFuelStations(prev => [...prev, newStation]);
      message.success('Fuel station added successfully');
    }

    setIsModalVisible(false);
    setEditingStation(null);
    form.resetFields();
  };

  const handleEdit = (station: FuelStation) => {
    setEditingStation(station);
    form.setFieldsValue(station);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setFuelStations(prev => prev.filter(station => station.id !== id));
    message.success('Fuel station deleted successfully');
  };

  const togglePreferred = (id: string) => {
    setFuelStations(prev => prev.map(station => 
      station.id === id 
        ? { ...station, isPreferred: !station.isPreferred }
        : station
    ));
  };

  const filteredStations = fuelStations.filter(station =>
    station.name.toLowerCase().includes(searchText.toLowerCase()) ||
    station.brand.toLowerCase().includes(searchText.toLowerCase()) ||
    station.address.toLowerCase().includes(searchText.toLowerCase()) ||
    station.city.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Station Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: FuelStation, b: FuelStation) => a.name.localeCompare(b.name),
      render: (text: string, record: FuelStation) => (
        <Space direction="vertical" size="small">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong>{text}</Text>
            {record.isPreferred && (
              <StarOutlined style={{ color: '#faad14', marginLeft: '8px' }} />
            )}
          </div>
          <Tag color={getBrandColor(record.brand)}>{record.brand}</Tag>
        </Space>
      ),
    },
    {
      title: 'Location',
      key: 'location',
      render: (_: any, record: FuelStation) => (
        <Space direction="vertical" size="small">
          <Text>{record.address}</Text>
          <Text type="secondary">{record.city}, {record.state} {record.zipCode}</Text>
        </Space>
      ),
      sorter: (a: FuelStation, b: FuelStation) => a.city.localeCompare(b.city),
    },
    {
      title: 'Price/L',
      dataIndex: 'pricePerLiter',
      key: 'pricePerLiter',
      render: (text: number) => `$${text.toFixed(3)}`,
      sorter: (a: FuelStation, b: FuelStation) => a.pricePerLiter - b.pricePerLiter,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (text: number) => <Rate disabled defaultValue={text} allowHalf />,
      sorter: (a: FuelStation, b: FuelStation) => a.rating - b.rating,
    },
    {
      title: 'Hours',
      dataIndex: 'operatingHours',
      key: 'operatingHours',
    },
    {
      title: 'Card Access',
      dataIndex: 'hasCardAccess',
      key: 'hasCardAccess',
      render: (text: boolean) => (
        text ? 
          <Tag icon={<CheckCircleOutlined />} color="success">Yes</Tag> : 
          <Tag icon={<CloseCircleOutlined />} color="default">No</Tag>
      ),
      filters: [
        { text: 'Has Card Access', value: true },
        { text: 'No Card Access', value: false },
      ],
      onFilter: (value: boolean, record: FuelStation) => record.hasCardAccess === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => getStatusTag(text),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Maintenance', value: 'maintenance' },
      ],
      onFilter: (value: string, record: FuelStation) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: FuelStation) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            type="link"
            size="small"
            title="View Details"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="link"
            size="small"
            title="Edit"
          />
          <Button 
            icon={<StarOutlined />} 
            onClick={() => togglePreferred(record.id)}
            type="link"
            size="small"
            style={{ color: record.isPreferred ? '#faad14' : '#d9d9d9' }}
            title={record.isPreferred ? 'Remove from Preferred' : 'Add to Preferred'}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            type="link"
            danger
            size="small"
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  // Calculate summary statistics
  const preferredStations = fuelStations.filter(station => station.isPreferred).length;
  const avgPrice = fuelStations.reduce((sum, station) => sum + station.pricePerLiter, 0) / fuelStations.length;
  const avgRating = fuelStations.reduce((sum, station) => sum + station.rating, 0) / fuelStations.length;

  return (
    <div className="fuel-stations-page">
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Title level={3}>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              Fuel Stations
            </Title>
            <Text type="secondary">
              Manage your network of preferred fuel stations and track pricing
            </Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Station
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Total Stations</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {fuelStations.length}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Preferred Stations</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                  {preferredStations}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Avg. Price</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  ${avgPrice.toFixed(3)}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">Avg. Rating</Text>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                  {avgRating.toFixed(1)} ⭐
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <div style={{ marginBottom: '16px' }}>
          <Search
            placeholder="Search stations..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Divider orientation="left">Station Directory</Divider>

        <Table 
          dataSource={filteredStations} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ margin: 0 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space direction="vertical">
                      <Text strong>Contact Information:</Text>
                      <Text>📞 {record.phone}</Text>
                      <Text strong>Services:</Text>
                      <Space wrap>
                        {record.services.map(service => (
                          <Tag key={service} color="blue">{service}</Tag>
                        ))}
                      </Space>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical">
                      <Text strong>Last Updated:</Text>
                      <Text>{record.lastUpdated}</Text>
                      <Text strong>Operating Hours:</Text>
                      <Text>{record.operatingHours}</Text>
                    </Space>
                  </Col>
                </Row>
              </div>
            ),
          }}
        />

        <Modal
          title={editingStation ? 'Edit Fuel Station' : 'Add Fuel Station'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingStation(null);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddEdit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Station Name"
                  rules={[{ required: true, message: 'Please enter station name' }]}
                >
                  <Input placeholder="e.g., Shell Travel Center" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[{ required: true, message: 'Please select a brand' }]}
                >
                  <Select placeholder="Select brand">
                    <Option value="Shell">Shell</Option>
                    <Option value="Chevron">Chevron</Option>
                    <Option value="BP">BP</Option>
                    <Option value="Exxon">Exxon</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input placeholder="Street address" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="zipCode"
                  label="ZIP Code"
                  rules={[{ required: true, message: 'Please enter ZIP code' }]}
                >
                  <Input placeholder="ZIP Code" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="(555) 123-4567" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="pricePerLiter"
                  label="Price per Liter ($)"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    min={0} 
                    precision={3}
                    placeholder="1.250"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="operatingHours"
                  label="Operating Hours"
                  rules={[{ required: true, message: 'Please enter operating hours' }]}
                >
                  <Input placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[{ required: true, message: 'Please provide a rating' }]}
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    min={1} 
                    max={5}
                    step={0.1}
                    precision={1}
                    placeholder="4.5"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="isPreferred" label="Preferred Station" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="hasCardAccess" label="Card Access" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="maintenance">Maintenance</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="services"
              label="Services"
            >
              <Select mode="multiple" placeholder="Select available services">
                <Option value="Diesel">Diesel</Option>
                <Option value="DEF">DEF (Diesel Exhaust Fluid)</Option>
                <Option value="Truck Wash">Truck Wash</Option>
                <Option value="Truck Parking">Truck Parking</Option>
                <Option value="Restaurant">Restaurant</Option>
                <Option value="Convenience Store">Convenience Store</Option>
                <Option value="Truck Repair">Truck Repair</Option>
                <Option value="ATM">ATM</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingStation ? 'Update' : 'Add'} Station
                </Button>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  setEditingStation(null);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default FuelStations;
