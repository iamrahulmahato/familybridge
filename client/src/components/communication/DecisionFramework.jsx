import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DECISIONS, CREATE_DECISION, VOTE_DECISION } from '../../graphql/queries';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Tag,
  message,
  Avatar,
  Radio,
  Space
} from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

const { TextArea } = Input;
const { Option } = Select;

const DecisionFramework = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [form] = Form.useForm();

  const { loading, data } = useQuery(GET_DECISIONS);
  const [createDecision] = useMutation(CREATE_DECISION);
  const [voteDecision] = useMutation(VOTE_DECISION);

  const handleSubmit = async (values) => {
    try {
      await createDecision({
        variables: { input: values },
        refetchQueries: [{ query: GET_DECISIONS }]
      });
      message.success('Decision created successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('Failed to create decision');
    }
  };

  const handleVote = async (decisionId, vote) => {
    try {
      await voteDecision({
        variables: { decisionId, vote },
        refetchQueries: [{ query: GET_DECISIONS }]
      });
      message.success('Vote recorded successfully');
    } catch (err) {
      message.error('Failed to record vote');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined />;
      case 'rejected':
        return <CloseCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <div className="decision-framework">
      <Card
        title="Family Decisions"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            New Decision
          </Button>
        }
      >
        <List
          dataSource={data?.decisions}
          renderItem={(decision) => (
            <List.Item
              actions={[
                <Radio.Group
                  value={decision.userVote}
                  onChange={(e) => handleVote(decision.id, e.target.value)}
                >
                  <Space direction="vertical">
                    <Radio value="yes">Approve</Radio>
                    <Radio value="no">Reject</Radio>
                    <Radio value="abstain">Abstain</Radio>
                  </Space>
                </Radio.Group>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={decision.createdBy.avatar} />}
                title={
                  <div>
                    {decision.title}
                    <Tag
                      color={getStatusColor(decision.status)}
                      icon={getStatusIcon(decision.status)}
                      style={{ marginLeft: 8 }}
                    >
                      {decision.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <p>{decision.description}</p>
                    <div>
                      <Progress
                        percent={decision.approvalRate}
                        success={{ percent: decision.rejectionRate }}
                        format={(percent) => `${percent}% Approval`}
                      />
                    </div>
                    <div>
                      <small>
                        Created by {decision.createdBy.name} on{' '}
                        {format(new Date(decision.createdAt), 'PPP')}
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
        title="Create New Decision"
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
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select>
              <Option value="medical">Medical</Option>
              <Option value="financial">Financial</Option>
              <Option value="care">Care</Option>
              <Option value="education">Education</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Voting Deadline"
            rules={[{ required: true, message: 'Please set a deadline' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Decision
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DecisionFramework; 