import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Select, Button, Input, message, Card, Row, Col } from "antd";
import { AlipayCircleOutlined } from '@ant-design/icons';
import { ProForm, StepsForm, ProFormText, ProFormDateRangePicker, ProFormSelect, ProFormRadio, ProFormDependency } from '@ant-design/pro-components';
import HttpClient from '@/utils/HttpClient';
import { GitFactorInput, GitFactorInputGroup, GitFactorSelector } from '@/components/GitFactorInput';
import "./index.css"
const DialogForm = props => {
    const {
        visible = true,
        onSubmit = () => { },
        onVisibleChange = () => { },
    } = props;
    const form1 = useRef();
    const form2 = useRef();
    const form3 = useRef();
    const [currentStep, setCurrentStep] = useState(0);
    const [factorData, setFactorData] = useState([]);
    const [factorLoading, setFactorLoading] = useState(false);
    const submit = async (_v) => {
        // await field.validateFields();
        // let errors = field.getFieldsError();
        // errors = errors.flatMap(i => i.errors)
        // if (errors && Object.keys(errors).length > 0) {
        //     return;
        // }
        if ((!_v.factors) || _v.factors.length == factorData.length) {
            _v.factors = "";
        }
        else {
            _v.factors = _v.factors.join(",");
        }

        if (await onSubmit(_v)) {
            onVisibleChange(false);
        }
    };

    const close = () => {
        onVisibleChange(false);
    };

    useEffect(() => {
        setCurrentStep(0);
        setFactorData([]);
    }, [visible]);

    return (
        <StepsForm
            onFinish={submit}
            formProps={{
                validateMessages: {
                    required: '此项为必填项',
                },
            }}
            // formRef={formRef}
            current={currentStep}
            onCurrentChange={page => setCurrentStep(page)}
            stepsFormRender={(dom, submitter) => {
                return (
                    <Modal
                        title="创建任务"
                        width={800}
                        onCancel={close}
                        open={visible}
                        footer={submitter}
                        destroyOnClose
                    >
                        {dom}
                    </Modal>
                );
            }}
        >
            <StepsForm.StepForm formRef={form1} title="第一步">
                <ProForm.Group>
                    <ProFormText
                        width="lg"
                        name="git"
                        label="Git"
                        tooltip="Git仓库地址"
                        placeholder="请输入Git仓库地址"
                        rules={[{ required: true }]}
                    />
                    <ProFormText
                        width="sm"
                        name="git_tag"
                        label="Git Tag"
                        tooltip="Git仓库的Tag名称(请确认已经打好了Tag)"
                        rules={[{ required: true }]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="reactive_calc_tag"
                        label="麦昆镜像Tag"
                        tooltip="麦昆预打包的镜像TAG reactive_calc_tag"
                        placeholder="reactive_calc_tag"
                        rules={[{ required: true }]}
                    />
                    <ProFormText
                        width="md"
                        name="freq_factor_pool_name"
                        label="最终因子类名"
                        tooltip="freq_factor_pool_name"
                        placeholder="freq_factor_pool_name"
                        rules={[{ required: true }]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="table_name"
                        label="ClickHouse表名"
                        tooltip="freq_factor_pool_name"
                        placeholder="table_name"
                        rules={[{ required: true }]}
                    />
                    <ProFormRadio.Group
                        initialValue={1}
                        width="md"
                        rules={[{ required: true }]}
                        name="storage_tick_factor"
                        label="是否存储tick因子"
                        options={[{ label: '是', value: 1 }, { label: '否', value: 0 }]}
                    />
                </ProForm.Group>
            </StepsForm.StepForm>
            <StepsForm.StepForm title="第二步">
                <Form.Item
                    name="base_factor_git"
                    label="依赖基础因子"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                console.log(value);
                                if (!value) {
                                    return Promise.resolve();
                                }
                                for (let item of value.split(",")) {
                                    if (!item) {
                                        return Promise.reject(new Error('信息未填写完整!'));
                                    }
                                    for (let sub of item.split("::")) {
                                        if (!sub) {
                                            return Promise.reject(new Error('信息未填写完整!'));
                                        }
                                    }
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]} >
                    <GitFactorInputGroup />
                </Form.Item>
            </StepsForm.StepForm>
            <StepsForm.StepForm title="第三步">
                <Form.Item
                    name="factors"
                    label="选择因子(留空则默认选择全部)">
                    <GitFactorSelector loading={factorLoading} data={factorData} loadData={async () => {
                        let git = form1?.current?.getFieldValue('git');
                        let git_tag = form1?.current?.getFieldValue('git_tag');
                        setFactorLoading(true);
                        let response = await HttpClient.get(`/api/submit/get-all-factor-names?git=${git}&tag=${git_tag}`);
                        setFactorLoading(false);
                        if (response.status !== 200) {
                            message.error("获取因子列表失败!" + response.data.detail);
                            return;
                        }
                        let data = response.data.data;
                        data = data.map((v, i) => {
                            return {
                                key: v,
                                index: i,
                                name: v
                            }
                        });
                        setFactorData(data);
                    }} />
                </Form.Item>
                {/* <ProFormDependency name={['git', 'git_tag']}>
                    {({ git, git_tag }) => {
                        return (
                            <Form.Item
                                name="factors"
                                label="选择因子">
                                <GitFactorSelector data={factorData} loadData={async () => {
                                    console.log(git, git_tag);
                                }} />
                            </Form.Item>
                        );
                    }}
                </ProFormDependency> */}

                {/* <ProFormText width="sm" name="id" label="主合同编号" />
                <ProFormText
                    name="project"
                    width="md"
                    disabled
                    label="项目名称"
                    initialValue="xxxx项目"
                />
                <ProFormText
                    width="xs"
                    name="mangerName"
                    disabled
                    label="商务经理"
                    initialValue="启途"
                /> */}
            </StepsForm.StepForm>
        </StepsForm>
    )
}

export default DialogForm;