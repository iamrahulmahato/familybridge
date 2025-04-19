import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TIMELINE_EVENTS, CREATE_TIMELINE_EVENT } from '../../graphql/queries';
import { format } from 'date-fns';
import {
  Timeline as AntTimeline,
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const Timeline = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { loading, error, data } = useQuery(GET_TIMELINE_EVENTS);
  const [createTimelineEvent] = useMutation(CREATE_TIMELINE_EVENT);

  const handleSubmit = async (values) => {
    try {
      await createTimelineEvent({
        variables: {
          input: {
            ...values,
            date: values.date.toISOString()
          }
        },
        refetchQueries: [{ query: GET_TIMELINE_EVENTS }]
      });
      message.success('Timeline event created successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('Failed to create timeline event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="timeline-container">
      <Card
        title="Care Journey Timeline"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Event
          </Button>
        }
      >
        <AntTimeline>
          {data?.timelineEvents.map((event) => (
            <AntTimeline.Item key={event.id}>
              <Card size="small">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <small>{format(new Date(event.date), 'PPP')}</small>
                {event.location && <p>Location: {event.location}</p>}
                {event.category && <p>Category: {event.category}</p>}
              </Card>
            </AntTimeline.Item>
          ))}
        </AntTimeline>
      </Card>

      <Modal
        title="Add Timeline Event"
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
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select>
              <Option value="medical">Medical</Option>
              <Option value="educational">Educational</Option>
              <Option value="social">Social</Option>
              <Option value="milestone">Milestone</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Event
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Timeline; 