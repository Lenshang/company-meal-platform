import React, { useState, useEffect } from 'react';
import { Form, Modal, Select, Button, Input, message, Card } from "antd";
import HttpClient from '@/utils/HttpClient';

const DialogForm = props => {
    const {
        dataSource = {},
        visible = true,
        onSubmit = () => { },
        onVisibleChange = () => { },
        loading = false
    } = props;
    const [field] = Form.useForm();

    const [roleData, setRoleData] = useState([]);

    const submit = async () => {
        await field.validateFields();
        let errors = field.getFieldsError();
        errors = errors.flatMap(i => i.errors)
        if (errors && Object.keys(errors).length > 0) {
            return;
        }

        if (dataSource.id === undefined) {
            let _v = field.getFieldsValue();
            if (await onSubmit(_v)) {
                onVisibleChange(false);
            }
        }
        else {
            let _v = field.getFieldsValue();
            let { status } = dataSource;
            _v.status = status;
            _v.id = dataSource.id;
            if (await onSubmit(_v)) {
                onVisibleChange(false);
            }
        }
    };

    const close = () => {
        onVisibleChange(false);
    };

    const getTitle = () => {
        if (dataSource.id) {
            return "编辑账户";
        }
        return "新增账户";
    };

    const getDisabled = () => {
        if (dataSource.id) {
            return true;
        }

        return false;
    };

    const getRoleIdByName = (name) => {
        if (!name) {
            return null;
        }
        return roleData.filter(item => {
            return roleData[0].label.split("(")[0];
        })[0].value;
    }

    useEffect(() => {
        (async () => {
            let response = await HttpClient.get(`/api/system/role-list`);
            if (response.status !== 200) {
                message.error("获得角色信息失败 " + response.data.detail)
                return [];
            }
            let resp_data = response.data;
            setRoleData(resp_data.map((item) => {
                return { value: item.id, label: item.name + `(${item.description})` };
            }));
        })();
    }, []);
    useEffect(() => {
        // if (field && Object.keys(dataSource).length > 0) {
        //     field.setFieldsValue(dataSource);
        // }
        if (!dataSource.edit) {
            field.resetFields();
        }
        else {
            field.setFieldsValue(dataSource);
        }
    }, [dataSource]);

    return (
        <Modal title={getTitle()} open={visible} onOk={submit} onCancel={close} width="600px">
            <Form
                form={field}
                style={{ width: "100%" }}
                layout="vertical">
                <Form.Item name="username" label="用户名" rules={[{ required: false }]} >
                    <Input />
                </Form.Item>
                <Form.Item name="mobile" label="手机号" rules={[{ required: false }]} >
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: !dataSource.edit }, ({ getFieldValue }) => ({
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
                            required: !dataSource.edit,
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
                <Form.Item label="身份" rules={[{ required: true }]} >
                    {/* <Input name="product_id" defaultValue={dataSource.product_id} /> */}
                    <Select
                        name="role_id"
                        defaultValue={dataSource.role_id}
                        placeholder="请选择身份"
                        showSearch
                        allowClear
                        options={roleData} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default DialogForm;