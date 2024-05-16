import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Select, Button, Input, message, Card, Row, Col } from "antd";
import { AlipayCircleOutlined } from '@ant-design/icons';
import { ProForm, StepsForm, ProFormText, ProFormDateRangePicker, ProFormSelect, ProFormRadio, ProFormDependency, ModalForm, ProFormCheckbox } from '@ant-design/pro-components';
import HttpClient from '@/utils/HttpClient';
import "./index.css"
const DialogForm = props => {
    const {
        visible = true,
        data = null,
        onSubmit = () => { },
        onVisibleChange = () => { },
    } = props;
    const [form] = Form.useForm();
    const submit = async (_v) => {
        if ((!_v.tools)) {
            _v.tools = "";
        }
        else {
            _v.tools = _v.tools.join(",");
        }
        if (await onSubmit(_v)) {
            onVisibleChange(false);
        }
    };

    const close = () => {
        onVisibleChange(false);
    };

    useEffect(() => {
    }, [visible]);

    return (
        <ModalForm
            title={(data ? "编辑" : "新增") + "智能体"}
            open={visible}
            onOpenChange={onVisibleChange}
            onFinish={submit}
            width={300}
            form={form}
            initialValues={data}>
            <ProForm.Group>
                <ProFormText
                    width="md"
                    name="name"
                    label="智能体名称"
                    tooltip="唯一不可重复"
                    placeholder="请输入名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                />
                <ProFormText
                    width="md"
                    name="description"
                    label="智能体描述"
                    placeholder="请输入智能体描述"
                />
                <ProFormSelect
                    name="base_model"
                    label="基础模型"
                    valueEnum={{
                        "CHAT-GPT4": 'CHAT-GPT4',
                        "CHAT-GPT3.5": 'CHAT-GPT3.5',
                        "CHAT-GLM-6B": 'CHAT-GLM-6B',
                        "QWEN-CHAT-13B": 'QWEN-CHAT-13B',
                    }}
                    placeholder="请选择基础模型"
                    rules={[{ required: true, message: '请选择基础模型' }]}
                />
                <ProFormCheckbox.Group
                    name="tools"
                    label="工具清单"
                    options={['知识库', '代码解释器']}
                />
            </ProForm.Group>
        </ModalForm>
    )
}

export default DialogForm;