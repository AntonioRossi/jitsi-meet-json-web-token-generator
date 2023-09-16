// @/components/Secrets.tsx

import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { SecretsData, useSecrets } from '@/contexts/SecretsContext';

const Secrets: React.FC = () => {
    const { state: secrets, dispatch } = useSecrets();

    const onFinish = (values: SecretsData) => {
        dispatch({ type: 'SET_SECRETS', payload: values });
        notification.success({
            message: 'Success!',
            description: 'Values have been saved.',
        });
    };

    return (
        <div>
            <h2>Secrets</h2>
            <Form initialValues={secrets} onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="domain"
                    label="Domain"
                    rules={[
                        { required: true, message: 'Please input a domain!' },
                        {
                            pattern: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/,
                            message: 'Please enter a valid domain name!',
                        },
                    ]}
                >
                    <Input placeholder="example.com" />
                </Form.Item>

                <Form.Item
                    name="appId"
                    label="App ID"
                    rules={[
                        { required: true, message: 'Please input an App ID!' },
                        {
                            pattern: /^[a-zA-Z_]+$/,
                            message: 'Only letters and underscores are allowed!',
                        },
                    ]}
                >
                    <Input placeholder="App ID" />
                </Form.Item>

                <Form.Item
                    name="secret"
                    label="Secret"
                    rules={[{ required: true, message: 'Please input a secret!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Secrets;
