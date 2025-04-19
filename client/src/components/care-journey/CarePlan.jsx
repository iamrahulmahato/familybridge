import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CARE_PLANS, ADD_CARE_PLAN } from '../../graphql/queries';
import { format } from 'date-fns';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  List,
  Progress,
  message,
  Tag
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const CarePlan = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { loading, error, data } = useQuery(GET_CARE_PLANS);
  const [addCarePlan] = useMutation(ADD_CARE_PLAN);

  const handleSubmit = async (values) => {
    try {
      await addCarePlan({
        variables: {
          input: {
            ...values,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString()
          }
        },
        refetchQueries: [{ query: GET_CARE_PLANS }]
      });
      message.success('Care plan added successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('Failed to add care plan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="care-plan-container">
      <Card
        title="Care Plans"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Care Plan
          </Button>
        }
      >
        <List
          dataSource={data?.carePlans}
          renderItem={(plan) => (
            <List.Item
              actions={[
                <Button type="link">Edit</Button>,
                <Button type="link" danger>Delete</Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    {plan.title}
                    <Tag color={getStatusColor(plan.status)} style={{ marginLeft: 8 }}>
                      {plan.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <p>{plan.description}</p>
                    <div>
                      <Progress
                        percent={plan.progress}
                        size="small"
                        status={plan.status === 'completed' ? 'success' : 'active'}
                      />
                    </div>
                    <div>
                      <small>
                        {format(new Date(plan.startDate), 'PPP')} -{' '}
                        {format(new Date(plan.endDate), 'PPP')}
                      </small>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Add Care Plan"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select a start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: 'Please select an end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select a priority' }]}
          >
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Care Plan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CarePlan; 