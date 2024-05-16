import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Dropdown, Space, Modal, message } from 'antd';
import { DownOutlined, ExclamationCircleFilled, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components"
import { useAntdTable } from 'ahooks';
import { UserStatusMapper } from '@/utils/Mapper';
import HttpClient from '@/utils/HttpClient';
import CardPanel from '@/components/CardPanel';
import AddModal from "./components/add";
import { TaskStatusMap } from "@/utils/Mapper";
function SystemUser() {
    const [editVisible, setEditVisible] = useState(false);
    const [editData, setEditData] = useState({});
    const [form] = Form.useForm();
    const {
        tableProps,
        search,
        error,
        refresh
    } = useAntdTable(async ({
        current,
        pageSize
    }, formData) => {
        let query = `skip=${(current - 1) * pageSize}&limit=${pageSize}`;
        // if (formData["mobile"] !== null && formData["mobile"] !== undefined) {
        //     query += `&mobile=${formData["mobile"]}`;
        // }

        let response = await HttpClient.get(`/api/agent/query?${query}`);
        if (response.status !== 200) {
            return [];
        }

        let resp_data = response.data;
        let _data = resp_data.data;
        return {
            total: resp_data.count,
            list: _data
        };
    }, {
        defaultPageSize: 10,
        form
    });
    const { submit, reset } = search;

    const onEditPageVisibalChange = (visible) => {
        setEditVisible(visible);
        if (!visible) {
            refresh();
        }
    };

    const showEditPage = (data = null) => {
        if (data != null) {
            let _data = Object.assign({}, data)
            _data.tools = _data.tools.split(",");
            setEditData(_data);
        }
        else {
            setEditData(null);
        }
        setEditVisible(true);
    };

    const submitEditPage = async (values) => {
        let url = "/api/agent/update";
        let resp = await HttpClient.post(url, values);

        if (resp.status !== 200) {
            message.error("操作失败!" + JSON.stringify(resp.data.detail))
            return false;
        }
        else {
            message.success("操作成功!");
            return true;
        }
    };

    const columns = [
        {
            title: '名称',
            dataIndex: "name",
            width: 50,
        },
        {
            title: '基础模型',
            dataIndex: 'base_model',
            width: 50,
        },
        {
            title: '描述',
            dataIndex: 'description',
            width: 80,
        },
        {
            title: '工具清单',
            dataIndex: 'tools',
            width: 80,
        },
        {
            title: '创建时间',
            dataIndex: 'created_time',
            width: 60,
            render: (v, i, r) => { return v.replace("T", " "); }
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            dataIndex: 'name',
            width: 30,
            render: (v, r, i) => <Dropdown
                menu={{
                    items: [{
                        key: '1',
                        label: '修改',
                        onClick: () => { showEditPage(r); }
                    }],
                }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        操作
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>,
        },
    ];

    const SearchForm = (
        <div>
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="状态" name="status">
                            <Select>
                                <Select.Option value="-99">全部</Select.Option>
                                <Select.Option value="0">Init</Select.Option>
                                <Select.Option value="1">容器待启动</Select.Option>
                                <Select.Option value="2">容器运行中</Select.Option>
                                <Select.Option value="3">运行完毕待评测</Select.Option>
                                <Select.Option value="4">评测中</Select.Option>
                                <Select.Option value="5">评测完毕</Select.Option>
                                <Select.Option value="-1">任务失败</Select.Option>
                                <Select.Option value="-2">手动取消</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} justify="end">
                    <Button type="primary" onClick={submit}>
                        查询
                    </Button>
                    <Button onClick={reset} style={{ marginLeft: 16 }}>
                        重置
                    </Button>
                </Row>
            </Form>
        </div>
    );
    return (
        <PageContainer
            header={{
                breadcrumb: { items: [{ title: '订餐管理' }, { title: '订餐管理' }] },
            }}>
            {/* <CardPanel>
                {SearchForm}
            </CardPanel> */}
            <CardPanel
                style={{ marginTop: "10px" }}
                title={
                    <div style={{ display: "flex" }}>
                        <div>提交记录</div>
                        <div style={{ flex: 1, textAlign: "right" }}>
                            <Button type='primary' onClick={() => { showEditPage(null); }}><PlusOutlined />新增</Button>
                            <Button type="link" shape="circle" onClick={refresh}>
                                <RedoOutlined />
                            </Button>
                        </div>
                    </div>}
            >
                <Table columns={columns} rowKey="name" {...tableProps} scroll={{ x: 1200 }} />
            </CardPanel>
            {/* 弹出式表单 */}
            {editVisible ? <AddModal
                visible={true}
                data={editData}
                onVisibleChange={onEditPageVisibalChange}
                onSubmit={submitEditPage} /> : null}

        </PageContainer>
    );
}
export default SystemUser;