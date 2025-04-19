import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RESOURCES, GET_SERVICE_PROVIDERS, GET_COMMUNITY_WISDOM } from '../../graphql/queries';
import {
  Card,
  Tabs,
  List,
  Button,
  Input,
  Select,
  Tag,
  Rate,
  Modal,
  Form,
  message,
  Avatar,
  Tooltip
} from 'antd';
import {
  BookOutlined,
  ShopOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const ResourceHub = () => {
  const [activeTab, setActiveTab] = useState('wisdom');
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [form] = Form.useForm();

  const { loading: resourcesLoading, data: resourcesData } = useQuery(GET_RESOURCES);
  const { loading: providersLoading, data: providersData } = useQuery(GET_SERVICE_PROVIDERS);
  const { loading: wisdomLoading, data: wisdomData } = useQuery(GET_COMMUNITY_WISDOM);

  const handleReviewSubmit = async (values) => {
    try {
      // Implement review submission logic
      message.success('Review submitted successfully');
      setIsReviewModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('Failed to submit review');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'medical':
        return 'red';
      case 'legal':
        return 'blue';
      case 'financial':
        return 'green';
      case 'educational':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <div className="resource-hub">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Community Wisdom
              </span>
            }
            key="wisdom"
          >
            <div className="wisdom-container">
              <Search
                placeholder="Search community resources..."
                style={{ marginBottom: 16 }}
              />
              <List
                dataSource={wisdomData?.communityWisdom}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title={item.title}
                      description={
                        <div>
                          <p>{item.content}</p>
                          <div>
                            <Tag color={getCategoryColor(item.category)}>
                              {item.category}
                            </Tag>
                            <small style={{ marginLeft: 8 }}>
                              Shared by {item.author.name} on{' '}
                              {format(new Date(item.createdAt), 'PPP')}
                            </small>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ShopOutlined />
                Service Providers
              </span>
            }
            key="providers"
          >
            <div className="providers-container">
              <Search
                placeholder="Search service providers..."
                style={{ marginBottom: 16 }}
              />
              <List
                dataSource={providersData?.serviceProviders}
                renderItem={(provider) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          setSelectedProvider(provider);
                          setIsReviewModalVisible(true);
                        }}
                      >
                        Write Review
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={provider.logo} />}
                      title={
                        <div>
                          {provider.name}
                          <Rate
                            disabled
                            defaultValue={provider.rating}
                            style={{ marginLeft: 8, fontSize: 14 }}
                          />
                        </div>
                      }
                      description={
                        <div>
                          <p>{provider.description}</p>
                          <div>
                            <Tag color="blue">{provider.specialty}</Tag>
                            <small style={{ marginLeft: 8 }}>
                              {provider.location}
                            </small>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                Legal & Financial
              </span>
            }
            key="legal"
          >
            <div className="legal-container">
              <List
                dataSource={resourcesData?.legalResources}
                renderItem={(resource) => (
                  <List.Item>
                    <List.Item.Meta
                      title={resource.title}
                      description={
                        <div>
                          <p>{resource.description}</p>
                          <Button type="link" href={resource.url}>
                            View Template
                          </Button>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <EnvironmentOutlined />
                Local Resources
              </span>
            }
            key="local"
          >
            <div className="local-container">
              {/* Map and local resources implementation */}
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ToolOutlined />
                Equipment Exchange
              </span>
            }
            key="equipment"
          >
            <div className="equipment-container">
              <List
                dataSource={resourcesData?.equipmentListings}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="primary">Request Item</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <div>
                          <p>{item.description}</p>
                          <div>
                            <Tag color="green">Available</Tag>
                            <small style={{ marginLeft: 8 }}>
                              Listed by {item.owner.name}
                            </small>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={`Review ${selectedProvider?.name}`}
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Review"
            rules={[{ required: true, message: 'Please write a review' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResourceHub; 