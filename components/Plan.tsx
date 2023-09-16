// @/components/Plan.tsx

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Typography, DatePicker, InputNumber } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useSecrets } from '@/contexts/SecretsContext';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const Plan: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { state: secretsData } = useSecrets();

  // Set the default values for the date and duration when the component mounts
  useEffect(() => {
    form.setFieldsValue({
      date: dayjs(), // Current client's time
      hours: 1,     // Default 1 hour
      minutes: 0,   // Default 0 minutes
    });
  }, [form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Format the date in an ISO string, including the timezone
      values.date = dayjs(values.date).toISOString();

      // use secrets data
      values.domain = secretsData.domain;
      values.appId = secretsData.appId;
      values.secret = secretsData.secret;

      const response = await fetch('/api/generate-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(data.jwt_url);
        notification.success({
          message: 'Success!',
          description: `Meeting link generated successfully.`,
        });
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'There was an error generating the meeting link.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Plan</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>

        <Form.Item
          name="date"
          label="Meeting Date"
          rules={[
            { required: true, message: 'Please select the meeting date!' },
          ]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>

        <Form.Item label="Duration">
          <Input.Group compact>
            <Form.Item name="hours" noStyle rules={[{ required: true, message: 'Please input the duration in hours!' }]}>
              <InputNumber min={0} placeholder="Hours" />
            </Form.Item>
            <span style={{ margin: '0 8px' }}>hours</span>
            <Form.Item name="minutes" noStyle rules={[{ required: true, message: 'Please input the duration in minutes!' }]}>
              <InputNumber min={0} max={59} placeholder="Minutes" />
            </Form.Item>
            <span style={{ margin: '0 8px' }}>minutes</span>
          </Input.Group>
        </Form.Item>

        <Form.Item
          name="room"
          label="Room Name"
          rules={[{ required: true, message: 'Please input the room name!' }]}
        >
          <Input prefix={<VideoCameraOutlined />} placeholder="Room Name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Meeting
          </Button>
        </Form.Item>
      </Form>

      {/* Display the generated link */}
      {generatedLink && (
        <div style={{ marginTop: '20px' }}>
          <Typography.Text copyable={{ text: generatedLink }}>
            {generatedLink}
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default Plan;
