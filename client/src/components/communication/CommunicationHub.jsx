import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, SEND_MESSAGE, GET_ANNOUNCEMENTS, CREATE_ANNOUNCEMENT } from '../../graphql/queries';
import {
  Card,
  Tabs,
  Input,
  Button,
  List,
  Avatar,
  Modal,
  Form,
  Select,
  message,
  Badge,
  Tooltip
} from 'antd';
import {
  MessageOutlined,
  NotificationOutlined,
  AudioOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const CommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [isAnnouncementModalVisible, setIsAnnouncementModalVisible] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [form] = Form.useForm();

  const { loading: messagesLoading, data: messagesData } = useQuery(GET_MESSAGES);
  const { loading: announcementsLoading, data: announcementsData } = useQuery(GET_ANNOUNCEMENTS);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT);

  const handleSendMessage = async (values) => {
    try {
      await sendMessage({
        variables: { input: values },
        refetchQueries: [{ query: GET_MESSAGES }]
      });
      message.success('Message sent successfully');
    } catch (err) {
      message.error('Failed to send message');
    }
  };

  const handleCreateAnnouncement = async (values) => {
    try {
      await createAnnouncement({
        variables: { input: values },
        refetchQueries: [{ query: GET_ANNOUNCEMENTS }]
      });
      message.success('Announcement created successfully');
      setIsAnnouncementModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error('Failed to create announcement');
    }
  };

  const startVoiceRecording = () => {
    setIsVoiceRecording(true);
    // Implement voice recording logic
  };

  const stopVoiceRecording = () => {
    setIsVoiceRecording(false);
    // Implement voice recording stop logic
  };

  return (
    <div className="communication-hub">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <MessageOutlined />
                Messages
              </span>
            }
            key="messages"
          >
            <div className="messages-container">
              <List
                dataSource={messagesData?.messages}
                renderItem={(message) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={message.sender.avatar} />}
                      title={
                        <div>
                          {message.sender.name}
                          <small style={{ marginLeft: 8 }}>
                            {format(new Date(message.createdAt), 'PPP')}
                          </small>
                        </div>
                      }
                      description={message.content}
                    />
                  </List.Item>
                )}
              />
              <div className="message-input">
                <Input.TextArea
                  placeholder="Type your message..."
                  autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <div className="message-actions">
                  <Tooltip title="Send voice message">
                    <Button
                      type="text"
                      icon={<AudioOutlined />}
                      onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                      danger={isVoiceRecording}
                    />
                  </Tooltip>
                  <Button type="primary">Send</Button>
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane
            tab={
              <span>
                <NotificationOutlined />
                Announcements
                <Badge count={announcementsData?.announcements.length} />
              </span>
            }
            key="announcements"
          >
            <div className="announcements-container">
              <Button
                type="primary"
                icon={<NotificationOutlined />}
                onClick={() => setIsAnnouncementModalVisible(true)}
                style={{ marginBottom: 16 }}
              >
                New Announcement
              </Button>
              <List
                dataSource={announcementsData?.announcements}
                renderItem={(announcement) => (
                  <List.Item>
                    <List.Item.Meta
                      title={announcement.title}
                      description={
                        <div>
                          <p>{announcement.content}</p>
                          <small>
                            Posted by {announcement.author.name} on{' '}
                            {format(new Date(announcement.createdAt), 'PPP')}
                          </small>
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
                <TeamOutlined />
                Family Decisions
              </span>
            }
            key="decisions"
          >
            <div className="decisions-container">
              {/* Decision framework implementation */}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Create Announcement"
        visible={isAnnouncementModalVisible}
        onCancel={() => setIsAnnouncementModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateAnnouncement} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter the announcement content' }]}
          >
            <TextArea rows={4} />
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
              Create Announcement
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommunicationHub; 