import React, { useState, useEffect } from 'react';
import { PageContainer } from "@ant-design/pro-components"
import { Button, Form, Input, message, Select, Card } from 'antd';
import HttpClient from '@/utils/HttpClient';
import Store from "@/store";
import { deepCopy } from '@/utils/CommonUtils';
import CardPanel from '@/components/CardPanel';

const { useModel } = Store;

function PersonSetting() {
    const [userInfo, dispatchers] = useModel('user');
    const [personData, setPersonData] = useState(userInfo);
    const [form] = Form.useForm();
    const on_submit = async (values) => {
        // console.log('values:', values);
        if (!values.password) {
            message.success('更新成功');
            return;
        }

        let url = "/api/auth/update-info";
        let response = await HttpClient.put(url, { password: values.password });
        if (response.status !== 200) {
            // Message.error({
            //     title: '更新失败',
            //     content: response.data.detail
            // });
            message.error('更新失败' + response.data.detail);
        }
        else {
            message.success('更新成功');
        }
        form.setFieldValue("password", "");
        form.setFieldValue("re_password", "");
    };
    const checkRePassword = async (rule, value, callback) => {
        const { getValue } = field;
        if (value && value !== getValue("password")) {
            return callback("两次输入的密码不一致!");
        }

        if (value && value.length < 8) {
            return callback("密码最少8位!");
        }
    };
    useEffect(() => {
        console.log(userInfo);
        form.setFieldsValue(deepCopy(userInfo));
    });
    return (
        <PageContainer
            header={{
                breadcrumb: {
                    items: [
                        {
                            title: '系统',
                        },
                        {
                            title: '个人设置',
                        },
                    ],
                },
            }}
            content="">
            <CardPanel align="center">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Form
                        form={form}
                        name="user-setting-form"
                        style={{ width: 500 }}
                        layout="vertical"
                        initialValues={userInfo}
                        onFinish={on_submit}>
                        <Form.Item name="username" label="用户名" rules={[{ required: false }]} >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="mobile" label="手机号" rules={[{ required: false }]} >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{ required: false }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value && value.length < 8) {
                                    return Promise.reject(new Error('密码必须大于8位!'));
                                }
                                return Promise.resolve();
                            },
                        })]}>
                            <Input type="password" />
                        </Form.Item>
                        <Form.Item
                            label="重复密码"
                            name="re_password"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: false,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致!'));
                                    },
                                }),
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                更新信息
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </CardPanel>
        </PageContainer>
    );
}

export default PersonSetting;
